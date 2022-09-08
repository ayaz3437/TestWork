import { toast } from 'react-toastify';
import { E } from '@endo/eventual-send';
import type { ERef } from '@endo/eventual-send';
import type { Id as ToastId } from 'react-toastify';

import { defaultToastProperties, SwapError, SwapDirection } from 'store/swap';
import type { PursesJSONState } from '@agoric/wallet-backend';

type SwapContext = {
  setToastId: (id: ToastId) => void;
  setSwapped: (swapped: boolean) => void;
  setCurrentOfferId: (id: number) => void;
  addError: (error: SwapError) => void;
  swapped: boolean;
  instanceId: string;
  walletP: ERef<any>;
  fromPurse?: PursesJSONState | null;
  fromValue?: number | null;
  toPurse?: PursesJSONState | null;
  toValue?: number | null;
  swapDirection: SwapDirection;
};

const makeSwapOffer = ({
  instanceId,
  walletP,
  fromPurse,
  fromValue,
  toPurse,
  toValue,
  swapDirection,
}: SwapContext) => {
  assert(fromPurse, '"from" purse must be defined');
  assert(fromValue, '"from" value must be defined');
  assert(toPurse, '"to" purse must be defined');
  assert(toValue, '"to" value must be defined');

  const method =
    swapDirection === SwapDirection.TO_STABLE
      ? 'makeWantMintedInvitation'
      : 'makeGiveMintedInvitation';

  const offerConfig = {
    invitationMaker: {
      method,
    },
    instanceHandleBoardId: instanceId,
    proposalTemplate: {
      give: {
        In: {
          pursePetname: fromPurse.pursePetname,
          value: Number(fromValue),
        },
      },
      want: {
        Out: {
          pursePetname: toPurse.pursePetname,
          value: Number(toValue),
        },
      },
    },
  };

  console.info('OFFER CONFIG: ', offerConfig);
  return E(walletP).addOffer(offerConfig);
};

export const doSwap = async (context: SwapContext) => {
  const {
    setToastId,
    setSwapped,
    setCurrentOfferId,
    addError,
    swapped,
    toPurse,
    fromPurse,
    fromValue,
    toValue,
  } = context;

  if (swapped) {
    addError(SwapError.IN_PROGRESS);
    return;
  } else if (!(fromPurse && toPurse)) {
    addError(SwapError.NO_BRANDS);
    return;
  } else if (!(toValue && toValue > 0n && fromValue && fromValue > 0n)) {
    addError(SwapError.EMPTY_AMOUNTS);
    return;
  }

  const offerId = await makeSwapOffer(context);
  setCurrentOfferId(offerId);
  setSwapped(true);
  setToastId(
    toast('Please approve the offer in your wallet.', {
      ...defaultToastProperties,
      type: toast.TYPE.INFO,
      progress: undefined,
      hideProgressBar: true,
      autoClose: false,
    })
  );
};
