import { atom } from 'jotai';
import {
  makeRatioFromAmounts,
  floorMultiplyBy,
  oneMinus,
  floorDivideBy,
} from '@agoric/zoe/src/contractSupport';
import { Amount, AmountMath } from '@agoric/ertp';
import type { Id as ToastId, ToastOptions } from 'react-toastify';

import {
  displayFunctionsAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  pursesAtom,
  instanceIdsAtom,
} from 'store/app';
import { filterPursesByBrand } from 'utils/helpers';
import type { Metrics, GovernedParams } from 'store/app';

export enum SwapError {
  IN_PROGRESS = 'Swap in progress.',
  EMPTY_AMOUNTS = 'Please enter the amounts first.',
  NO_BRANDS = 'Please select an asset first.',
}

export enum ButtonStatus {
  SWAP = 'Swap',
  SWAPPED = 'Swapped',
  REJECTED = 'Rejected',
  DECLINED = 'Declined',
}

export const defaultToastProperties: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  containerId: 'Info',
};

export enum SwapDirection {
  TO_STABLE,
  TO_ANCHOR,
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

export const stableBrandAtom = atom(get => {
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
    direction === SwapDirection.TO_ANCHOR
      ? get(stableBrandAtom)
      : get(anchorBrandAtom);
  const purses = get(pursesAtom);
  return purses && fromBrand && filterPursesByBrand(purses, fromBrand)?.at(0);
});

export const toPurseAtom = atom(get => {
  const direction = get(swapDirectionAtom);
  const toBrand =
    direction === SwapDirection.TO_STABLE
      ? get(stableBrandAtom)
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

const stableUnitAmountAtom = atom(get => {
  const stableBrand = get(stableBrandAtom);
  if (!stableBrand) {
    return null;
  }

  const { getDecimalPlaces } = get(displayFunctionsAtom);
  const decimalPlaces = getDecimalPlaces(stableBrand);
  if (!decimalPlaces) {
    return null;
  }
  return AmountMath.make(stableBrand, 10n ** BigInt(decimalPlaces));
});

const fromAmountInnerAtom = atom<Amount | null>(null);
export const fromAmountAtom = atom(
  get => get(fromAmountInnerAtom),
  (get, set, newFromAmount: Amount) => {
    const stableBrand = get(stableBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const stableUnitAmount = get(stableUnitAmountAtom);

    if (
      !(
        stableBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        stableUnitAmount
      )
    ) {
      set(fromAmountInnerAtom, newFromAmount);
      return;
    }

    // Auto-fill "to" amount when "from" amount is entered.
    //
    // TODO(https://github.com/Agoric/agoric-sdk/issues/6152): Use code that's
    // tested against the contract.
    if (swapDirection === SwapDirection.TO_ANCHOR) {
      const fee = governedParams.GiveStableFee;
      const fromAmountAfterFee = floorMultiplyBy(newFromAmount, oneMinus(fee));
      const newToAmount = floorMultiplyBy(
        fromAmountAfterFee,
        makeRatioFromAmounts(anchorUnitAmount, stableUnitAmount)
      );
      set(toAmountInnerAtom, newToAmount);
    }

    if (swapDirection === SwapDirection.TO_STABLE) {
      const fee = governedParams.WantStableFee;
      const newToAmount = floorMultiplyBy(
        newFromAmount,
        makeRatioFromAmounts(stableUnitAmount, anchorUnitAmount)
      );
      const toAmountAfterFee = floorMultiplyBy(newToAmount, oneMinus(fee));
      set(toAmountInnerAtom, toAmountAfterFee);
    }

    // Finally update "from" amount.
    set(fromAmountInnerAtom, newFromAmount);
  }
);

const toAmountInnerAtom = atom<Amount | null>(null);
export const toAmountAtom = atom(
  get => get(toAmountInnerAtom),
  (get, set, newToAmount: Amount) => {
    const stableBrand = get(stableBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const stableUnitAmount = get(stableUnitAmountAtom);

    if (
      !(
        stableBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        stableUnitAmount
      )
    ) {
      set(toAmountInnerAtom, newToAmount);
      return;
    }

    // Auto-fill "from" amount when "to" amount is entered.
    if (swapDirection === SwapDirection.TO_ANCHOR) {
      const fee = governedParams.GiveStableFee;
      const newFromAmount = floorMultiplyBy(
        newToAmount,
        makeRatioFromAmounts(stableUnitAmount, anchorUnitAmount)
      );
      const fromAmountBeforeFee = floorDivideBy(newFromAmount, oneMinus(fee));
      set(fromAmountInnerAtom, fromAmountBeforeFee);
    }

    if (swapDirection === SwapDirection.TO_STABLE) {
      const fee = governedParams.WantStableFee;
      const stableEquivalentBeforeFee = floorDivideBy(
        newToAmount,
        oneMinus(fee)
      );
      const newFromAmount = floorMultiplyBy(
        stableEquivalentBeforeFee,
        makeRatioFromAmounts(anchorUnitAmount, stableUnitAmount)
      );
      set(fromAmountInnerAtom, newFromAmount);
    }

    // Finally update "to" amount.
    set(toAmountInnerAtom, newToAmount);
  }
);

const swapDirectionInnerAtom = atom<SwapDirection>(SwapDirection.TO_STABLE);
export const swapDirectionAtom = atom(
  get => get(swapDirectionInnerAtom),
  (_get, set, newDirection: SwapDirection) => {
    set(toAmountInnerAtom, null);
    set(fromAmountInnerAtom, null);
    set(swapDirectionInnerAtom, newDirection);
  }
);

export const toastIdAtom = atom<ToastId | null>(null);
export const currentOfferIdAtom = atom<number | null>(null);
export const swapButtonStatusAtom = atom<ButtonStatus>(ButtonStatus.SWAP);
export const swapInProgressAtom = atom<boolean>(false);

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
