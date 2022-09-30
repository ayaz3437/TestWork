import { Far } from '@endo/marshal';
import { AssetKind } from '@agoric/ertp';

export const mockBrand = () =>
  Far('brand', {
    isMyIssuer: async () => false,
    getAllegedName: () => 'mock',
    getDisplayInfo: () => ({
      assetKind: AssetKind.NAT,
    }),
  });
