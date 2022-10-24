import type { PursesJSONState } from '@agoric/wallet-backend';
import { E } from '@endo/eventual-send';

import { SwapDirection } from 'store/swap';
import { WalletBridge } from 'store/app';

type SwapContext = {
  wallet: WalletBridge;
  instanceId: string;
  fromPurse: PursesJSONState;
  fromValue: bigint;
  toPurse: PursesJSONState;
  toValue: bigint;
  swapDirection: SwapDirection;
  marshal: any;
};

export const makeSwapOffer = async ({
  wallet,
  instanceId,
  fromPurse,
  fromValue,
  toPurse,
  toValue,
  swapDirection,
  marshal,
}: SwapContext) => {
  const method =
    swapDirection === SwapDirection.WantMinted
      ? 'makeWantMintedInvitation'
      : 'makeGiveMintedInvitation';

  const serializedInstance = await E(marshal).serialize(instanceId);

  const offerConfig = {
    publicInvitationMaker: method,
    instanceHandle: serializedInstance,
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
  wallet.addOffer(offerConfig);
};
