import { useId } from 'react';
import { useAtomValue } from 'jotai';

import { displayFunctionsAtom } from 'store/app';
import type { Brand } from 'store/app';

const AssetListItem = ({ brand }: Brand) => {
  const { displayBrandIcon, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  return (
    <div
      key={useId()}
      className="flex gap-3 items-center justify-between w-full"
    >
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full">
          <img src={displayBrandIcon(brand)} alt={displayBrandPetname(brand)} />
        </div>

        <div className="flex flex-col">
          <h3 className="uppercase font-semibold">
            {displayBrandPetname(brand)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AssetListItem;
