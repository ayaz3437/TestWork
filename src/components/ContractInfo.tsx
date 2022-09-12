import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
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
  const { GiveStableFee, WantStableFee } =
    useAtomValue(governedParamsAtom) ?? {};
  const { anchorPoolBalance } = useAtomValue(metricsAtom) ?? {};
  const { displayPercent, displayAmount, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  const swapDirection = useAtomValue(swapDirectionAtom);
  const fee =
    swapDirection === SwapDirection.TO_STABLE ? WantStableFee : GiveStableFee;

  return fee && anchorPoolBalance ? (
    <motion.div className="flex flex-col" layout>
      <InfoItem>
        Exchange Rate
        <div className="pr-2">1 : 1</div>
      </InfoItem>
      <InfoItem>
        Fee
        <div className="pr-2">{displayPercent(fee, 2)}%</div>
      </InfoItem>
      <InfoItem>
        Reserve Balance
        <div className="pr-2">
          {displayAmount(anchorPoolBalance, 2)}{' '}
          {displayBrandPetname(anchorPoolBalance?.brand)}
        </div>
      </InfoItem>
    </motion.div>
  ) : (
    <></>
  );
};

export default ContractInfo;
