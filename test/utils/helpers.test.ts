import { expect, it, describe } from 'vitest';
import { AmountMath } from '@agoric/ertp';
import { makeRatioFromAmounts } from '@agoric/zoe/src/contractSupport';
import { mockBrand } from '../../mock/brand.mock';
import {
  calcToMintedNeeded,
  calcToAnchorNeeded,
  calcFromMintedNeeded,
  calcFromAnchorNeeded,
} from '../../src/utils/helpers';

describe('helpers', () => {
  const minted = mockBrand();
  const anchor = mockBrand();

  it('should calculate the minted "to" amount from the anchor "from" amount', () => {
    const fee = makeRatioFromAmounts(
      AmountMath.make(minted, 1n),
      AmountMath.make(minted, 10000n)
    );
    const fromAmount = AmountMath.make(anchor, 1000000n);
    const anchorUnitAmount = AmountMath.make(anchor, 1000000n);
    const mintedUnitAmount = AmountMath.make(minted, 1000000000n);

    const toAmount = calcToMintedNeeded(
      fromAmount,
      fee,
      anchorUnitAmount,
      mintedUnitAmount
    );

    expect(toAmount.brand).equals(minted);
    expect(toAmount.value).equals(999900000n);
  });

  it('should calculate the anchor "to" amount from the minted "from" amount', () => {
    const fee = makeRatioFromAmounts(
      AmountMath.make(minted, 3n),
      AmountMath.make(minted, 10000n)
    );
    const fromAmount = AmountMath.make(minted, 1000000000n);
    const anchorUnitAmount = AmountMath.make(anchor, 1000000n);
    const mintedUnitAmount = AmountMath.make(minted, 1000000000n);

    const toAmount = calcToAnchorNeeded(
      fromAmount,
      fee,
      anchorUnitAmount,
      mintedUnitAmount
    );

    expect(toAmount.brand).equals(anchor);
    expect(toAmount.value).equals(999700n);
  });

  it('should calculate the minted "from" amount from the anchor "to" amount', () => {
    const fee = makeRatioFromAmounts(
      AmountMath.make(minted, 3n),
      AmountMath.make(minted, 10000n)
    );
    const toAmount = AmountMath.make(anchor, 1000000n);
    const anchorUnitAmount = AmountMath.make(anchor, 1000000n);
    const mintedUnitAmount = AmountMath.make(minted, 1000000000n);

    const fromAmount = calcFromMintedNeeded(
      toAmount,
      fee,
      anchorUnitAmount,
      mintedUnitAmount
    );

    expect(fromAmount.brand).equals(minted);
    expect(fromAmount.value).equals(1000300091n);
  });

  it('should calculate the anchor "from" amount from the minted "to" amount', () => {
    const fee = makeRatioFromAmounts(
      AmountMath.make(minted, 1n),
      AmountMath.make(minted, 10000n)
    );
    const toAmount = AmountMath.make(minted, 1000000000n);
    const anchorUnitAmount = AmountMath.make(anchor, 1000000n);
    const mintedUnitAmount = AmountMath.make(minted, 1000000000n);

    const fromAmount = calcFromAnchorNeeded(
      toAmount,
      fee,
      anchorUnitAmount,
      mintedUnitAmount
    );

    expect(fromAmount.brand).equals(anchor);
    expect(fromAmount.value).equals(1000101n);
  });
});
