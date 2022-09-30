/// <reference types="vite/client" />

declare module '@agoric/web-components/react' {
  export const makeReactAgoricWalletConnection;
}

declare module '@agoric/notifier' {
  export const makeAsyncIterableFromNotifier;
}

declare module '@agoric/casting' {
  export type Leader = any;
  export const makeFollower;
  export const iterateLatest;
  export const makeLeader;
}

// This holds constants; types are in ertp.d.ts
declare module '@agoric/ertp' {
  export const AmountMath;
  export const AssetKind = {
    NAT: 'nat',
    SET: 'set',
    COPY_SET: 'copySet',
    COPY_BAG: 'copyBag',
  };
}

declare module '@agoric/wallet-backend' {
  export type PursesJSONState = {
    brand: Brand;
    /** The board ID for this purse's brand */
    brandBoardId: string;
    /** The board ID for the deposit-only facet of this purse */
    depositBoardId?: string;
    /** The petname for this purse's brand */
    brandPetname: Petname;
    /** The petname for this purse */
    pursePetname: Petname;
    /** The brand's displayInfo */
    displayInfo: any;
    /** The purse's current balance */
    value: any;
    currentAmountSlots: any;
    currentAmount: any;
  };
}

declare module '@agoric/ui-components' {
  export const parseAsValue;
  export const stringifyValue;
  export const stringifyRatioAsPercent;
  export const stringifyRatio;
}

declare module '@agoric/zoe/src/contractSupport' {
  export type Ratio = {
    numerator: Amount;
    denominator: Amount;
  };
  export const makeRatioFromAmounts;
  export const floorMultiplyBy;
  export const oneMinus;
  export const floorDivideBy;
  export const ceilDivideBy;
  export const ceilMultiplyBy;
}
