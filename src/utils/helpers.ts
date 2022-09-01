import { displayPetname } from 'utils/displayFunctions';
import type { Brand } from 'store/app';

export const getPurseAssetKind = (purse: any) =>
  (purse && purse.displayInfo && purse.displayInfo.assetKind) || undefined;

export const getPurseDecimalPlaces = (purse: any) =>
  (purse && purse.displayInfo && purse.displayInfo.decimalPlaces) || undefined;

export const filterPursesByBrand = (purses: any, desiredBrand: Brand) =>
  purses.filter(({ brand }: { brand: any }) => brand === desiredBrand);

export const comparePurses = (a: any, b: any) =>
  displayPetname(a.pursePetname) > displayPetname(b.pursePetname) ? 1 : -1;

export const sortPurses = (purses: any) => purses.sort(comparePurses);
