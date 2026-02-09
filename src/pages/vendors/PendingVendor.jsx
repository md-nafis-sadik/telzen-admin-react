import {
  CrossIcon,
  DocumentDeleteIcon,
  EyeSvgIcon,
  UnblockIcon,
} from "../../utils/svgs";
import { useGetPendingVendors } from "../../hooks/features/useVendor";
import NotifyContainer from "../../utils/notify";
import { CustomTable } from "../../shared/custom";
import ReactCountryFlag from "react-country-flag";
import ApproveModal from "../../components/modals/ApproveBusinessModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import DocumentShow from "../../shared/ui/DocumentShow";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
dayjs.extend(utc);

const PendingVendor = () => {
  const [documentModal, setDocumentModal] = useState({
    isOpen: false,
    title: "",
    fileUrl: "",
  });
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleOpenApproveModal,
    handleOpenRejectModal,
    handleConfirm,
    handleCloseModal,
    handleViewDetails,
    isConfirmModalOpen,
    selectedVendor,
    confirmModalType,
    approveLoading,
    rejectLoading,
  } = useGetPendingVendors();

  const handleOpenDocumentModal = (document) => {
    setDocumentModal({
      isOpen: true,
      title: document.original_name,
      fileUrl: document.path,
    });
  };

  const handleCloseDocumentModal = () => {
    setDocumentModal({ isOpen: false, title: "", fileUrl: "" });
  };

  return (
    <>
      <section className="h-full w-full min-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Vendor</h2>
          </div>

          <CustomTable
            isLoading={isLoading}
            isError={isError}
            status={status}
            current_page={meta?.current_page || 1}
            page_size={meta?.page_size || 10}
            total_pages={meta?.total_pages || 1}
            total_items={meta?.total_items || 0}
            updatePageMeta={updatePageMeta}
            columns={[
              "ID",
              "Country",
              "Name",
              "Email",
              "Contact Person",
              "Join Time",
              "Document",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((vendor, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={vendor._id}
              >
                <td className="py-4">{vendor.uid}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={vendor.country?.code}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{vendor.country?.name}</span>
                  </div>
                </td>
                <td className="py-4">{vendor.business_name}</td>
                <td className="py-4">{vendor.email}</td>
                <td className="py-4">{vendor.contact_person_name}</td>
                <td className="py-4">
                  {dayjs.unix(vendor.created_at).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="py-4">
                  {vendor?.document ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenDocumentModal(document)}
                        className="hover:opacity-80 transition-opacity"
                        title={document.original_name}
                      >
                        <DocumentDeleteIcon />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className=""
                      onClick={() => handleViewDetails(vendor)}
                      title="View Details"
                    >
                      <EyeSvgIcon />
                    </button>
                    <button
                      type="button"
                      className=""
                      onClick={() => handleOpenApproveModal(vendor)}
                      title="Approve Vendor"
                    >
                      <UnblockIcon />
                    </button>
                    <button
                      type="button"
                      className=""
                      onClick={() => handleOpenRejectModal(vendor)}
                      title="Reject Vendor"
                    >
                      <CrossIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>

      {/* Approve Modal */}
      {isConfirmModalOpen && confirmModalType === "approve" && (
        <ApproveModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          businessName={selectedVendor?.business_name}
          isLoading={approveLoading}
          title="Approve Vendor"
          message="Are you sure you want to approve this vendor?"
        />
      )}

      {/* Reject Modal */}
      {isConfirmModalOpen && confirmModalType === "reject" && (
        <DeleteConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          itemName={selectedVendor?.business_name}
          isDeleting={rejectLoading}
          title="Reject Vendor"
          message="Are you sure you want to reject this vendor? This action cannot be undone."
        />
      )}

      {/* Document Show Modal */}
      {documentModal.isOpen && (
        <DocumentShow
          isOpen={documentModal.isOpen}
          onClose={handleCloseDocumentModal}
          title={documentModal.title}
          fileUrl={documentModal.fileUrl}
        />
      )}

      <NotifyContainer />
    </>
  );
};

export default PendingVendor;
