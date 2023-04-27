import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { termsIndexAgreedUponAtom } from 'store/app';
import { useSetAtom } from 'jotai';

// Increment every time the current terms change.
export const currentTermsIndex = 1;

const TermsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const setTermsAgreed = useSetAtom(termsIndexAgreedUponAtom);
  const [isChecked, setIsChecked] = useState(false);

  const proceed = () => {
    setTermsAgreed(currentTermsIndex);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          /* Force open unless terms are agreed */
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Disclaimer
                </Dialog.Title>
                <div className="mt-2 p-1 max-h-96 overflow-y-auto">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-500 cursor-pointer mr-2"
                      checked={isChecked}
                      onClick={() => setIsChecked(isChecked => !isChecked)}
                    />
                    <span>
                      By clicking here you are indicating that you have read and
                      agree to our{' '}
                      <a
                        className="text-blue-500 hover:text-blue-700"
                        target="inter_psm_disclaimer"
                        href="https://docs.inter.trade/disclaimer"
                      >
                        Disclaimer
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="mt-4 float-right">
                  <button
                    type="button"
                    disabled={!isChecked}
                    className={clsx(
                      'inline-flex justify-center rounded-md border border-transparent',
                      'px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2',
                      'focus-visible:ring-purple-500 focus-visible:ring-offset-2',
                      isChecked
                        ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-300'
                    )}
                    onClick={proceed}
                  >
                    Proceed
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TermsDialog;
