import { AmountMath, AssetKind, Brand } from '@agoric/ertp';
import { useState } from 'react';
import { parseAsValue, stringifyValue } from '@agoric/ui-components';
import { useAtomValue } from 'jotai';
import { displayFunctionsAtom } from 'store/app';
import { PursesJSONState } from '@agoric/wallet-backend';

const CustomInput = ({
  value,
  onChange,
  brand,
  purse,
  showMaxButton = false,
  disabled = false,
}: {
  onChange: (value: bigint) => void;
  value?: bigint;
  brand?: Brand | null;
  purse?: PursesJSONState | null;
  showMaxButton?: boolean;
  disabled?: boolean;
}) => {
  const { displayAmount, getDecimalPlaces } =
    useAtomValue(displayFunctionsAtom);

  const decimalPlaces = (brand && getDecimalPlaces(brand)) || 0;
  const onMax = () => purse && onChange(purse.value);

  const amountString = stringifyValue(value, AssetKind.NAT, decimalPlaces, 4);
  const [fieldString, setFieldString] = useState(
    value === null ? '0' : amountString
  );

  const currentAmount = purse
    ? displayAmount(AmountMath.make(purse.brand, purse.value), 4)
    : '0.0';

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const str = ev.target?.value?.replace('-', '').replace('e', '');
    setFieldString(str);
    const parsed = parseAsValue(str, AssetKind.NAT, decimalPlaces);
    onChange(parsed);
  };

  const displayString =
    value === parseAsValue(fieldString, AssetKind.NAT, decimalPlaces)
      ? fieldString
      : amountString;

  return (
    <div className="relative flex-grow">
      {showMaxButton && (
        <div className="absolute top-3 left-3">
          <button
            className={
              'bg-transparent hover:bg-gray-100 text-primary font-semibold py-[3px] px-1 border border-primary rounded text-xs leading-3'
            }
            disabled={disabled}
            onClick={onMax}
          >
            Max
          </button>
        </div>
      )}
      <input
        type="number"
        placeholder="0.0"
        value={displayString}
        onChange={handleInputChange}
        className={`rounded-sm bg-white bg-opacity-100 text-xl p-3 leading-6 w-full hover:outline-none focus:outline-none border-none ${
          showMaxButton ? 'pl-[52px]' : 'pl-[12px]'
        }`}
        disabled={disabled || !purse}
        min="0"
      />
      {purse && (
        <div className="absolute right-1 top-0 text-gray-400 flex flex-col text-right text-sm">
          <div>Balance: {currentAmount}</div>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
