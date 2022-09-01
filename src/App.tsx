import './installSesLockdown';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAtom } from 'jotai';

import {
  brandToInfoAtom,
  walletAtom,
  pursesAtom,
  offersAtom,
  instanceIdAtom,
  governedParamsAtom,
  metricsAtom,
} from 'store/app';
import WalletConnection from 'components/WalletConnection';
import { INTER_LOGO } from 'assets/assets';
import Swap from 'components/Swap';
import { watchContract, watchPurses, watchOffers } from 'utils/updates';

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
