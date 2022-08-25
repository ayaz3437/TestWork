import { motion } from 'framer-motion';
import CustomLoader from 'components/CustomLoader';
import clsx from 'clsx';

const Swap = () => {
  const assetsLoaded = false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, boxShadow: 'none' }}
      animate={{
        opacity: 1,
        boxShadow: '0px 0px 99px var(--color-glow)',
      }}
      transition={{ duration: 0.4 }}
      className="flex flex-col p-4 rounded-sm gap-4 w-screen max-w-lg relative select-none overflow-hidden"
    >
      <motion.div className="flex justify-between items-center gap-8 " layout>
        <h1 className="text-2xl font-semibold text-slate-800">PSM Exchange</h1>
      </motion.div>
      {!assetsLoaded ? <CustomLoader text="Waiting for wallet..." /> : <></>}
      <motion.button
        className={clsx(
          'flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-medium p-3  uppercase',
          assetsLoaded
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500'
        )}
        onClick={() => {
          console.log('TODO handle swap');
        }}
      >
        <motion.div className="relative flex-row w-full justify-center items-center">
          <div className="text-white">Swap</div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default Swap;
