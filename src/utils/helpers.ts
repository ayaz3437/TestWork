import { displayPetname } from 'utils/displayFunctions';
import { PursesJSONState } from '@agoric/wallet-backend';
import { Brand } from '@agoric/ertp';
import { atom } from 'jotai';

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
