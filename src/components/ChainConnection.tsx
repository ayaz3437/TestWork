import { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import {
  makeAgoricKeplrConnection,
  AgoricKeplrConnectionErrors as Errors,
} from '@agoric/web-components';
import 'react-toastify/dist/ReactToastify.css';

import {
  brandToInfoAtom,
  pursesAtom,
  offersAtom,
  instanceIdsAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  chainConnectionAtom,
  networkConfigAtom,
  termsIndexAgreedUponAtom,
} from 'store/app';
import { watchContract, watchPurses } from 'utils/updates';
import NetworkDropdown from 'components/NetworkDropdown';
import TermsDialog, { currentTermsIndex } from './TermsDialog';

import 'styles/globals.css';
import clsx from 'clsx';

const autoCloseDelayMs = 7000;

const ChainConnection = () => {
  const [connectionInProgress, setConnectionInProgress] = useState(false);
  const [chainConnection, setChainConnection] = useAtom(chainConnectionAtom);
  const mergeBrandToInfo = useSetAtom(brandToInfoAtom);
  const setPurses = useSetAtom(pursesAtom);
  const setOffers = useSetAtom(offersAtom);
  const setMetricsIndex = useSetAtom(metricsIndexAtom);
  const setGovernedParamsIndex = useSetAtom(governedParamsIndexAtom);
  const setInstanceIds = useSetAtom(instanceIdsAtom);
  const networkConfig = useAtomValue(networkConfigAtom);
  const termsAgreed = useAtomValue(termsIndexAgreedUponAtom);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const areLatestTermsAgreed = termsAgreed === currentTermsIndex;

  const handleTermsDialogClose = () => {
    setIsTermsDialogOpen(false);
    connect(false);
  };

  useEffect(() => {
    if (chainConnection === null) return;

    watchPurses(chainConnection, setPurses, mergeBrandToInfo).catch(
      (err: Error) => console.error('got watchPurses err', err)
    );

    watchContract(chainConnection, {
      setMetricsIndex,
      setGovernedParamsIndex,
      setInstanceIds,
    });
  }, [
    chainConnection,
    mergeBrandToInfo,
    setPurses,
    setOffers,
    setMetricsIndex,
    setGovernedParamsIndex,
    setInstanceIds,
  ]);

  const connect = async (checkTerms = true) => {
    if (connectionInProgress || chainConnection) return;

    if (checkTerms && !areLatestTermsAgreed) {
      setIsTermsDialogOpen(true);
      return;
    }

    let connection;
    setConnectionInProgress(true);
    try {
      connection = await makeAgoricKeplrConnection(networkConfig.url);
      setChainConnection(connection);
    } catch (e: any) {
      switch (e.message) {
        case Errors.enableKeplr:
          toast.error('Enable the connection in Keplr to continue.', {
            hideProgressBar: false,
            autoClose: autoCloseDelayMs,
          });
          break;
        case Errors.networkConfig:
          toast.error('Network not found.');
          break;
        case Errors.noSmartWallet:
          toast.error(
            <p>
              No Agoric smart wallet found for this address. Try creating one at{' '}
              <a
                className="underline text-blue-500"
                href="https://wallet.agoric.app/wallet/"
                target="_blank"
                rel="noreferrer"
              >
                wallet.agoric.app/wallet/
              </a>{' '}
              then try again.
            </p>,
            {
              hideProgressBar: false,
              autoClose: autoCloseDelayMs,
            }
          );
          break;
      }
    } finally {
      setConnectionInProgress(false);
    }
  };

  const status = (() => {
    if (connectionInProgress) {
      return 'Connecting';
    } else if (chainConnection) {
      return 'Keplr Connected';
    }
    return 'Connect Keplr';
  })();

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex flex-row align-middle">
        <NetworkDropdown />
      </div>
      <button
        className={clsx(
          'border border-primary group inline-flex items-center rounded-md px-3 py-2 bg-transparent text-base font-medium text-primary',
          !connectionInProgress && !chainConnection && 'hover:bg-gray-100'
        )}
        onClick={() => connect()}
      >
        {status}
        {connectionInProgress && (
          <div className="ml-1">
            <Oval color="#c084fc" height={18} width={18} />
          </div>
        )}
      </button>
      <TermsDialog
        isOpen={isTermsDialogOpen}
        onClose={handleTermsDialogClose}
      />
    </div>
  );
};

export default ChainConnection;
