/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { FiChevronLeft } from 'react-icons/fi';

import { Brand } from '@agoric/ertp';
import ListItem from 'components/ListItem';
import PurseListItem from 'components/PurseListItem';
import SkeletonPurseDialog from 'components/SkeletonPurseDialog';
import { displayFunctionsAtom, pursesAtom } from 'store/app';
import { filterPursesByBrand } from 'utils/helpers';

const PurseDialog = ({
  purseOnly,
  brand,
  resetBrand,
  handlePurseSelected,
}: {
  purseOnly: boolean;
  brand: Brand;
  resetBrand: () => void;
  handlePurseSelected: (purse: any) => void;
}) => {
  const purses = useAtomValue(pursesAtom);
  assert(purses, 'no purses in atom');
  const { displayBrandPetname, displayBrandIcon } =
    useAtomValue(displayFunctionsAtom);

  if (!brand) return <SkeletonPurseDialog />;

  const pursesForBrand = filterPursesByBrand(purses, brand);

  return (
    <>
      {!purseOnly && (
        <button
          className="uppercase font-medium flex gap-1 hover:bg-gray-100 p-1 m-3 w-max"
          onClick={resetBrand}
        >
          <FiChevronLeft className="text-xl text-primary" />
          <div className="text-sm"> Go back to asset List</div>
        </button>
      )}

      <div
        className={clsx(
          'flex gap-3 items-center justify-between w-full border-b px-5 ',
          !purseOnly ? 'pb-3' : 'py-3'
        )}
      >
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full">
            <img
              src={displayBrandIcon(brand)}
              alt={displayBrandPetname(brand)}
            />
          </div>

          <div className="flex flex-col">
            <h3 className="uppercase font-semibold">
              {displayBrandPetname(brand)}
            </h3>
          </div>
        </div>
      </div>
      <div className="px-5 py-3">
        <h2 className="text-lg font-medium ">Select Purse</h2>
      </div>

      <div className="flex flex-col px-5 pb-5 gap-4 overflow-auto">
        {pursesForBrand?.map((purse: any) => (
          <div
            key={purse.pursePetname}
            onClick={() => handlePurseSelected(purse)}
          >
            <ListItem>
              <PurseListItem purse={purse} />
            </ListItem>
          </div>
        ))}
        {!pursesForBrand?.length && (
          <h2 className="text-gray-500">No purses found.</h2>
        )}
      </div>
    </>
  );
};

export default PurseDialog;
