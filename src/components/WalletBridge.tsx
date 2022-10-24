import React, { useRef } from 'react';
import { BridgeProtocol } from '@agoric/web-components';
import { makeReactDappWalletBridge } from '@agoric/web-components/react';
import { Id, toast } from 'react-toastify';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  walletAtom,
  bridgeApprovedAtom,
  chainConnectionAtom,
  bridgeHrefAtom,
  walletUiHrefAtom,
} from 'store/app';

type BridgeReadyMessage = {
  detail: {
    data: {
      type: string;
    };
    isDappApproved: boolean;
    requestDappConnection: (petname: string) => void;
    addOffer: (offer: any) => void;
  };
};

type BridgeMessage = {
  detail: {
    data: {
      type: string;
      isDappApproved: boolean;
    };
  };
};

type BridgeError = {
  detail: {
    type: string;
    e: Error;
  };
};

// Create a wrapper for dapp-wallet-bridge that is specific to
// the app's instance of React.
const DappWalletBridge = makeReactDappWalletBridge(React);

const WalletBridge = () => {
  const setBridgeApproved = useSetAtom(bridgeApprovedAtom);
  const setWallet = useSetAtom(walletAtom);
  const chainConnection = useAtomValue(chainConnectionAtom);
  const warningToastId = useRef<Id | null>(null);
  const connectionSuccessfulToastId = useRef<Id | null>(null);
  const bridgeHref = useAtomValue(bridgeHrefAtom);
  const walletUiHref = useAtomValue(walletUiHrefAtom);

  const clearWarningToast = () =>
    warningToastId.current && toast.dismiss(warningToastId.current);

  const clearConnectionSuccessfulToast = () =>
    connectionSuccessfulToastId.current &&
    toast.dismiss(connectionSuccessfulToastId.current);

  const showWarningToast = () => {
    clearConnectionSuccessfulToast();
    warningToastId.current = toast.warning(
      <p>
        Dapp is in read-only mode. Enable the connection at{' '}
        <a
          className="underline text-blue-500"
          href={walletUiHref}
          target="_blank"
          rel="noreferrer"
        >
          {walletUiHref}
        </a>{' '}
        to perform swaps.
      </p>
    );
  };

  const showConnectionSuccessfulToast = () => {
    clearWarningToast();
    connectionSuccessfulToastId.current = toast.success(
      <p>
        Successfully connected to Agoric wallet at{' '}
        <a
          className="underline text-blue-500"
          href={walletUiHref}
          target="_blank"
          rel="noreferrer"
        >
          {walletUiHref}
        </a>
      </p>,
      { autoClose: 5000 }
    );
  };

  const onBridgeReady = (ev: BridgeReadyMessage) => {
    const {
      detail: { isDappApproved, requestDappConnection, addOffer },
    } = ev;
    if (!isDappApproved) {
      requestDappConnection('Inter Protocol PSM');
      showWarningToast();
    } else {
      setBridgeApproved(true);
      showConnectionSuccessfulToast();
    }
    setWallet({ addOffer });
  };

  const onError = (ev: BridgeError) => {
    const message = ev.detail.e.message;
    toast.error(
      <div>
        <p>
          Could not connect to Agoric wallet at{' '}
          <a
            className="underline text-blue-500"
            href={walletUiHref}
            target="_blank"
            rel="noreferrer"
          >
            {walletUiHref}
          </a>
          {message && `: ${message}`}
        </p>
      </div>
    );
  };

  const onBridgeMessage = (ev: BridgeMessage) => {
    const data = ev.detail.data;
    const type = data.type;
    switch (type) {
      case BridgeProtocol.dappApprovalChanged:
        setBridgeApproved(data.isDappApproved);
        if (data.isDappApproved) {
          showConnectionSuccessfulToast();
        } else {
          showWarningToast();
        }
        break;
      default:
        console.warn('Unhandled bridge message', data);
    }
  };

  return (
    <div className="hidden">
      {chainConnection && (
        <DappWalletBridge
          bridgeHref={bridgeHref}
          onBridgeMessage={onBridgeMessage}
          onBridgeReady={onBridgeReady}
          onError={onError}
          address={chainConnection.address}
          chainId={chainConnection.chainId}
        />
      )}
    </div>
  );
};

export default WalletBridge;
