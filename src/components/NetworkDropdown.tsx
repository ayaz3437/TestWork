import { Fragment, MouseEventHandler } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAtom } from 'jotai';
import { FiChevronDown } from 'react-icons/fi';
import { networkConfigAtom } from 'store/app';
import { networkConfigs } from 'config';

const Item = ({
  label,
  onClick,
}: {
  label: string;
  onClick: MouseEventHandler;
}) => {
  return (
    <div className="px-1 py-1 ">
      <Menu.Item>
        {({ active }) => (
          <button
            onClick={onClick}
            className={`${
              active ? 'bg-violet-300 text-white' : 'text-gray-900'
            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
          >
            {label}
          </button>
        )}
      </Menu.Item>
    </div>
  );
};

const NetworkDropdown = () => {
  const [networkConfig, setNetworkConfig] = useAtom(networkConfigAtom);

  const items = Object.values(networkConfigs).map(config => (
    <Item
      key={config.url}
      onClick={() => {
        setNetworkConfig(config);
        window.location.reload();
      }}
      label={config.label}
    />
  ));

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-5 px-4 py-3 text-md font-medium text-primary hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {networkConfig.label}
        <FiChevronDown
          className="ml-2 -mr-1 h-6 w-5 text-primary"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          {items}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NetworkDropdown;
