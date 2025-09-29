import { Link } from "react-router-dom";

import { Select } from "antd";

function SearchBar({
  title,
  description,
  value,
  onChange,
  path,
  isNotPrintable,
  isNotAddable,
  addText,
  setFilterTypes,
  filterTypes,
  children,
  filterOptions,
  isSearchable,
  onPrint,
  onExport,
}) {
  const handleFilterChange = (type, value) => {
    console.log(type, value);
    setFilterTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="bg-white px-4 md:px-6 py-4 flex items-center justify-between rounded-t-2xl">
      <div className="flex items-center gap-8">
        <div className="mb-1">
          <div className=" text-black-900 text-lg sm:text-xl font-bold">
            {title}
          </div>
          <div className="font-light text-black-900">{description}</div>
        </div>
        {children}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {filterOptions && (
          <div className="flex items-center gap-2 flex-wrap">
            Showing:
            {filterOptions &&
              filterOptions.map((filterGroup) => (
                <div key={filterGroup.key} className="flex items-center gap-2">
                  {filterGroup.label && <span>{filterGroup.label}:</span>}
                  <Select
                    value={filterTypes[filterGroup.key] || ""}
                    onChange={(value) =>
                      handleFilterChange(filterGroup.key, value)
                    }
                    popupMatchSelectWidth={false}
                    className={`
                  w-auto text-sm border-l first-of-type:border-none
                        rounded-md
                        [&_.ant-select-selector]:!text-sm
                        [&_.ant-select-selector]:!h-7
                        [&_.ant-select-selector]:!px-2
                        [&_.ant-select-selector]:!flex
                        [&_.ant-select-selector]:!items-center
                `}
                  >
                    {filterGroup.options.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              ))}
          </div>
        )}

        {!isSearchable && (
          <div
            className={`flex items-center justify-end border rounded-lg ${
              isNotAddable ? "" : "gap-2 md:gap-6"
            } `}
          >
            <div className="relative">
              <label
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2"
                htmlFor="search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M15.755 14.2549H14.965L14.685 13.9849C15.665 12.8449 16.255 11.3649 16.255 9.75488C16.255 6.16488 13.345 3.25488 9.755 3.25488C6.165 3.25488 3.255 6.16488 3.255 9.75488C3.255 13.3449 6.165 16.2549 9.755 16.2549C11.365 16.2549 12.845 15.6649 13.985 14.6849L14.255 14.9649V15.7549L19.255 20.7449L20.745 19.2549L15.755 14.2549ZM9.755 14.2549C7.26501 14.2549 5.255 12.2449 5.255 9.75488C5.255 7.26488 7.26501 5.25488 9.755 5.25488C12.245 5.25488 14.255 7.26488 14.255 9.75488C14.255 12.2449 12.245 14.2549 9.755 14.2549Z"
                    fill="#9E9E9E"
                  />
                </svg>
              </label>
              <input
                id="search"
                value={value}
                onChange={onChange}
                className="pl-10 sm:pl-11 px-3 h-[46px] w-[150px] sm:w-[180px] lg:w-[200px] text-xs sm:text-sm md:text-base text-blackLow rounded-md border-none focus:outline-none bg-white"
                type="text"
                name="searchInput"
                placeholder={`Search ${addText}..`}
              />
            </div>
          </div>
        )}

        {!isNotAddable && (
          <div>
            <Link
              to={path}
              className="inline-flex px-6 py-3 bg-[#131313] text-white rounded-lg"
            >
              <div className="uppercase  text-sm font-semibold">
                Add {addText}
              </div>
            </Link>
          </div>
        )}

        {isNotPrintable && (
          <div>
            <div
              className="inline-flex px-6 py-3 bg-white border border-natural-500 text-black rounded-lg gap-2 cursor-pointer hover:bg-neutral-100"
              onClick={onExport}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M16.6666 2.1665H6.66663C5.74996 2.1665 4.99996 2.9165 4.99996 3.83317V13.8332C4.99996 14.7498 5.74996 15.4998 6.66663 15.4998H16.6666C17.5833 15.4998 18.3333 14.7498 18.3333 13.8332V3.83317C18.3333 2.9165 17.5833 2.1665 16.6666 2.1665ZM16.6666 13.8332H6.66663V3.83317H16.6666V13.8332ZM3.33329 5.49984H1.66663V17.1665C1.66663 18.0832 2.41663 18.8332 3.33329 18.8332H15V17.1665H3.33329V5.49984ZM13.3333 10.4998V7.99984C13.3333 7.5415 12.9583 7.1665 12.5 7.1665H10.8333V11.3332H12.5C12.9583 11.3332 13.3333 10.9582 13.3333 10.4998ZM11.6666 7.99984H12.5V10.4998H11.6666V7.99984ZM15 9.6665H15.8333V8.83317H15V7.99984H15.8333V7.1665H14.1666V11.3332H15V9.6665ZM8.33329 9.6665H9.16663C9.62496 9.6665 9.99996 9.2915 9.99996 8.83317V7.99984C9.99996 7.5415 9.62496 7.1665 9.16663 7.1665H7.49996V11.3332H8.33329V9.6665ZM8.33329 7.99984H9.16663V8.83317H8.33329V7.99984Z"
                  fill="#616161"
                />
              </svg>
              <div className="text-sm font-semibold">Export to Excel</div>
            </div>
          </div>
        )}

        {isNotPrintable && (
          <div>
            <div
              className="inline-flex px-6 py-3 bg-black border border-black text-white rounded-lg gap-2 cursor-pointer hover:bg-black-900"
              onClick={onPrint}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M15.8333 7.16667H15V3H4.99996V7.16667H4.16663C2.78329 7.16667 1.66663 8.28333 1.66663 9.66667V14.6667H4.99996V18H15V14.6667H18.3333V9.66667C18.3333 8.28333 17.2166 7.16667 15.8333 7.16667ZM6.66663 4.66667H13.3333V7.16667H6.66663V4.66667ZM13.3333 16.3333H6.66663V13H13.3333V16.3333ZM15 13V11.3333H4.99996V13H3.33329V9.66667C3.33329 9.20833 3.70829 8.83333 4.16663 8.83333H15.8333C16.2916 8.83333 16.6666 9.20833 16.6666 9.66667V13H15Z"
                  fill="#FAFAFA"
                />
                <path
                  d="M15 10.9167C15.4602 10.9167 15.8333 10.5436 15.8333 10.0833C15.8333 9.6231 15.4602 9.25 15 9.25C14.5397 9.25 14.1666 9.6231 14.1666 10.0833C14.1666 10.5436 14.5397 10.9167 15 10.9167Z"
                  fill="#FAFAFA"
                />
              </svg>
              <div className="text-sm font-semibold">Print</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
