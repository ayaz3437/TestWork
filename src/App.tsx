import './installSesLockdown';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { E, ERef } from '@endo/eventual-send';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';

import {
  brandToInfoAtom,
  walletAtom,
  pursesAtom,
  offersAtom,
} from 'store/store';
import WalletConnection from 'components/WalletConnection';
import { INTER_LOGO } from 'assets/assets';
import Swap from 'components/Swap';

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

const App = () => {
  const [wallet] = useAtom(walletAtom);
  const [_brandToInfo, mergeBrandToInfo] = useAtom(brandToInfoAtom);
  const [_purses, setPurses] = useAtom(pursesAtom);
  const [_offers, setOffers] = useAtom(offersAtom);

  useEffect(() => {
    if (wallet === null) return;

    // TODO: More user-friendly error handling, like a toast.
    watchPurses(wallet, setPurses, mergeBrandToInfo).catch((err: Error) =>
      console.error('got watchPurses err', err)
    );
    watchOffers(wallet, setOffers).catch((err: Error) =>
      console.error('got watchOffers err', err)
    );
  }, [wallet, mergeBrandToInfo, setPurses, setOffers]);

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
