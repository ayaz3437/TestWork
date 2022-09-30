import { displayPetname } from 'utils/displayFunctions';
import { PursesJSONState } from '@agoric/wallet-backend';
import { Amount, Brand } from '@agoric/ertp';
import { atom } from 'jotai';
import {
  Ratio,
  makeRatioFromAmounts,
  floorMultiplyBy,
  oneMinus,
  ceilDivideBy,
  ceilMultiplyBy,
} from '@agoric/zoe/src/contractSupport';

export const getPurseAssetKind = (purse: PursesJSONState) =>
  (purse && purse.displayInfo && purse.displayInfo.assetKind) || undefined;

export const getPurseDecimalPlaces = (purse: PursesJSONState) =>
  (purse && purse.displayInfo && purse.displayInfo.decimalPlaces) || undefined;

export const filterPursesByBrand = (
  purses: PursesJSONState[],
  desiredBrand: Brand
) => purses.filter(({ brand }: { brand: any }) => brand === desiredBrand);

export const comparePurses = (a: PursesJSONState, b: PursesJSONState) =>
  displayPetname(a.pursePetname) > displayPetname(b.pursePetname) ? 1 : -1;

export const sortPurses = (purses: PursesJSONState[]) =>
  purses.sort(comparePurses);

export const mapAtom = <K, V>() => {
  const innerAtom = atom<Map<K, V>>(new Map());

  return atom(
    get => get(innerAtom),
    (get, set, newEntries: Iterable<any>) => {
      const old = get(innerAtom).entries();
      set(innerAtom, new Map([...old, ...newEntries]));
    }
  );
};

export const calcFromAnchorNeeded = (
  toMintedAmount: Amount<'nat'>,
  fee: Ratio,
  anchorUnitAmount: Amount<'nat'>,
  mintedUnitAmount: Amount<'nat'>
) => {
  const anchorEquivalentBeforeFee = ceilDivideBy(toMintedAmount, oneMinus(fee));
  return ceilMultiplyBy(
    anchorEquivalentBeforeFee,
    makeRatioFromAmounts(anchorUnitAmount, mintedUnitAmount)
  );
};

export const calcFromMintedNeeded = (
  toAnchorAmount: Amount<'nat'>,
  fee: Ratio,
  anchorUnitAmount: Amount<'nat'>,
  mintedUnitAmount: Amount<'nat'>
) => {
  const mintedEquivalentBeforeFee = ceilMultiplyBy(
    toAnchorAmount,
    makeRatioFromAmounts(mintedUnitAmount, anchorUnitAmount)
  );
  return ceilDivideBy(mintedEquivalentBeforeFee, oneMinus(fee));
};

export const calcToMintedNeeded = (
  fromAnchorAmount: Amount<'nat'>,
  fee: Ratio,
  anchorUnitAmount: Amount<'nat'>,
  mintedUnitAmount: Amount<'nat'>
) => {
  const newToAmount = floorMultiplyBy(
    fromAnchorAmount,
    makeRatioFromAmounts(mintedUnitAmount, anchorUnitAmount)
  );
  return floorMultiplyBy(newToAmount, oneMinus(fee));
};

export const calcToAnchorNeeded = (
  fromMintedAmount: Amount<'nat'>,
  fee: Ratio,
  anchorUnitAmount: Amount<'nat'>,
  mintedUnitAmount: Amount<'nat'>
) => {
  const fromAmountAfterFee = floorMultiplyBy(fromMintedAmount, oneMinus(fee));
  return floorMultiplyBy(
    fromAmountAfterFee,
    makeRatioFromAmounts(anchorUnitAmount, mintedUnitAmount)
  );
};
