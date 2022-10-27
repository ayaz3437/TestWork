import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Amount, Brand, DisplayInfo } from '@agoric/ertp';
import type { PursesJSONState } from '@agoric/wallet-backend';
import type { Ratio } from '@agoric/zoe/src/contractSupport';

import { makeDisplayFunctions } from 'utils/displayFunctions';
import { mapAtom } from 'utils/helpers';
import { networkConfigs } from 'config';

export type BrandInfo = DisplayInfo<'nat'> & {
  petname: string;
};

export type WalletBridge = {
  addOffer: (offerConfig: any) => void;
};

export const bridgeApprovedAtom = atom(false);

const prodBridgeHref = 'https://wallet.agoric.app/wallet/bridge.html';
const localBridgeHref = 'http://localhost:3000/wallet/bridge.html';
const branchBridgeHref = (branchName: string) =>
  `https://${branchName}.wallet-app.pages.dev/wallet/bridge.html`;

const usp = new URLSearchParams(window.location.search);
const wallet = usp.get('wallet');
let bridgeHref = prodBridgeHref;
if (wallet === 'local') {
  bridgeHref = localBridgeHref;
} else if (wallet) {
  bridgeHref = branchBridgeHref(wallet);
}

export const bridgeHrefAtom = atom<string>(bridgeHref);

export const walletUiHrefAtom = atom(get => {
  const bridgeUrl = new URL(get(bridgeHrefAtom));

  return bridgeUrl ? bridgeUrl.origin + '/wallet/' : '';
});

export const brandToInfoAtom = mapAtom<Brand, BrandInfo>();

export const walletAtom = atom<WalletBridge | null>(null);

export const chainConnectionAtom = atom<any | null>(null);

export const offersAtom = atom<Array<any> | null>(null);

export const pursesAtom = atom<Array<PursesJSONState> | null>(null);

export const networkConfigAtom = atomWithStorage(
  'agoric-network-config',
  networkConfigs.mainnet
);

export const termsIndexAgreedUponAtom = atomWithStorage('terms-agreed', -1);

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
