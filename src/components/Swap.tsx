import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRepeat, FiCheck } from 'react-icons/fi';
import { BiErrorCircle } from 'react-icons/bi';
import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';

import SectionSwap, { SectionSwapType } from 'components/SectionSwap';
import ContractInfo from 'components/ContractInfo';
import CustomLoader from 'components/CustomLoader';
import {
  brandToInfoAtom,
  offersAtom,
  walletAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  instanceIdsAtom,
} from 'store/app';
import { instanceIdAtom } from 'store/swap';
import {
  fromAmountAtom,
  SwapDirection,
  swapDirectionAtom,
  toAmountAtom,
  toastIdAtom,
  swapInProgressAtom,
  currentOfferIdAtom,
  addErrorAtom,
  fromPurseAtom,
  toPurseAtom,
  removeErrorAtom,
  SwapError,
  swapButtonStatusAtom,
  defaultToastProperties,
  ButtonStatus,
  errorsAtom,
} from 'store/swap';
import { doSwap } from 'services/swap';

const Swap = () => {
  const brandToInfo = useAtomValue(brandToInfoAtom);
  const metricsIndex = useAtomValue(metricsIndexAtom);
  const governedParamsIndex = useAtomValue(governedParamsIndexAtom);
  const fromAmount = useAtomValue(fromAmountAtom);
  const toAmount = useAtomValue(toAmountAtom);
  const [swapDirection, setSwapDirection] = useAtom(swapDirectionAtom);
  const [toastId, setToastId] = useAtom(toastIdAtom);
  const [swapped, setSwapped] = useAtom(swapInProgressAtom);
  const [currentOfferId, setCurrentOfferId] = useAtom(currentOfferIdAtom);
  const errors = useAtomValue(errorsAtom);
  const addError = useSetAtom(addErrorAtom);
  const removeError = useSetAtom(removeErrorAtom);
  const instanceId = useAtomValue(instanceIdAtom);
  const walletP = useAtomValue(walletAtom);
  const fromPurse = useAtomValue(fromPurseAtom);
  const toPurse = useAtomValue(toPurseAtom);
  const offers = useAtomValue(offersAtom);
  const [swapButtonStatus, setSwapButtonStatus] = useAtom(swapButtonStatusAtom);
  const instanceIds = useAtomValue(instanceIdsAtom);

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

  const handleSwap = useCallback(() => {
    if (!areAnchorsLoaded) return;

    const fromValue = fromAmount?.value;
    const toValue = toAmount?.value;

    doSwap({
      setToastId,
      setSwapped,
      setCurrentOfferId,
      addError,
      swapped,
      instanceId,
      walletP,
      fromPurse,
      fromValue,
      toPurse,
      toValue,
      swapDirection,
    });
  }, [
    setCurrentOfferId,
    setSwapped,
    setToastId,
    addError,
    areAnchorsLoaded,
    fromAmount?.value,
    fromPurse,
    instanceId,
    swapDirection,
    swapped,
    toAmount?.value,
    toPurse,
    walletP,
  ]);

  useEffect(() => {
    removeError(SwapError.EMPTY_AMOUNTS);
  }, [fromAmount, toAmount, removeError]);

  useEffect(() => {
    if (fromPurse && toPurse) {
      removeError(SwapError.NO_BRANDS);
    }
  }, [toPurse, fromPurse, removeError]);

  useEffect(() => {
    if (!swapped) {
      removeError(SwapError.IN_PROGRESS);
    }
  }, [swapped, removeError]);

  useEffect(() => {
    if (swapped && offers && toastId) {
      const currentOffer = offers.find(
        ({ id, rawId }) => rawId === currentOfferId || id === currentOfferId
      );
      const swapStatus = currentOffer?.status;
      if (swapStatus === 'accept') {
        setSwapButtonStatus(ButtonStatus.SWAPPED);
        toast.update(toastId, {
          render: 'Tokens successfully swapped',
          type: toast.TYPE.SUCCESS,
          ...defaultToastProperties,
        });
        setToastId(null);
      } else if (swapStatus === 'decline') {
        setSwapButtonStatus(ButtonStatus.DECLINED);
        toast.update(toastId, {
          render: 'Swap offer declined',
          type: toast.TYPE.ERROR,
          ...defaultToastProperties,
        });
        setToastId(null);
      } else if (currentOffer?.error) {
        setSwapButtonStatus(ButtonStatus.REJECTED);
        toast.update(toastId, {
          render: 'Swap offer rejected by contract',
          type: toast.TYPE.WARNING,
          ...defaultToastProperties,
        });
        setToastId(null);
      }
      if (
        swapStatus === 'accept' ||
        swapStatus === 'decline' ||
        currentOffer?.error
      ) {
        setCurrentOfferId(null);
        setTimeout(() => {
          setSwapped(false);
          setSwapButtonStatus(ButtonStatus.SWAP);
        }, 3000);
      }
    }
  }, [
    currentOfferId,
    offers,
    setCurrentOfferId,
    setSwapButtonStatus,
    setSwapped,
    setToastId,
    swapped,
    toastId,
  ]);

  const errorsToRender: JSX.Element[] = [];
  errors.forEach(e => {
    errorsToRender.push(
      <motion.h3 key={e} layout className="text-red-600">
        {e}
      </motion.h3>
    );
  });

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
      </motion.div>
      {!areAnchorsLoaded ? (
        <CustomLoader text="Please connect wallet" />
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
      )}
      <ContractInfo />
      <motion.button
        className={clsx(
          'flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-medium p-3  uppercase',
          areAnchorsLoaded
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500'
        )}
        onClick={handleSwap}
      >
        <motion.div className="relative flex-row w-full justify-center items-center">
          {swapped && swapButtonStatus === 'Swap' && (
            <div className="absolute right-0">
              <Oval color="#fff" height={28} width={28} />
            </div>
          )}
          {swapped && swapButtonStatus === 'Swapped' && (
            <FiCheck className="absolute right-0" size={28} />
          )}
          {swapped &&
            (swapButtonStatus === ButtonStatus.REJECTED ||
              swapButtonStatus === ButtonStatus.DECLINED) && (
              <BiErrorCircle className="absolute right-0" size={28} />
            )}
          <div className="text-white">{swapButtonStatus}</div>
        </motion.div>
      </motion.button>
      {errorsToRender}
    </motion.div>
  );
};

export default Swap;
