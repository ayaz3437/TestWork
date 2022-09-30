import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { AmountMath } from '@agoric/ertp';

import { displayFunctionsAtom } from 'store/app';
import { governedParamsAtom, metricsAtom } from 'store/swap';
import { swapDirectionAtom, SwapDirection } from 'store/swap';

const InfoItem = ({
  children,
}: {
  children: Array<JSX.Element | string> | JSX.Element | string;
}) => (
  <div className="flex text-gray-400 justify-between items-center">
    {children}
  </div>
);

const ContractInfo = () => {
  const { giveMintedFee, wantMintedFee, mintLimit } =
    useAtomValue(governedParamsAtom) ?? {};
  const { anchorPoolBalance, mintedPoolBalance } =
    useAtomValue(metricsAtom) ?? {};
  const { displayPercent, displayAmount, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  const swapDirection = useAtomValue(swapDirectionAtom);
  const fee =
    swapDirection === SwapDirection.WantMinted ? wantMintedFee : giveMintedFee;

  const anchorAvailable = useMemo(() => {
    if (!anchorPoolBalance) return null;

    return (
      <InfoItem>
        {displayBrandPetname(anchorPoolBalance.brand)} Available
        <div className="pr-2">
          {anchorPoolBalance && displayAmount(anchorPoolBalance)}
        </div>
      </InfoItem>
    );
  }, [anchorPoolBalance, displayAmount, displayBrandPetname]);

  const mintedAvailable = useMemo(() => {
    if (!mintLimit || !mintedPoolBalance) return null;

    return (
      <InfoItem>
        {displayBrandPetname(mintLimit?.brand)} Available
        <div className="pr-2">
          {displayAmount(AmountMath.subtract(mintLimit, mintedPoolBalance))}
        </div>
      </InfoItem>
    );
  }, [mintLimit, mintedPoolBalance, displayAmount, displayBrandPetname]);

  const amountAvailable =
    swapDirection === SwapDirection.WantMinted
      ? mintedAvailable
      : anchorAvailable;

  return fee && amountAvailable ? (
    <motion.div className="flex flex-col" layout>
      <InfoItem>
        Exchange Rate
        <div className="pr-2">1 : 1</div>
      </InfoItem>
      <InfoItem>
        Fee
        <div className="pr-2">{displayPercent(fee, 2)}%</div>
      </InfoItem>
      {amountAvailable}
    </motion.div>
  ) : (
    <></>
  );
};

export default ContractInfo;
