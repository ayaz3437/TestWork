import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiRepeat, FiHelpCircle } from 'react-icons/fi';
import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import AnimatedCheckIcon from './AnimatedCheckIcon';
import SectionSwap, { SectionSwapType } from 'components/SectionSwap';
import ContractInfo from 'components/ContractInfo';
import CustomLoader from 'components/CustomLoader';
import {
  brandToInfoAtom,
  walletAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  instanceIdsAtom,
  chainConnectionAtom,
  bridgeApprovedAtom,
  walletUiHrefAtom,
} from 'store/app';
import { instanceIdAtom } from 'store/swap';
import {
  governedParamsAtom,
  metricsAtom,
  fromAmountAtom,
  SwapDirection,
  swapDirectionAtom,
  toAmountAtom,
  addErrorAtom,
  fromPurseAtom,
  toPurseAtom,
  removeErrorAtom,
  SwapError,
  errorsAtom,
} from 'store/swap';
import { makeSwapOffer } from 'services/swap';
import { toast } from 'react-toastify';

const Swap = () => {
  const [swapped, setSwapped] = useState(false);
  const bridgeApproved = useAtomValue(bridgeApprovedAtom);
  const chainConnection = useAtomValue(chainConnectionAtom);
  const brandToInfo = useAtomValue(brandToInfoAtom);
  const metricsIndex = useAtomValue(metricsIndexAtom);
  const governedParamsIndex = useAtomValue(governedParamsIndexAtom);
  const fromAmount = useAtomValue(fromAmountAtom);
  const toAmount = useAtomValue(toAmountAtom);
  const [swapDirection, setSwapDirection] = useAtom(swapDirectionAtom);
  const errors = useAtomValue(errorsAtom);
  const addError = useSetAtom(addErrorAtom);
  const removeError = useSetAtom(removeErrorAtom);
  const instanceId = useAtomValue(instanceIdAtom);
  const wallet = useAtomValue(walletAtom);
  const fromPurse = useAtomValue(fromPurseAtom);
  const toPurse = useAtomValue(toPurseAtom);
  const instanceIds = useAtomValue(instanceIdsAtom);
  const walletUiHref = useAtomValue(walletUiHrefAtom);
  const { mintLimit } = useAtomValue(governedParamsAtom) ?? {};
  const { anchorPoolBalance, mintedPoolBalance } =
    useAtomValue(metricsAtom) ?? {};

  const anchorPetnames = [...instanceIds.keys()];
  const areAnchorsLoaded =
    anchorPetnames.length &&
    anchorPetnames.every(petname => {
      const metrics = metricsIndex.get(petname);
      const brand = metrics?.anchorPoolBalance.brand;
      const brandInfo = brand && brandToInfo.get(brand);
      const governedParams = governedParamsIndex.get(petname);
      return metrics && brandInfo && governedParams;
    });

  const switchToAndFrom = useCallback(() => {
    if (swapDirection === SwapDirection.WantAnchor) {
      setSwapDirection(SwapDirection.WantMinted);
    } else {
      setSwapDirection(SwapDirection.WantAnchor);
    }
  }, [swapDirection, setSwapDirection]);

  const handleSwap = useCallback(async () => {
    if (!areAnchorsLoaded || !bridgeApproved || !wallet || swapped) return;

    const fromValue = fromAmount?.value;
    const toValue = toAmount?.value;

    if (!(fromPurse && toPurse && instanceId)) {
      addError(SwapError.NO_BRANDS);
      return;
    }

    if (!(toValue && toValue > 0n && fromValue && fromValue > 0n)) {
      addError(SwapError.EMPTY_AMOUNTS);
      return;
    }

    if ((fromPurse.value ?? 0n) < fromValue) {
      addError(SwapError.PURSE_BALANCE);
      return;
    }

    if (swapDirection === SwapDirection.WantMinted) {
      if (!mintLimit || !mintedPoolBalance) {
        addError(SwapError.MINT_LIMIT);
        return;
      }

      const valueLeftToMint =
        (mintLimit.value ?? 0n) >= (mintedPoolBalance.value ?? 0n)
          ? (mintLimit.value ?? 0n) - (mintedPoolBalance.value ?? 0n)
          : 0n;
      if (toValue > valueLeftToMint) {
        addError(SwapError.MINT_LIMIT);
        return;
      }
    }

    if (swapDirection === SwapDirection.WantAnchor) {
      if (!anchorPoolBalance || toValue > (anchorPoolBalance.value ?? 0n)) {
        addError(SwapError.ANCHOR_LIMIT);
        return;
      }
    }

    try {
      await makeSwapOffer({
        instanceId,
        wallet,
        fromPurse,
        fromValue,
        toPurse,
        toValue,
        swapDirection,
        marshal: chainConnection.unserializer,
      });
      setSwapped(true);
      setTimeout(() => {
        setSwapped(false);
      }, 3000);
      toast.success(
        <p>
          Swap offer sent to{' '}
          <a
            className="underline text-blue-500"
            href={walletUiHref}
            target="_blank"
            rel="noreferrer"
          >
            {walletUiHref}
          </a>{' '}
          for approval.
        </p>,
        { hideProgressBar: false, autoClose: 5000 }
      );
    } catch (e) {
      toast.error(
        <p>
          A problem occurred when sending the swap offer to{' '}
          <a
            className="underline text-blue-500"
            href={walletUiHref}
            target="_blank"
            rel="noreferrer"
          >
            {walletUiHref}
          </a>
          .
        </p>
      );
    }
  }, [
    areAnchorsLoaded,
    bridgeApproved,
    wallet,
    swapped,
    fromAmount?.value,
    toAmount?.value,
    fromPurse,
    toPurse,
    instanceId,
    swapDirection,
    addError,
    mintLimit,
    mintedPoolBalance,
    anchorPoolBalance,
    chainConnection?.unserializer,
    walletUiHref,
  ]);

  useEffect(() => {
    removeError(SwapError.EMPTY_AMOUNTS);
    removeError(SwapError.PURSE_BALANCE);
    removeError(SwapError.MINT_LIMIT);
    removeError(SwapError.ANCHOR_LIMIT);
  }, [fromAmount, toAmount, removeError]);

  useEffect(() => {
    removeError(SwapError.NO_BRANDS);
    removeError(SwapError.EMPTY_AMOUNTS);
    removeError(SwapError.PURSE_BALANCE);
    removeError(SwapError.MINT_LIMIT);
    removeError(SwapError.ANCHOR_LIMIT);
  }, [toPurse, fromPurse, removeError]);

  const errorsToRender: JSX.Element[] = [];
  errors.forEach(e => {
    errorsToRender.push(
      <motion.h3 key={e} layout className="text-red-600">
        {e}
      </motion.h3>
    );
  });

  const form = !areAnchorsLoaded ? (
    <CustomLoader text="Loading contract data from chain" />
  ) : (
    <motion.div
      className="flex flex-col gap-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div className="flex flex-col gap-4 relative">
        <SectionSwap type={SectionSwapType.FROM} />
        <FiRepeat
          className="transform rotate-90 p-1 bg-alternative absolute left-6 position-swap-icon cursor-pointer hover:bg-alternativeDark z-20 border-4 border-white box-border"
          size="30"
          onClick={switchToAndFrom}
        />
      </div>
      <SectionSwap type={SectionSwapType.TO} />
    </motion.div>
  );

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
        <h1 className="text-2xl font-semibold text-slate-800">IST Swap</h1>
        <span className="text-2xl text-blue-500 hover:text-blue-700">
          <a
            href="https://docs.inter.trade/user-how-to/minting-ist/mainnet-minting-ist-using-the-psm"
            target="psm_guide"
          >
            <FiHelpCircle />
          </a>
        </span>
      </motion.div>
      {chainConnection ? (
        form
      ) : (
        <CustomLoader text="Connect Keplr to continue" />
      )}
      <ContractInfo />
      <motion.button
        className={clsx(
          'flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-medium p-3 uppercase',
          areAnchorsLoaded && bridgeApproved
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500 cursor-not-allowed'
        )}
        onClick={handleSwap}
      >
        <motion.div className="relative flex flex-row w-full justify-center items-center">
          <div className="w-6" />
          <div className="text-white w-fit">Create Swap Offer</div>
          <AnimatedCheckIcon isVisible={swapped} />
        </motion.div>
      </motion.button>
      {errorsToRender}
    </motion.div>
  );
};

export default Swap;
