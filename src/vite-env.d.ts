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

declare module '@agoric/ertp' {
  export const AmountMath;
  export const AssetKind;
}

declare module '@agoric/ui-components' {
  export const parseAsValue;
  export const stringifyValue;
  export const stringifyRatioAsPercent;
  export const stringifyRatio;
}
