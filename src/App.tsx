import './installSesLockdown';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletBridge from 'components/WalletBridge';
import Swap from 'components/Swap';
import ChainConnection from 'components/ChainConnection';
import { INTER_LOGO } from 'assets/assets';

import 'styles/globals.css';

const App = () => {
  return (
    <>
      <ToastContainer
        position={'bottom-right'}
        closeOnClick={false}
        newestOnTop={true}
        hideProgressBar={true}
        autoClose={false}
      ></ToastContainer>
      <motion.div>
        <motion.div className="min-w-screen container p-4 mx-auto flex justify-between items-center">
          <a href="https://inter.trade/" target="inter.trade">
            <img
              src={INTER_LOGO}
              className="item"
              alt="Inter Logo"
              width="200"
            />
          </a>
          <WalletBridge />
          <ChainConnection />
        </motion.div>
        <motion.div className="min-w-screen container mx-auto flex justify-center mt-16">
          <Swap />
        </motion.div>
      </motion.div>
    </>
  );
};

export default App;
