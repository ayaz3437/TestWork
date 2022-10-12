import {
  stringifyRatioAsPercent,
  stringifyRatio,
  stringifyValue,
} from '@agoric/ui-components';
import { AssetKind, Brand } from '@agoric/ertp';
import { IST_ICON } from 'assets/assets';
import type { BrandInfo } from 'store/app';

const getLogoForBrandPetname = (brandPetname: string) => {
  switch (brandPetname) {
    case 'IST':
      return IST_ICON;
    case 'USDC_axl':
      return 'USDC_axl.png';
    case 'USDC_grv':
      return 'USDC_grv.webp';
    case 'USDT_axl':
        return 'USDT_axl.png';
    case 'USDT_grv':
        return 'USDT_grv.webp';
    default:
      return 'default.png';
  }
};

const calcTrailingZeros = (value: bigint) => {
  let zeroes = 0;
  while (value > 0 && value % 10n === 0n) {
    zeroes += 1;
    value /= 10n;
  }
  return zeroes;
};

export const calcSignificantDecimalPlaces = (
  decimalPlaces: number,
  value?: bigint
) => value ? decimalPlaces - calcTrailingZeros(value) : 0;

export const displayPetname = (pn: Array<string> | string) =>
  Array.isArray(pn) ? pn.join('.') : pn;

export const makeDisplayFunctions = (brandToInfo: Map<Brand, BrandInfo>) => {
  const getDecimalPlaces = (brand: Brand) =>
    brandToInfo.get(brand)?.decimalPlaces;

  const getPetname = (brand?: Brand | null) =>
    (brand && brandToInfo.get(brand)?.petname) ?? '';

  const displayPercent = (ratio: any, placesToShow: number) => {
    return stringifyRatioAsPercent(ratio, getDecimalPlaces, placesToShow);
  };

  const displayBrandPetname = (brand?: Brand | null) => {
    return displayPetname(getPetname(brand));
  };

  const displayRatio = (ratio: any, placesToShow: number) => {
    return stringifyRatio(ratio, getDecimalPlaces, placesToShow);
  };

  const displayAmount = (amount: any, placesToShow?: number) => {
    const decimalPlaces = getDecimalPlaces(amount.brand);
    if (placesToShow === undefined && decimalPlaces) {
      placesToShow = Math.max(
        calcSignificantDecimalPlaces(decimalPlaces, amount.value),
        2
      );
    }
    return stringifyValue(
      amount.value,
      AssetKind.NAT,
      decimalPlaces,
      placesToShow
    );
  };

  const displayBrandIcon = (brand?: Brand | null) =>
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
