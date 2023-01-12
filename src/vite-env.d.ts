/// <reference types="vite/client" />

declare module '@agoric/web-components' {
  export const makeAgoricKeplrConnection;
  export const AgoricKeplrConnectionErrors;
  export const BridgeProtocol;
}

declare module '@agoric/web-components/react' {
  export const makeReactAgoricWalletConnection;
  export const makeReactDappWalletBridge;
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

declare module '@agoric/wallet-backend' {
  export type PursesJSONState = {
    brand: import('@agoric/ertp').Brand;
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

declare module '@endo/lockdown' {
  export const lockdown;
}
