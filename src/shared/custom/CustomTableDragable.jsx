import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { CustomSpinner } from ".";
import { DataNotFound, ErrorUi } from "../ui";
import { TablePreviousSvg } from "../../utils/svgs";
import { cx } from "../../utils/helper";
import { Select } from "antd";
import { SecondaryButton } from "../buttons";

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
    <div className="flex items-center justify-end gap-6 py-3 print:hidden">
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
          {[10, 20, 30, 40, 50].map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#fafafa" : "inherit",
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td className=" w-[5%]">
        <span
          {...listeners}
          style={{
            cursor: "grab",
            padding: "0 8px",
            display: "inline-block",
            touchAction: "none", // Prevent scrolling on touch devices
          }}
          aria-label="Drag handle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M20 9H4V11H20V9ZM4 15H20V13H4V15Z" fill="#131313" />
          </svg>
        </span>
      </td>
      {children}
    </tr>
  );
};

const CustomTableDragable = ({
  columns = [],
  data = [],
  isLoading,
  isError,
  status,
  children,
  onDragEnd,
  onSave,
  hasChanges,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id && onDragEnd) {
      const oldIndex = data.findIndex((item) => item._id === active.id);
      const newIndex = data.findIndex((item) => item._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newData = arrayMove(data, oldIndex, newIndex);
        onDragEnd(newData);
      }
    }
  };

  return (
    <div className="h-full min-h-[650px] flex flex-col justify-between">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto yes-scrollbar flex-1 print:overflow-visible">
          <table className="table table-auto table-pin-rows lg:table-pin-cols rounded-md border-separate border-spacing-0 print:w-full print:table-auto print:text-xs print:break-all">
            <thead className="p-0">
              <tr className="font-bold text-3xl text-blackHigh rounded-md">
                <th className="border-t-2 border-b-2 border-r-2 border-natural bg-themeSemi text-base normal-case print:px-1 print:py-1 print:text-xs print:break-words print:whitespace-normal">
                  &nbsp;
                </th>
                {columns.map((item, index) => {
                  const isLast = index === columns.length - 1;
                  return (
                    <th
                      key={index}
                      className={cx(
                        "border-t-2 border-b-2 border-r-2 border-natural bg-themeSemi text-base normal-case print:px-1 print:py-1 print:text-xs print:break-words print:whitespace-normal",
                        isLast ? "rounded-tr-md" : ""
                      )}
                    >
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <SortableContext
              items={data.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                <CustomTableHelper
                  isLoading={isLoading}
                  isError={isError}
                  status={status}
                  dataLength={data.length}
                  column={columns.length + 1}
                >
                  {React.Children.map(children, (child, index) => {
                    const item = data[index];
                    if (!item) return null;

                    return (
                      <SortableRow key={item._id} id={item._id}>
                        {child}
                      </SortableRow>
                    );
                  })}
                </CustomTableHelper>
              </tbody>
            </SortableContext>
          </table>
        </div>
      </DndContext>

      {hasChanges && (
        <div className="flex mt-4">
          <SecondaryButton text="Save Changes" width="w-max" onClick={onSave} />
        </div>
      )}
    </div>
  );
};

export default CustomTableDragable;
