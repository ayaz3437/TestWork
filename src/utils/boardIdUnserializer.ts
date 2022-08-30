import { makeMarshal } from '@endo/marshal';

/**
 *  Unserializes values from the board as just their ID strings.
 */
export const boardIdUnserializer = makeMarshal(undefined, slot => slot);
