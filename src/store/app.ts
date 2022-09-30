import { atom } from 'jotai';
import type { ERef } from '@endo/eventual-send';
import type { Amount, Brand, DisplayInfo } from '@agoric/ertp';
import type { PursesJSONState } from '@agoric/wallet-backend';
import type { Ratio } from '@agoric/zoe/src/contractSupport';

import { makeDisplayFunctions } from 'utils/displayFunctions';
import { mapAtom } from 'utils/helpers';

export type BrandInfo = DisplayInfo<'nat'> & {
  petname: string;
};

export const brandToInfoAtom = mapAtom<Brand, BrandInfo>();

export const walletAtom = atom<ERef<any>>(null);

export const offersAtom = atom<Array<any> | null>(null);

export const pursesAtom = atom<Array<PursesJSONState> | null>(null);

/** A map of anchor brand petnames to their instance ids. */
export const instanceIdsAtom = mapAtom<string, string>();

export type Metrics = {
  anchorPoolBalance: Amount;
  feePoolBalance: Amount;
  totalAnchorProvided: Amount;
  totalMintedProvided: Amount;
  mintedPoolBalance: Amount;
};

/** A map of anchor brand petnames to their instances' metrics. */
export const metricsIndexAtom = mapAtom<string, Metrics>();

export type GovernedParams = {
  giveMintedFee: Ratio;
  mintLimit: Amount;
  wantMintedFee: Ratio;
};

/** A map of anchor brand petnames to their instancess' governed params. */
export const governedParamsIndexAtom = mapAtom<string, GovernedParams>();

export const displayFunctionsAtom = atom(get => {
  const brandToInfo = get(brandToInfoAtom);
  return makeDisplayFunctions(brandToInfo);
});

/**  Experimental feature flag. */
export const previewEnabledAtom = atom(_get => false);
