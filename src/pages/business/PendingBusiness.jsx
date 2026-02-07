import { CrossIcon, DocumentDeleteIcon, LoadingSpinner, UnblockIcon } from "../../utils/svgs";
import { useGetPendingBusinesses } from "../../hooks/features/useBusiness";
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

const PendingBusiness = () => {
  const [documentModal, setDocumentModal] = useState({ isOpen: false, title: "", fileUrl: "" });
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
    isConfirmModalOpen,
    selectedBusiness,
    confirmModalType,
    approveLoading,
    rejectLoading,
  } = useGetPendingBusinesses();

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
            <h2 className="title-cmn text-[18px] font-semibold">Business</h2>
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
            {dataList?.map((business, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={business._id}
              >
                <td className="py-4">{business.uid}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={business.country?.code}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{business.country?.name}</span>
                  </div>
                </td>
                <td className="py-4">{business.business_name}</td>
                <td className="py-4">{business.email}</td>
                <td className="py-4">{business.contact_person_name}</td>
                <td className="py-4">
                  {dayjs.unix(business.created_at).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="py-4 flex items-center justify-center">
                  {business.document && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocumentModal(business.document)}
                      className="cursor-pointer"
                      title={business.document.original_name}
                    >
                      <DocumentDeleteIcon/>
                    </button>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className=""
                      onClick={() => handleOpenApproveModal(business)}
                      title="Approve Business"
                    >
                      <UnblockIcon />
                    </button>
                    <button
                      type="button"
                      className=""
                      onClick={() => handleOpenRejectModal(business)}
                      title="Reject Business"
                    >
                      <CrossIcon/>
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
          title="Approve Business"
          message="Are you sure to approve the business?"
          isLoading={approveLoading}
        />
      )}

      {/* Reject Modal */}
      {isConfirmModalOpen && confirmModalType === "reject" && (
        <DeleteConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          title="Reject Business"
          message="Are you sure to reject the business?"
          isLoading={rejectLoading}
        />
      )}

      {/* Document Modal */}
      {documentModal.isOpen && (
        <DocumentShow
          title={documentModal.title}
          fileUrl={documentModal.fileUrl}
          isOpen={documentModal.isOpen}
          onClose={handleCloseDocumentModal}
          showTrigger={false}
        />
      )}

      <NotifyContainer />
    </>
  );
};

export default PendingBusiness;
