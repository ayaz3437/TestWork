import { atom } from 'jotai';
import type { ERef } from '@endo/eventual-send';

export type Brand = any;

export type BrandInfo = {
  petname: string;
  assetKind: string;
  decimalPlaces: number;
};

const brandToInfoInnerAtom = atom(new Map<Brand, BrandInfo>());

export const walletAtom = atom<ERef<any>>(null);

export const brandToInfoAtom = atom(
  get => get(brandToInfoInnerAtom),
  (get, set, newEntries: Iterable<any>) => {
    const old = get(brandToInfoInnerAtom).entries();
    set(brandToInfoInnerAtom, new Map([...old, ...newEntries]));
  }
);

export const offersAtom = atom(null);

export const pursesAtom = atom(null);

export const instanceIdAtom = atom<string | undefined>(undefined);

// TODO: Fill in properties on types as needed (or until we can import them
// from the package).
export type Metrics = Record<string, unknown>;
export const metricsAtom = atom<Metrics | null>(null);

export type GovernedParams = Record<string, unknown>;
export const governedParamsAtom = atom<GovernedParams | null>(null);
