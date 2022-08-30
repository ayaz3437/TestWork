import './installSesLockdown';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { E, ERef } from '@endo/eventual-send';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { iterateLatest, makeLeader, makeFollower } from '@agoric/casting';

import {
  brandToInfoAtom,
  walletAtom,
  pursesAtom,
  offersAtom,
  instanceIdAtom,
  governedParamsAtom,
  metricsAtom,
} from 'store/store';
import WalletConnection from 'components/WalletConnection';
import { INTER_LOGO } from 'assets/assets';
import Swap from 'components/Swap';
import { dappConfig } from 'util/config';
import { boardIdUnserializer } from 'utils/boardIdUnserializer';

const watchPurses = async (
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

      const newInfo = {
        petname,
        assetKind,
        decimalPlaces,
      };

      mergeBrandToInfo([[brand, newInfo]]);
    }
  }
};

const watchOffers = async (wallet: any, setOffers: (offers: any) => void) => {
  const offerNotifier = E(wallet).getOffersNotifier();
  for await (const offers of iterateNotifier(offerNotifier)) {
    setOffers(offers);
  }
};

const watchGovernance = async (
  leader: any,
  unserializer: any,
  setGovernedParams: (params: any) => void
) => {
  const f = makeFollower(dappConfig.GOVERNANCE_KEY, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    setGovernedParams(value);
  }
};

const watchMetrics = async (
  leader: any,
  unserializer: any,
  setMetrics: (metrics: any) => void
) => {
  const f = makeFollower(dappConfig.METRICS_KEY, leader, { unserializer });

  for await (const { value } of iterateLatest(f)) {
    setMetrics(value);
  }
};

const loadInstanceId = async (
  leader: any,
  setInstanceId: (id: string | undefined) => void
) => {
  const f = makeFollower(dappConfig.INSTANCES_KEY, leader, {
    unserializer: boardIdUnserializer,
    proof: 'none',
  });

  for await (const { value } of iterateLatest(f)) {
    const mappedEntries = new Map<string, string>(value);
    setInstanceId(mappedEntries.get('psm'));
  }
};

const watchContract = async (wallet: any, setters: any) => {
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

const App = () => {
  const [wallet] = useAtom(walletAtom);
  const [_brandToInfo, mergeBrandToInfo] = useAtom(brandToInfoAtom);
  const [_purses, setPurses] = useAtom(pursesAtom);
  const [_offers, setOffers] = useAtom(offersAtom);
  const [_metrics, setMetrics] = useAtom(metricsAtom);
  const [_governedParams, setGovernedParams] = useAtom(governedParamsAtom);
  const [_instanceId, setInstanceId] = useAtom(instanceIdAtom);

  useEffect(() => {
    if (wallet === null) return;

    // TODO: More user-friendly error handling, like a toast.
    watchPurses(wallet, setPurses, mergeBrandToInfo).catch((err: Error) =>
      console.error('got watchPurses err', err)
    );
    watchOffers(wallet, setOffers).catch((err: Error) =>
      console.error('got watchOffers err', err)
    );

    watchContract(wallet, { setMetrics, setGovernedParams, setInstanceId });
  }, [
    wallet,
    mergeBrandToInfo,
    setPurses,
    setOffers,
    setMetrics,
    setGovernedParams,
    setInstanceId,
  ]);

  return (
    <motion.div>
      <motion.div className="min-w-screen container p-4 mx-auto flex justify-between items-center">
        <img src={INTER_LOGO} className="item" alt="Inter Logo" width="200" />
        <WalletConnection />
      </motion.div>
      <motion.div className="min-w-screen container mx-auto flex justify-center mt-16">
        <Swap />
      </motion.div>
    </motion.div>
  );
};

export default App;
