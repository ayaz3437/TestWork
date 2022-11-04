import { useAtomValue } from 'jotai';

import { displayFunctionsAtom } from 'store/app';

// Ambient
import '@agoric/ertp/src/types';

const AssetListItem = ({ brand }: { brand: Brand }) => {
  const { displayBrandIcon, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  const icon = displayBrandIcon(brand);
  const petname = displayBrandPetname(brand);

  return (
    <button
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
    </button>
  );
};

export default AssetListItem;
