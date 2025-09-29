import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { CustomSpinner } from ".";
import { DataNotFound, ErrorUi } from "../ui";
import { TablePreviousSvg } from "../../utils/svgs";
import { cx } from "../../utils/helper";
import { Select } from "antd";

const CustomTable = ({
  columns = [],
  dataLength,
  isLoading,
  isError,
  status,
  current_page,
  page_size,
  total_pages,
  updatePageMeta,
  total_items,
  children,
  isPagination = true,
}) => {
  return (
    <div className="h-full min-h-[650px] flex flex-col justify-between">
      <div className="overflow-x-auto yes-scrollbar flex-1 print:overflow-visible">
        <table className="table min-w-max table-auto table-pin-rows lg:table-pin-cols rounded-md border-separate border-spacing-0 print:w-full print:table-auto print:text-xs print:break-all">
          <thead className="p-0">
            <tr className="font-bold text-3xl text-blackHigh rounded-md">
              {columns.map((item, index) => {
                // Apply specific styling for first and last columns
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;
                return (
                  <th
                    key={index}
                    className={cx(
                      "border-t-2 border-b-2 border-r-2 border-natural bg-themeSemi text-base normal-case",
                      "print:px-1 print:py-1 print:text-xs print:break-words print:whitespace-normal",
                      isFirst ? "border-l-2 rounded-tl-md" : "",
                      isLast ? "rounded-tr-md" : "",
                      !isFirst && !isLast ? "" : ""
                    )}
                    style={{
                      contain: "paint",
                    }}
                  >
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <CustomTableHelper
              isLoading={isLoading}
              isError={isError}
              status={status}
              dataLength={dataLength}
              column={columns?.length}
            >
              {children}
            </CustomTableHelper>
          </tbody>
        </table>
      </div>

      {dataLength > 0 && isPagination && (
        <CustomPaginate
          current_page={current_page || 1}
          rowsPerPage={page_size || 1}
          total_pages={total_pages || 1}
          updatePage={updatePageMeta}
          dataLength={dataLength}
          total_items={total_items}
        />
      )}
    </div>
  );
};

const CustomTableHelper = ({
  isLoading = false,
  isError = false,
  status = 404,
  column = 3,
  dataLength = 0,
  emptyTitle = "No data Found",
  errorTitle = "Couldn't retrieve the data.",
  children,
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={column}>
          <CustomSpinner />
        </td>
      </tr>
    );
  }

  if (isError && status !== 404) {
    return (
      <tr>
        <td colSpan={column}>
          <ErrorUi title={errorTitle} />
        </td>
      </tr>
    );
  }

  if (dataLength === 0) {
    return (
      <tr>
        <td colSpan={column}>
          <DataNotFound title={emptyTitle} />
        </td>
      </tr>
    );
  }

  return children;
};

const CustomPaginate = ({
  current_page,
  rowsPerPage,
  total_pages,
  dataLength,
  total_items,
  updatePage = () => {},
}) => {
  const firstItem = (current_page - 1) * rowsPerPage + 1;
  const lastItem = Math.min(current_page * rowsPerPage, total_items);
  return (
    <div className="flex items-center flex-wrap justify-end gap-6 py-3 print:hidden">
      <div className="text-black-600 pageDetails">
        {total_items === 0
          ? "No entries to show"
          : `Showing ${firstItem} to ${lastItem} from ${total_items} entries`}
      </div>
      <ResponsivePagination
        current={current_page}
        total={total_pages == 0 ? 1 : total_pages}
        onPageChange={(value) => updatePage({ current_page: value })}
        maxWidth={250}
        pageLinkClassName="w-8 h-8 flex items-center justify-center"
        activeItemClassName="bg-neutral-700 w-8 h-8 text-white text-sm font-bold rounded-[8px]"
        pageItemClassName="w-8 h-8 flex-shrink-0"
        previousLabel={<TablePreviousSvg isDisabled={current_page === 1} />}
        nextLabel={
          <TablePreviousSvg
            cls="rotate-180"
            isDisabled={current_page === total_pages}
          />
        }
      />
      <div className="hidden md:block">
        <Select
          className="w-[70px] border border-neutral-300 text-text-900 bg-white rounded-[8px] text-sm outline-none [&_.ant-select-selector]:!text-sm
                      [&_.ant-select-selector]:!h-7
                      [&_.ant-select-selector]:!pr-2
                      [&_.ant-select-selector]:!pl-3
                      [&_.ant-select-selector]:!flex
                      [&_.ant-select-selector]:!items-center
                      "
          value={rowsPerPage}
          onChange={(value) => updatePage({ page_size: value })}
        >
          {[10, 25, 50, 100, 250, 500, 1500].map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CustomTable;
