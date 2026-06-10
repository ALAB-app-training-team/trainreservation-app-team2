import { NavLink } from "react-router-dom";
import { BsTrainFreightFrontFill } from "react-icons/bs";

export function Header() {
  const buttons = [{ label: "新幹線を探す", to: "/searchSchedule" }];

  return (
    <div className="relative h-16 flex items-center justify-start gap-6 px-8 border-primary-light border-b-2">
      <NavLink
        to="/searchSchedule"
        className="flex items-center gap-2 text-lg text-primary font-bold px-4"
      >
        <BsTrainFreightFrontFill />
        新幹線でGO！
      </NavLink>
      <div className="flex-1 flex justify-end px-4">
        {buttons.map((button, index) => (
          <NavLink
            key={index}
            to={button.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-primary text-white" : "cursor-pointer"}`
            }
          >
            {button.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
