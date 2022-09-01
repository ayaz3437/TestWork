import { E, ERef } from '@endo/eventual-send';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import {
  iterateLatest,
  makeLeader,
  makeFollower,
  Leader,
} from '@agoric/casting';
import { dappConfig } from 'config';
import { identityMarshal } from 'utils/identityMarshal';
import type { Metrics, GovernedParams, BrandInfo } from 'store/app';
import type { Marshal } from '@endo/marshal';

const watchGovernance = async (
  leader: Leader,
  unserializer: Marshal<any>,
  setGovernedParams: (params: GovernedParams) => void
) => {
  const f = makeFollower(dappConfig.GOVERNANCE_KEY, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    setGovernedParams(value);
  }
};

const watchMetrics = async (
  leader: Leader,
  unserializer: Marshal<any>,
  setMetrics: (metrics: Metrics) => void
) => {
  const f = makeFollower(dappConfig.METRICS_KEY, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    setMetrics(value);
  }
};

const loadInstanceId = async (
  leader: Leader,
  setInstanceId: (id: string | undefined) => void
) => {
  const f = makeFollower(dappConfig.INSTANCES_KEY, leader, {
    unserializer: identityMarshal,
    proof: 'none',
  });

  for await (const { value } of iterateLatest(f)) {
    const mappedEntries = new Map<string, string>(value);
    setInstanceId(mappedEntries.get('psm'));
  }
};

declare type ContractSetters = {
  setInstanceId: (id: string | undefined) => void;
  setMetrics: (metrics: Metrics) => void;
  setGovernedParams: (params: GovernedParams) => void;
};

export const watchContract = async (wallet: any, setters: ContractSetters) => {
  const { setInstanceId, setMetrics, setGovernedParams } = setters;

  const [unserializer, netConfig] = await Promise.all([
    E(wallet).getUnserializer(),
    E(wallet).getNetConfig(),
  ]);
  const leader = makeLeader(netConfig);

  watchMetrics(leader, unserializer, setMetrics).catch((err: Error) =>
    console.error('got watchMetrics err', err)
  );

  watchGovernance(leader, unserializer, setGovernedParams).catch((err: Error) =>
    console.error('got watchGovernance err', err)
  );

  loadInstanceId(leader, setInstanceId).catch((err: Error) =>
    console.error('got loadInstnaceId err', err)
  );
};

export const watchPurses = async (
  wallet: ERef<any>,
  setPurses: (purses: any) => void,
  mergeBrandToInfo: (entries: Iterable<Iterable<any>>) => void
) => {
  const n = await E(wallet).getPursesNotifier();
  for await (const purses of iterateNotifier(n)) {
    setPurses(purses);

    for (const purse of purses) {
      const { brand, displayInfo, brandPetname: petname } = purse;
      const decimalPlaces = displayInfo && displayInfo.decimalPlaces;
      const assetKind = displayInfo && displayInfo.assetKind;
      const newInfo: BrandInfo = {
        petname,
        assetKind,
        decimalPlaces,
      };

      mergeBrandToInfo([[brand, newInfo]]);
    }
  }
};

export const watchOffers = async (
  wallet: any,
  setOffers: (offers: any) => void
) => {
  const offerNotifier = E(wallet).getOffersNotifier();
  for await (const offers of iterateNotifier(offerNotifier)) {
    setOffers(offers);
  }
};
