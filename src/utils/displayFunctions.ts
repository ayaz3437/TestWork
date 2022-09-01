import {
  stringifyRatioAsPercent,
  stringifyRatio,
  stringifyValue,
} from '@agoric/ui-components';
import { AssetKind } from '@agoric/ertp';
import { IST_ICON } from 'assets/assets';
import type { Brand, BrandToInfo } from 'store/app';

const getLogoForBrandPetname = (brandPetname: string) => {
  switch (brandPetname) {
    case 'IST':
      return IST_ICON;
    default:
      return IST_ICON;
  }
};

export const displayPetname = (pn: Array<string> | string) =>
  Array.isArray(pn) ? pn.join('.') : pn;

export const makeDisplayFunctions = (brandToInfo: BrandToInfo) => {
  const getDecimalPlaces = (brand: Brand) =>
    brandToInfo.get(brand)?.decimalPlaces;

  const getPetname = (brand: Brand) => brandToInfo.get(brand)?.petname ?? '';

  const displayPercent = (ratio: any, placesToShow: number) => {
    return stringifyRatioAsPercent(ratio, getDecimalPlaces, placesToShow);
  };

  const displayBrandPetname = (brand: Brand) => {
    return displayPetname(getPetname(brand));
  };

  const displayRatio = (ratio: any, placesToShow: number) => {
    return stringifyRatio(ratio, getDecimalPlaces, placesToShow);
  };

  const displayAmount = (amount: any, placesToShow: number) => {
    const decimalPlaces = getDecimalPlaces(amount.brand);
    return stringifyValue(
      amount.value,
      AssetKind.NAT,
      decimalPlaces,
      placesToShow
    );
  };

  const displayBrandIcon = (brand: Brand) =>
    getLogoForBrandPetname(getPetname(brand));

  return {
    displayPercent,
    displayBrandPetname,
    displayRatio,
    displayAmount,
    getDecimalPlaces,
    displayBrandIcon,
  };
};
