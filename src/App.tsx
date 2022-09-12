import './installSesLockdown';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  brandToInfoAtom,
  walletAtom,
  pursesAtom,
  offersAtom,
  instanceIdsAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
} from 'store/app';
import WalletConnection from 'components/WalletConnection';
import { INTER_LOGO } from 'assets/assets';
import Swap from 'components/Swap';
import { watchContract, watchPurses, watchOffers } from 'utils/updates';

import 'styles/globals.css';

const App = () => {
  const [wallet] = useAtom(walletAtom);
  const [_brandToInfo, mergeBrandToInfo] = useAtom(brandToInfoAtom);
  const [_purses, setPurses] = useAtom(pursesAtom);
  const [_offers, setOffers] = useAtom(offersAtom);
  const [_metrics, setMetricsIndex] = useAtom(metricsIndexAtom);
  const [_governedParams, setGovernedParamsIndex] = useAtom(
    governedParamsIndexAtom
  );
  const [_instanceIds, setInstanceIds] = useAtom(instanceIdsAtom);

  useEffect(() => {
    if (wallet === null) return;

    // TODO: More user-friendly error handling, like a toast.
    watchPurses(wallet, setPurses, mergeBrandToInfo).catch((err: Error) =>
      console.error('got watchPurses err', err)
    );
    watchOffers(wallet, setOffers).catch((err: Error) =>
      console.error('got watchOffers err', err)
    );

    watchContract(wallet, {
      setMetricsIndex,
      setGovernedParamsIndex,
      setInstanceIds,
    });
  }, [
    wallet,
    mergeBrandToInfo,
    setPurses,
    setOffers,
    setMetricsIndex,
    setGovernedParamsIndex,
    setInstanceIds,
  ]);

  return (
    <>
      <ToastContainer
        enableMultiContainer
        containerId={'Info'}
        position={'bottom-center'}
        closeOnClick={false}
        newestOnTop={true}
        hideProgressBar={true}
        autoClose={false}
      ></ToastContainer>
      <motion.div>
        <motion.div className="min-w-screen container p-4 mx-auto flex justify-between items-center">
          <img src={INTER_LOGO} className="item" alt="Inter Logo" width="200" />
          <WalletConnection />
        </motion.div>
        <motion.div className="min-w-screen container mx-auto flex justify-center mt-16">
          <Swap />
        </motion.div>
      </motion.div>
    </>
  );
};

export default App;
