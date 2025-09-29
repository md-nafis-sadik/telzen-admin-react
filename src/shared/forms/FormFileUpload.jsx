import React, { Fragment } from "react";
import { cx } from "../../utils/helper";
import { CloseSvg, UploadSvg } from "../../utils/svgs";
import { commonInputCss } from "./FormInput";

const FormFileUpload = ({
  label,
  id,
  document,
  removeFileHandler,
  fileUploadHandler,
  labelCss,
  isCol = false,
  isLoading = false,
  skeletonClassName = "",
}) => {
  return (
    <div
      className={cx(
        isCol
          ? "flex flex-col gap-y-1"
          : "flex flex-row items-center gap-x-2 lg:gap-x-4",
        "relative"
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "text-text-700 text-sm text-medium",
            isCol ? "" : "min-w-[124px] max-w-[124px]",
            labelCss
          )}
        >
          {label}
        </label>
      )}

      {isLoading ? (
        <div
          className={cx(
            "h-[58px] w-full bg-neutral-300 animate-pulse rounded-lg text-neutral-300 select-none",
            skeletonClassName
          )}
        >
          asd
        </div>
      ) : (
        <div
          className={cx(
            commonInputCss,
            "flex justify-between border-2 border-dashed !border-main-500"
          )}
        >
          {document ? (
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="text-sm md:text-base font-medium text-text-700 line-clamp-1">
                {document.name}
              </p>
              <button onClick={removeFileHandler} className="hover:opacity-90">
                <CloseSvg w="24" h="24" color="#000" />
              </button>
            </div>
          ) : (
            <Fragment>
              <p className="text-sm md:text-base text-text-600">Upload file</p>
              <UploadSvg />
              <input
                type="file"
                id={id}
                accept="application/pdf"
                className="absolute top-0 left-0 opacity-0 min-h-full min-w-full cursor-pointer"
                onChange={fileUploadHandler}
              />
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default FormFileUpload;
