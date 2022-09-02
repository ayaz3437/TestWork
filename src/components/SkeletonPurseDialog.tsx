import ListItem from 'components/ListItem';
import SkeletonListItem from 'components/SkeletonListItem';

const SkeletonPurseDialog = () => {
  return (
    <>
      <div className="flex gap-3 items-center justify-between w-full border-b px-5 py-3">
        <SkeletonListItem />
      </div>
      <div className="px-5 py-3">
        <h2 className="text-lg font-medium ">Select Purse</h2>
      </div>
      <div className="flex flex-col gap-4  px-5 pb-5 overflow-auto ">
        {[...Array(3).keys()].map(i => (
          <ListItem key={i}>
            <SkeletonListItem />
          </ListItem>
        ))}
      </div>
    </>
  );
};

export default SkeletonPurseDialog;
