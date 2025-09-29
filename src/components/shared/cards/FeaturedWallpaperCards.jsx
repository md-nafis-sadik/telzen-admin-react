import React, { useState } from "react";
import ConfirmationModal from "../../modals/ConfirmationModal";
import Pagination from "../pagination/Pagination";
import NoData from "../ui/NoData";

function FeaturedWallpaperCards({ data, handler }) {
  const [current_page, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const indexOfLastRow = current_page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-full h-[calc(100%-75px)] overflow-auto">
        {currentRows?.length === 0 && (
          <div className="w-full flex items-center justify-center">
            <NoData></NoData>
          </div>
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {currentRows?.map((item, i) => (
            <div className="bg-white rounded-md overflow-hidden" key={i}>
              <div>
                <img
                  src={item?.imageUrl}
                  alt=""
                  className="h-64 w-full object-cover bg-center "
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="">
                  <p className="font-semibold text-blackHigh">
                    {item?.wallpaperName?.length > 18
                      ? item?.wallpaperName?.slice(0, 18) + "..."
                      : item?.wallpaperName}
                  </p>
                  <p className="font-sm text-blackHigh">
                    by{" "}
                    <span className="font-bold">
                      {item?.authorName?.length > 18
                        ? item?.authorName?.slice(0, 18) + "..."
                        : item?.authorName}
                    </span>
                  </p>
                </div>
                {!item?.isFeatured ? (
                  <button
                    type="button"
                    className="bg-primaryColor rounded-md py-2 px-4 text-white text-sm"
                    onClick={() => handler({ id: item?._id, isFeatured: true })}
                  >
                    Set
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-fadeColor rounded-md py-2 px-4 text-white text-sm"
                    onClick={() =>
                      handler({ id: item?._id, isFeatured: false })
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <Pagination
          current_page={current_page}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={data?.length}
        ></Pagination>
        <ConfirmationModal title="wallpaper request"></ConfirmationModal>
      </div>
    </div>
  );
}

export default FeaturedWallpaperCards;
