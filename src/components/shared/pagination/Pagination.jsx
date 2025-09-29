import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

function Pagination({
  current_page,
  total_pages,
  page_size = 0,
  updatePage = () => {},
  updatepage_size = () => {},
}) {
  return (
    <div className="flex items-center justify-end gap-6 py-3">
      <ResponsivePagination
        current={current_page}
        total={total_pages == 0 ? 1 : total_pages}
        onPageChange={(value) => updatePage({ current_page: value })}
        maxWidth={250}
      />
      <div className="dropdown dropdown-top dropdown-end">
        <label
          tabIndex={3}
          className="rounded-lg px-4 py-2 border border-blackLow cursor-pointer flex items-center"
        >
          {page_size} &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.83398 7.91669L10.0007 12.0834L14.1673 7.91669H5.83398Z"
              fill="#6C6C6C"
            />
          </svg>
        </label>
        <ul
          tabIndex={3}
          className="dropdown-content menu p-1 mt-2 m-0.5 shadow bg-white rounded-md"
        >
          <li>
            <p onClick={() => updatepage_size(12)} className="py-1">
              12
            </p>
          </li>
          <hr className="text-disabledColor opacity-10" />
          <li>
            <p onClick={() => updatepage_size(25)} className="py-1">
              25
            </p>
          </li>
          <hr className="text-disabledColor opacity-10" />
          <li>
            <p onClick={() => updatepage_size(50)} className="py-1">
              50
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Pagination;
