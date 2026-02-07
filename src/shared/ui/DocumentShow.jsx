import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { PdfDownloadIconSvg, PdfIconSvg } from "../../utils/svgs";

function DocumentShow({ 
  title = "Document.pdf", 
  fileUrl = "", 
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  showTrigger = true // show the trigger button by default for backward compatibility
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined 
    ? (value) => !value && externalOnClose() 
    : setInternalIsOpen;

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

  const shimmer = (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse bg-gray-200 h-12 w-12 rounded-full" />
    </div>
  );

  return (
    <>
      {showTrigger && (
        <div className="flex gap-2 items-center">
          <span className="justify-center text-black-900 text-lg font-medium leading-snug">
            {title}
          </span>

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => {
              setInternalIsOpen(true);
              setLoading(true); // reset loading on open
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L11.65 8.35C11.85 8.15 12.16 8.15 12.36 8.35L17 13H14Z" fill="#2D8EFF"/>
            </svg>
          </button>
        </div>
      )}

      {/* Shadcn Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 gap-0 select-none rounded-2xl w-[90vw] max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader className="border-b px-4 py-2 flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>

            {/* Download button */}
            {!isPdf && (
              <a
                href={fileUrl}
                download={title}
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
                target="_blank"
              >
                Download
              </a>
            )}
          </DialogHeader>

          {/* PDF or Image viewer */}
          <div className="flex-1 h-full overflow-hidden flex items-center justify-center pb-2 relative">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center gap-4 justify-center bg-gray-100">
                <p className="text-gray-200">Please Wait! Loading...</p>
                <div className="animate-pulse h-12 w-12 bg-gray-300 rounded-full" />
              </div>
            )}

            {isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-full rounded-lg"
                title="PDF Viewer"
                onLoad={() => setLoading(false)}
              />
            ) : (
              <img
                src={fileUrl}
                alt={title}
                className="max-w-full max-h-full object-contain rounded-lg"
                onLoad={() => setLoading(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentShow;
