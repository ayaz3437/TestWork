/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

import CustomInput from 'components/CustomInput';
import DialogSwap from 'components/DialogSwap';
import { useAtomValue } from 'jotai';
import { brandToInfoAtom, displayFunctionsAtom } from 'store/app';
import { displayPetname } from 'utils/displayFunctions';

const SectionSwap = ({
  type,
  value,
  handleChange,
}: {
  type: string;
  value: bigint;
  handleChange: (value: bigint) => void;
}) => {
  const { displayBrandIcon, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);
  const brandToInfo = useAtomValue(brandToInfoAtom);

  const [open, setOpen] = useState(false);

  const handleBrandSelected = () => {
    console.log('TODO: handle brand selected');
  };

  const handlePurseSelected = () => {
    console.log('TODO: handle purse selected');
  };

  // TODO: Filter brands.
  const brands = [...brandToInfo.keys()];
  const brand = undefined;
  const purse: any | undefined = undefined;

  return (
    <>
      <DialogSwap
        open={open}
        handleClose={() => setOpen(false)}
        brands={brands}
        selectedBrand={brand}
        handleBrandSelected={handleBrandSelected}
        handlePurseSelected={handlePurseSelected}
      />
      <motion.div
        className="flex flex-col bg-alternative p-4 rounded-sm gap-2 select-none"
        layout
      >
        <h3 className="text-xs uppercase text-gray-500 tracking-wide font-medium select-none">
          Swap {type.toUpperCase()}
        </h3>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12">
            <img alt="brand icon" src={displayBrandIcon(brand)} />
          </div>
          {purse ? (
            <div
              className="flex flex-col w-28 hover:bg-black cursor-pointer hover:bg-opacity-5 p-1 rounded-sm"
              onClick={() => {
                setOpen(true);
              }}
            >
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {displayBrandPetname(brand)}
                </h2>
                <FiChevronDown className="text-xl" />
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">
                Purse: <span>{displayPetname(purse.pursePetname)}</span>{' '}
              </h3>
            </div>
          ) : (
            <button
              className="btn-primary text-sm py-1 px-2 w-28"
              onClick={() => setOpen(true)}
            >
              Select asset
            </button>
          )}
          <CustomInput
            value={value}
            onChange={handleChange}
            brand={brand}
            purse={purse}
            showMaxButton={type === 'from'}
          />
        </div>
      </motion.div>
    </>
  );
};

export default SectionSwap;
