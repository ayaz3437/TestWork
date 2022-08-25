import './installSesLockdown';
import { motion } from 'framer-motion';
import WalletConnection from 'components/WalletConnection';
import { INTER_LOGO } from 'assets/assets';
import Swap from 'components/Swap';

const App = () => {
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
