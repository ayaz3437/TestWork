import { atom } from 'jotai';
import type { ERef } from '@endo/eventual-send';

const brandToInfoInnerAtom = atom(new Map());

export const walletAtom = atom<ERef<any>>(null);

export const brandToInfoAtom = atom(
  get => get(brandToInfoInnerAtom),
  (get, set, newEntries: Iterable<any>) => {
    const old = get(brandToInfoAtom).entries();
    set(brandToInfoInnerAtom, new Map([...old, ...newEntries]));
  }
);

export const offersAtom = atom(null);

export const pursesAtom = atom(null);
