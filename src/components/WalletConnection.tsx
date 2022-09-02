import { makeReactAgoricWalletConnection } from '@agoric/web-components/react';
import React, { useCallback } from 'react';
import { E } from '@endo/eventual-send';
import { Popover } from '@headlessui/react';
import { BiChevronDown } from 'react-icons/bi';
import { dappConfig } from 'config';
import { useAtom } from 'jotai';
import { walletAtom } from 'store/app';

// Create a wrapper for agoric-wallet-connection that is specific to
// the app's instance of React.
const AgoricWalletConnection = makeReactAgoricWalletConnection(React);

const WalletConnection = () => {
  const { CONTRACT_NAME } = dappConfig;
  const [_wallet, setWallet] = useAtom(walletAtom);

  const onWalletState = useCallback(
    (ev: any) => {
      const { walletConnection, state } = ev.detail;
      console.log('wallet:', state);
      // FIXME: Better state management, including in the web component level.
      switch (state) {
        case 'idle': {
          const bridge = E(walletConnection).getScopedBridge(CONTRACT_NAME);
          // You should reconstruct all state here.
          setWallet(bridge);
          break;
        }
        case 'error': {
          console.log('error', ev.detail);
          // In case of an error, reset to 'idle'.
          // Backoff or other retry strategies would go here instead of immediate reset.
          E(walletConnection).reset();
          break;
        }
        default:
      }
    },
    [CONTRACT_NAME, setWallet]
  );

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="border border-primary focus:outline-none group inline-flex items-center rounded-md px-3 py-2 bg-transparent text-base font-medium text-primary">
            <span>Wallet</span>
            <BiChevronDown className="ml-2 h-5 w-5" aria-hidden="true" />
          </Popover.Button>
          <Popover.Panel
            static
            className={`${
              !open ? 'hidden' : ''
            } absolute z-10 mt-3 max-w-sm right-0 bg-white`}
          >
            <div className="overflow-hidden rounded-lg shadow-lg border border-black border-opacity-5">
              <AgoricWalletConnection
                onState={onWalletState}
                useLocalStorage={true}
              />
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default WalletConnection;
