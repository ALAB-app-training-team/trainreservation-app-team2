import { useNavigate } from "react-router-dom";
import { BsTrainFreightFrontFill } from "react-icons/bs";

export function Header() {
  const navigate = useNavigate();

  return (
    <div className="relative h-16 flex items-center justify-start gap-6 px-8 border-primary-light border-b-2">
      <div className="flex items-center gap-2 text-lg text-primary font-bold px-4">
        <BsTrainFreightFrontFill />
        新幹線でGO！
      </div>
      <div className="flex-1 flex justify-end px-4">
        <button
          className="bg-primary-light rounded-xl px-4 py-3 cursor-pointer text-sm font-bold"
          onClick={() => {
            navigate("/searchResult");
          }}
        >
          新幹線を探す
        </button>
      </div>
    </div>
  );
}
