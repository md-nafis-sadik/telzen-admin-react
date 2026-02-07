import { useState } from "react";
import { MinusCircleIcon } from "../../utils/svgs";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 ${
          isClosing ? "modal-backdrop-closing" : "modal-backdrop-animate"
        }`}
        onClick={() => !isLoading && setIsClosing(true)}
        onAnimationEnd={handleAnimationEnd}
      ></div>

      <div
        className={`relative bg-white rounded-2xl w-[90%] max-w-[462px] px-6 py-8 flex flex-col items-center gap-6 ${
          isClosing ? "modal-content-closing" : "modal-content-animate"
        }`}
      >
        <div className="flex items-center justify-center">
          <MinusCircleIcon w="74" h="74" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold text-black-800">{title}</h2>

          <p className="text-base text-black-600 text-center">{message}</p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-black-800 hover:bg-black text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Requesting..." : "Got it"}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
