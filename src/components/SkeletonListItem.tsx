const SkeletonListItem = () => {
  return (
    <div className="flex gap-3 items-center justify-between w-full animate-pulse">
      <div className="flex gap-3 items-center ">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>

        <div className="flex flex-col gap-2">
          <div className="w-20 h-4 bg-gray-300"></div>
          <div className="w-16 h-3 bg-gray-300"></div>
        </div>
      </div>
      <div className="text-right flex flex-col gap-2 items-end">
        <div className="w-20 h-4 bg-gray-300"></div>
        <div className="w-10 h-3 bg-gray-300"></div>
      </div>
    </div>
  );
};

export default SkeletonListItem;
