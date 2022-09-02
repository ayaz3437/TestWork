import { displayPetname } from 'utils/displayFunctions';
import { PursesJSONState } from '@agoric/wallet-backend';
import { Brand } from '@agoric/ertp';

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
