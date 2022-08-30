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
