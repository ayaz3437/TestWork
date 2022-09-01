import { AmountMath } from '@agoric/ertp';
import { useAtomValue } from 'jotai';
import { displayFunctionsAtom } from 'store/app';

const PurseListItem = ({ purse }: { purse: any }) => {
  const { displayAmount } = useAtomValue(displayFunctionsAtom);
  const balance = displayAmount(AmountMath.make(purse.brand, purse.value), 4);

  return (
    <div className="flex gap-3 items-center justify-between w-full">
      <h3 className="text-md font-medium">{purse.pursePetname}</h3>
      <div className="text-right">
        <h4 className="text-sm text-gray-500">Balance: {balance}</h4>
      </div>
    </div>
  );
};

export default PurseListItem;
