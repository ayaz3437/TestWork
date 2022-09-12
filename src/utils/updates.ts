import { E, ERef } from '@endo/eventual-send';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import {
  iterateLatest,
  makeLeader,
  makeFollower,
  Leader,
} from '@agoric/casting';
import { dappConfig } from 'config';
import type { Metrics, GovernedParams, BrandInfo } from 'store/app';
import type { Marshal } from '@endo/marshal';
import { PursesJSONState } from '@agoric/wallet-backend';

const watchGovernance = async (
  leader: Leader,
  unserializer: Marshal<any>,
  setGovernedParamsIndex: ContractSetters['setGovernedParamsIndex'],
  anchorPetname: string
) => {
  // E.g. ':published.psm.IST.AUSD.governance'
  const spec = dappConfig.INSTANCE_PREFIX + anchorPetname + '.governance';
  const f = makeFollower(spec, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    const current = value.current;
    const GiveStableFee = current.GiveMintedFee.value;
    const MintLimit = current.MintLimit.value;
    const WantStableFee = current.WantMintedFee.value;

    setGovernedParamsIndex([
      [anchorPetname, { GiveStableFee, MintLimit, WantStableFee }],
    ]);
  }
};

const watchMetrics = async (
  leader: Leader,
  unserializer: Marshal<any>,
  setMetricsIndex: ContractSetters['setMetricsIndex'],
  anchorPetname: string
) => {
  // E.g. ':published.psm.IST.AUSD.metrics'
  const spec = dappConfig.INSTANCE_PREFIX + anchorPetname + '.metrics';
  const f = makeFollower(spec, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    setMetricsIndex([[anchorPetname, value]]);
  }
};

const watchInstanceIds = async (
  leader: Leader,
  setters: ContractSetters,
  walletUnserializer: Marshal<any>
) => {
  const f = makeFollower(dappConfig.INSTANCES_KEY, leader, {
    unserializer: walletUnserializer,
    proof: 'none',
  });

  const watchedAnchors = new Set();

  for await (const { value } of iterateLatest(f)) {
    const INSTANCE_NAME_PREFIX = 'psm-IST-';
    // Remove "psm-IST-" prefix so they're like ["AUSD", "board012"]
    const PSMEntries = (value as [string, string][])
      .filter(entry => entry[0].startsWith(INSTANCE_NAME_PREFIX))
      .map(
        ([key, boardId]) =>
          [key.slice(INSTANCE_NAME_PREFIX.length), boardId] as [string, string]
      );

    console.log('instance ids', PSMEntries);

    setters.setInstanceIds(PSMEntries);

    PSMEntries.forEach(([anchorPetname]) => {
      if (!watchedAnchors.has(anchorPetname)) {
        watchedAnchors.add(anchorPetname);

        // TODO: Better error handling (toast?)
        watchMetrics(
          leader,
          walletUnserializer,
          setters.setMetricsIndex,
          anchorPetname
        ).catch(e =>
          console.error('Error watching metrics for', anchorPetname, e)
        );

        watchGovernance(
          leader,
          walletUnserializer,
          setters.setGovernedParamsIndex,
          anchorPetname
        ).catch(e =>
          console.error('Error watching governed params for', anchorPetname, e)
        );
      }
    });
  }
};

declare type ContractSetters = {
  setInstanceIds: (ids: [string, string][]) => void;
  setMetricsIndex: (metrics: [string, Metrics][]) => void;
  setGovernedParamsIndex: (params: [string, GovernedParams][]) => void;
};

export const watchContract = async (wallet: any, setters: ContractSetters) => {
  const [walletUnserializer, netConfig] = await Promise.all([
    E(wallet).getUnserializer(),
    E(wallet).getNetConfig(),
  ]);
  const leader = makeLeader(netConfig);

  watchInstanceIds(leader, setters, walletUnserializer).catch((err: Error) =>
    console.error('got loadInstanceIds err', err)
  );
};

export const watchPurses = async (
  wallet: ERef<any>,
  setPurses: (purses: PursesJSONState[]) => void,
  mergeBrandToInfo: (entries: Iterable<Iterable<any>>) => void
) => {
  const n = await E(wallet).getPursesNotifier();
  for await (const purses of iterateNotifier(n)) {
    setPurses(purses);

    for (const purse of purses as PursesJSONState[]) {
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
