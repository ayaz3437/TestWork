import { atom } from 'jotai';
import { Amount, AmountMath } from '@agoric/ertp';

import {
  displayFunctionsAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  pursesAtom,
  instanceIdsAtom,
} from 'store/app';
import {
  calcFromAnchorNeeded,
  calcFromMintedNeeded,
  calcToMintedNeeded,
  calcToAnchorNeeded,
  filterPursesByBrand,
} from 'utils/helpers';
import type { Metrics, GovernedParams } from 'store/app';

export enum SwapError {
  EMPTY_AMOUNTS = 'Please enter the amounts first.',
  NO_BRANDS = 'Please select an asset first.',
  PURSE_BALANCE = 'Insufficient purse balance.',
  MINT_LIMIT = 'Error: Unable to create swap offer. The amount would exceed the mint limit for the selected token.',
  ANCHOR_LIMIT = 'Error: Unable to create swap offer. The amount would exceed the number of available tokens.',
}

export enum SwapDirection {
  WantAnchor,
  WantMinted,
}

export const selectedAnchorPetnameAtom = atom<string | null>(null);

export const anchorBrandAtom = atom(
  get => get(metricsAtom)?.anchorPoolBalance?.brand
);

export const anchorBrandsAtom = atom(get => {
  const metrics = [...get(metricsIndexAtom).entries()];
  return metrics.map(
    ([_petname, { anchorPoolBalance }]) => anchorPoolBalance.brand
  );
});

/** The metrics for the currently selected anchor. */
export const metricsAtom = atom<Metrics | null>(get => {
  const selectedPetname = get(selectedAnchorPetnameAtom);
  if (!selectedPetname) {
    return null;
  }
  return get(metricsIndexAtom).get(selectedPetname) ?? null;
});

/** The governed params for the currently selected anchor. */
export const governedParamsAtom = atom<GovernedParams | null>(get => {
  const selectedPetname = get(selectedAnchorPetnameAtom);
  if (!selectedPetname) {
    return null;
  }
  return get(governedParamsIndexAtom).get(selectedPetname) ?? null;
});

/** The contract instance id for the currently selected anchor. */
export const instanceIdAtom = atom<string | null>(get => {
  const selectedPetname = get(selectedAnchorPetnameAtom);
  if (!selectedPetname) {
    return null;
  }
  return get(instanceIdsAtom).get(selectedPetname) ?? null;
});

export const mintedBrandAtom = atom(get => {
  const metrics = get(metricsIndexAtom);
  const entries = metrics && [...metrics.entries()];

  // Use the first entry, the fee token is always the same.
  const firstEntry = entries && entries.at(0);
  if (!firstEntry) {
    return null;
  }

  return firstEntry[1].feePoolBalance.brand;
});

export const fromPurseAtom = atom(get => {
  const direction = get(swapDirectionAtom);
  const fromBrand =
    direction === SwapDirection.WantAnchor
      ? get(mintedBrandAtom)
      : get(anchorBrandAtom);
  const purses = get(pursesAtom);
  return purses && fromBrand && filterPursesByBrand(purses, fromBrand)?.at(0);
});

export const toPurseAtom = atom(get => {
  const direction = get(swapDirectionAtom);
  const toBrand =
    direction === SwapDirection.WantMinted
      ? get(mintedBrandAtom)
      : get(anchorBrandAtom);
  const purses = get(pursesAtom);
  return purses && toBrand && filterPursesByBrand(purses, toBrand)?.at(0);
});

const anchorUnitAmountAtom = atom(get => {
  const anchorBrand = get(anchorBrandAtom);
  if (!anchorBrand) {
    return null;
  }

  const { getDecimalPlaces } = get(displayFunctionsAtom);
  const decimalPlaces = getDecimalPlaces(anchorBrand);
  if (!decimalPlaces) {
    return null;
  }
  return AmountMath.make(anchorBrand, 10n ** BigInt(decimalPlaces));
});

