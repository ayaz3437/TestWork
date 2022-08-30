import { makeMarshal } from '@endo/marshal';
import type { Marshal } from '@endo/marshal';

type IdentityMarshal = Marshal<string>;

/**
 *  Unserializes values from the board as just their ID strings.
 */
export const identityMarshal: IdentityMarshal = makeMarshal(
  undefined,
  slot => slot
);
