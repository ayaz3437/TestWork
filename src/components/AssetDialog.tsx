import AssetListItem from 'components/AssetListItem';
import ListItem from 'components/ListItem';
import SkeletonListItem from 'components/SkeletonListItem';
import type { Brand } from 'store/app';

const AssetDialog = ({
  brands,
  handleBrandSelected,
}: {
  brands: Array<Brand>;
  handleBrandSelected: (brand: Brand) => void;
}) => {
  if (!(brands && brands.length))
    return (
      <div className="flex flex-col gap-4 p-5 overflow-auto ">
        {[...Array(4).keys()].map(i => (
          <ListItem key={i}>
            <SkeletonListItem />
          </ListItem>
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-5 overflow-auto ">
      {brands.map(brand => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          key={brand}
          onClick={() => {
            handleBrandSelected(brand);
          }}
        >
          <ListItem>
            <AssetListItem brand={brand} />
          </ListItem>
        </div>
      ))}
    </div>
  );
};

export default AssetDialog;
