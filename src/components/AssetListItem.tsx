import { useAtomValue } from 'jotai';

import { Brand } from '@agoric/ertp';
import { displayFunctionsAtom } from 'store/app';
import { FiHelpCircle } from 'react-icons/fi';

const docsFor = (petname: string) =>
  `https://docs.inter.trade/tokens/${petname}`;

const AssetListItem = ({ brand }: { brand: Brand }) => {
  const { displayBrandIcon, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  const icon = displayBrandIcon(brand);
  const petname = displayBrandPetname(brand);
  const docs = docsFor(petname);

  return (
    <div
      key={petname}
      className="flex gap-3 items-center justify-between w-full"
    >
      <div className="flex gap-3 items-center">
        <div className="w-8 h-8 rounded-full">
          <img className="w-8 h-8" src={icon} alt={petname} />
        </div>

        <div className="flex flex-col">
          <h3 className="font-semibold">{petname}</h3>
        </div>
      </div>
      <a
        href={docs}
        target={petname}
        className="text-xl text-blue-500 hover:text-blue-700"
      >
        <FiHelpCircle />
      </a>
    </div>
  );
};

export default AssetListItem;
