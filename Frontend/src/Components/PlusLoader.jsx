import { PulseLoader } from "react-spinners";

const PlusLoader = ({ size, color }) => {
  return (
    <div className="flex items-center justify-center">
      <PulseLoader size={size} color={color} />
    </div>
  );
};

export default PlusLoader;
