import { atom } from 'jotai';
import type { ERef } from '@endo/eventual-send';

export const walletAtom = atom<ERef<any>>(null);
