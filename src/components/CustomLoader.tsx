import { MutatingDots } from 'react-loader-spinner';

const CustomLoader = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <MutatingDots
        color="#d8b4fe"
        secondaryColor="#fde047"
        height="100"
        width="100"
        radius="10"
      />
      <div className="pl-2 animate-pulse text-lg">{text}</div>
    </div>
  );
};

export default CustomLoader;
