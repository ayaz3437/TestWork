import { atom } from 'jotai';
import type { ERef } from '@endo/eventual-send';
import type { Amount, Brand, DisplayInfo } from '@agoric/ertp';
import type { PursesJSONState } from '@agoric/wallet-backend';
import type { Ratio } from '@agoric/zoe/src/contractSupport';

import { makeDisplayFunctions } from 'utils/displayFunctions';

export type BrandInfo = DisplayInfo<'nat'> & {
  petname: string;
};

export type BrandToInfo = Map<Brand, BrandInfo>;

const brandToInfoInnerAtom = atom<BrandToInfo>(new Map<Brand, BrandInfo>());

export const walletAtom = atom<ERef<any>>(null);

export const brandToInfoAtom = atom(
  get => get(brandToInfoInnerAtom),
  (get, set, newEntries: Iterable<any>) => {
    const old = get(brandToInfoInnerAtom).entries();
    set(brandToInfoInnerAtom, new Map([...old, ...newEntries]));
  }
);

export const offersAtom = atom<Array<any> | null>(null);

export const pursesAtom = atom<Array<PursesJSONState> | null>(null);

export const instanceIdAtom = atom<string | undefined>(undefined);

export type Metrics = {
  anchorPoolBalance: Amount;
  feePoolBalance: Amount;
  totalAnchorProvided: Amount;
  totalStableProvided: Amount;
};

// TODO: Support multiple anchors.
export const metricsAtom = atom<Metrics | null>(null);

// TODO: Support multiple anchors.
export type GovernedParams = {
  GiveStableFee: Ratio;
  MintLimit: Amount;
  WantStableFee: Ratio;
};
export const governedParamsAtom = atom<GovernedParams | null>(null);

export const displayFunctionsAtom = atom(get => {
  const brandToInfo = get(brandToInfoAtom);
  return makeDisplayFunctions(brandToInfo);
});

export const stableBrandAtom = atom(
  get => get(metricsAtom)?.feePoolBalance?.brand
);

export const previewEnabledAtom = atom(_get => false);
