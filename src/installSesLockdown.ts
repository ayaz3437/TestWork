import { lockdown } from '@endo/lockdown';
import '@endo/eventual-send/shim.js'; // adds support needed by E

const MAX_ATTEMPTS = 10;
const WAIT_PER_ATTEMPT = 10;
let attempts = 0;
const startWhenKeplrAvailable = (res: () => void) => {
  console.debug('looking for keplr');

  attempts += 1;

  // @ts-expect-error cast
  if (window.keplr) {
    const consoleTaming = import.meta.env.DEV ? 'unsafe' : 'safe';

    lockdown({
      errorTaming: 'unsafe',
      overrideTaming: 'severe',
      consoleTaming,
    });

    Error.stackTraceLimit = Infinity;

    console.log('Lockdown done.');
    res();
  } else {
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(() => startWhenKeplrAvailable(res), WAIT_PER_ATTEMPT);
    } else {
      alert('This site requires the Keplr extension');
    }
  }
};

await new Promise<void>(res => startWhenKeplrAvailable(res));
