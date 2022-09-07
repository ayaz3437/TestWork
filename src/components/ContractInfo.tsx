import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { displayFunctionsAtom, governedParamsAtom } from 'store/app';
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
  const { displayPercent } = useAtomValue(displayFunctionsAtom);

  const swapDirection = useAtomValue(swapDirectionAtom);
  const fee =
    swapDirection === SwapDirection.TO_STABLE ? WantStableFee : GiveStableFee;

  return fee ? (
    <motion.div className="flex flex-col" layout>
      <InfoItem>
        Exchange Rate
        <div className="pr-2">1 : 1</div>
      </InfoItem>
      <InfoItem>
        Fee
        <div className="pr-2">{displayPercent(fee, 2)}%</div>
      </InfoItem>
    </motion.div>
  ) : (
    <></>
  );
};

export default ContractInfo;
