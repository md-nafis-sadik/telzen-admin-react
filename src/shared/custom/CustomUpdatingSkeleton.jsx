import { cx } from "../../utils/helper";

const SkeletonSpinBox = ({ className }) => (
  <div
    className={cx(
      "h-7 w-[90px] rounded-md bg-neutral-200 flex items-center justify-center gap-1",
      className
    )}
  >
    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <div className="text-xs text-white">Updating...</div>
  </div>
);

export default SkeletonSpinBox;
