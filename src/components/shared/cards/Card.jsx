import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "../../../utils/svgs";
import { setActivePath } from "../../../features/nav/navSlice";
import { useDispatch } from "react-redux";

function Card({ data }) {
  const { background, svgBg, number, title, svg, link, currency } = data || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={`p-6 ${background} rounded-xl`}>
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
          <div
            className={`w-8 md:w-10 h-8 md:h-10 shrink-0 rounded-full flex items-center justify-center ${svgBg}`}
          >
            {svg}
          </div>
          <p className="font-poppins font-normal text-black-700 whitespace-nowrap overflow-hidden text-ellipsis ml-3 text-base md:text-lg">
            {title}
          </p>
        </div>

        <span className="cursor-pointer"
          onClick={() => {
            {
              dispatch(setActivePath(link));
              navigate(link);
            }
          }}
        >
          <div className="bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center">
            <ArrowRightIcon />
          </div>
        </span>
      </div>
      <div className="mt-6">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-black-900 whitespace-nowrap overflow-hidden text-ellipsis">
          {currency}
          {number}
        </p>
      </div>
    </div>
  );
}

export default Card;
