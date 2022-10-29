import { useAtom } from 'jotai';
import { FiX } from 'react-icons/fi';
import { GrAnnounce } from 'react-icons/gr';
import { motion, AnimatePresence } from 'framer-motion';
import { bannerIndexDismissedAtom } from 'store/app';

// UPDATE WHENEVER COMPONENT IS MODIFIED.
export const currentBannerIndex = 0;

const AnnouncementBanner = () => {
  const [bannerIndexDismissed, setBannerIndexDismissed] = useAtom(
    bannerIndexDismissedAtom
  );

  const isVisible = currentBannerIndex > bannerIndexDismissed;

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial="open"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: 'auto' },
            collapsed: { height: 0 },
          }}
          className="bg-yellow-400 overflow-hidden"
        >
          <motion.div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
            <motion.div className="flex flex-wrap items-center justify-between">
              <motion.div className="flex w-0 flex-1 items-center">
                <span className="flex rounded-lgp-2">
                  <GrAnnounce className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="ml-3 font-medium text-black">
                  Thanks for your interest in the PSM launch!{' '}
                  <a
                    className="rounded-sm underline focus:outline-none focus:ring-2 focus:ring-white"
                    href="https://community.agoric.com/t/ist-minting-limits-for-inter-protocol-mvp-launch/87"
                    target="mvp-mint-limits"
                  >
                    IST minting limits for Inter Protocol MVP launch
                  </a>{' '}
                  are limited for the first 7 days.
                </p>
              </motion.div>
              <motion.div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                <button
                  onClick={() => setBannerIndexDismissed(currentBannerIndex)}
                  type="button"
                  className="-mr-1 flex rounded-md p-2 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