const mintedUnitAmountAtom = atom(get => {
  const mintedBrand = get(mintedBrandAtom);
  if (!mintedBrand) {
    return null;
  }

  const { getDecimalPlaces } = get(displayFunctionsAtom);
  const decimalPlaces = getDecimalPlaces(mintedBrand);
  if (!decimalPlaces) {
    return null;
  }
  return AmountMath.make(mintedBrand, 10n ** BigInt(decimalPlaces));
});

const fromAmountInnerAtom = atom<Amount<'nat'> | null>(null);
export const fromAmountAtom = atom(
  get => get(fromAmountInnerAtom),
  (get, set, newFromAmount: Amount<'nat'>) => {
    const mintedBrand = get(mintedBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const mintedUnitAmount = get(mintedUnitAmountAtom);

    if (
      !(
        mintedBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        mintedUnitAmount
      )
    ) {
      set(fromAmountInnerAtom, newFromAmount);
      return;
    }

    // Auto-fill "to" amount when "from" amount is entered.
    //
    // TODO(https://github.com/Agoric/agoric-sdk/issues/6152): Use code that's
    // tested against the contract.
    if (swapDirection === SwapDirection.WantAnchor) {
      const fee = governedParams.giveMintedFee;
      const newToAmount = calcToAnchorNeeded(
        newFromAmount,
        fee,
        anchorUnitAmount,
        mintedUnitAmount
      );
      set(toAmountInnerAtom, newToAmount);
    }

    if (swapDirection === SwapDirection.WantMinted) {
      const fee = governedParams.wantMintedFee;
      const newToAmount = calcToMintedNeeded(
        newFromAmount,
        fee,
        anchorUnitAmount,
        mintedUnitAmount
      );
      set(toAmountInnerAtom, newToAmount);
    }

    // Finally update "from" amount.
    set(fromAmountInnerAtom, newFromAmount);
  }
);

const toAmountInnerAtom = atom<Amount<'nat'> | null>(null);
export const toAmountAtom = atom(
  get => get(toAmountInnerAtom),
  (get, set, newToAmount: Amount<'nat'>) => {
    const mintedBrand = get(mintedBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const mintedUnitAmount = get(mintedUnitAmountAtom);

    if (
      !(
        mintedBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        mintedUnitAmount
      )
    ) {
      set(toAmountInnerAtom, newToAmount);
      return;
    }

    // Auto-fill "from" amount when "to" amount is entered.
    if (swapDirection === SwapDirection.WantAnchor) {
      const fee = governedParams.giveMintedFee;
      const newFromAmount = calcFromMintedNeeded(
        newToAmount,
        fee,
        anchorUnitAmount,
        mintedUnitAmount
      );
      set(fromAmountInnerAtom, newFromAmount);
    }

    if (swapDirection === SwapDirection.WantMinted) {
      const fee = governedParams.wantMintedFee;
      const newFromAmount = calcFromAnchorNeeded(
        newToAmount,
        fee,
        anchorUnitAmount,
        mintedUnitAmount
      );
      set(fromAmountInnerAtom, newFromAmount);
    }

    // Finally update "to" amount.
    set(toAmountInnerAtom, newToAmount);
  }
);

const swapDirectionInnerAtom = atom<SwapDirection>(SwapDirection.WantMinted);
export const swapDirectionAtom = atom(
  get => get(swapDirectionInnerAtom),
  (_get, set, newDirection: SwapDirection) => {
    set(toAmountInnerAtom, null);
    set(fromAmountInnerAtom, null);
    set(swapDirectionInnerAtom, newDirection);
  }
);

const errorsInnerAtom = atom<Set<SwapError>>(new Set<SwapError>());
export const errorsAtom = atom(get => get(errorsInnerAtom));

export const addErrorAtom = atom(null, (get, set, newError: SwapError) => {
  const errors = get(errorsInnerAtom);
  set(errorsInnerAtom, new Set(errors).add(newError));
});

export const removeErrorAtom = atom(
  null,
  (get, set, errorToRemove: SwapError) => {
    const errors = new Set(get(errorsInnerAtom));
    errors.delete(errorToRemove);
    set(errorsInnerAtom, errors);
  }
);
