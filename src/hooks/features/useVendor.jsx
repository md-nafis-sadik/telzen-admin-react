import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  setActiveVendorData,
  setPendingVendorData,
  approveVendor as approveVendorAction,
  deleteVendor as deleteVendorAction,
  setSelectedVendor,
  openConfirmModal,
  closeConfirmModal,
  setActiveTab,
} from "../../features/vendors/vendorSlice";
import {
  useGetActiveVendorsQuery,
  useGetPendingVendorsQuery,
  useGetSingleVendorQuery,
  useBlockVendorMutation,
  useApproveVendorMutation,
  useRejectVendorMutation,
} from "../../features/vendors/vendorApi";
import { getSymbol } from "../../utils/currency";

// Hook for Active Vendors
export const useGetActiveVendors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeVendors } = useSelector((state) => state.vendor);
  const { dataList, meta } = activeVendors;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [updatingVendors, setUpdatingVendors] = useState({});

  const { data, isLoading, isError, error, refetch } =
    useGetActiveVendorsQuery(
      { page, limit },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const [blockVendor] = useBlockVendorMutation();

  useEffect(() => {
    if (data?.data) {
      dispatch(setActiveVendorData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const updatePageMeta = (value) => {
    setPage(value);
  };

  const handleViewDetails = (vendor) => {
    dispatch(setSelectedVendor(vendor));
    dispatch(setActiveTab("active"));
    navigate(`/vendors/${vendor._id}`);
  };

  const handleBlockVendor = async (vendorId, isBlocked) => {
    setUpdatingVendors((prev) => ({ ...prev, [vendorId]: true }));
    try {
      await blockVendor({ vendorId, isBlocked }).unwrap();
      successNotify(
        isBlocked
          ? "Vendor blocked successfully!"
          : "Vendor unblocked successfully!",
      );
      refetch();
    } catch (error) {
      errorNotify(
        error?.data?.message ||
          "Failed to update vendor status. Please try again.",
      );
    } finally {
      setUpdatingVendors((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  return {
    isLoading,
    isError,
    status: error?.status,
    meta,
    dataList,
    updatePageMeta,
    handleViewDetails,
    handleBlockVendor,
    updatingVendors,
  };
};

// Hook for Pending Vendors
export const useGetPendingVendors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    pendingVendors,
    isConfirmModalOpen,
    selectedVendor,
    confirmModalType,
  } = useSelector((state) => state.vendor);
  const { dataList, meta } = pendingVendors;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error, refetch } =
    useGetPendingVendorsQuery(
      { page, limit },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  useEffect(() => {
    if (data?.data) {
      dispatch(setPendingVendorData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const [approveVendor, { isLoading: approveLoading }] =
    useApproveVendorMutation();
  const [rejectVendor, { isLoading: rejectLoading }] =
    useRejectVendorMutation();

  const updatePageMeta = (value) => {
    setPage(value);
  };

  const handleOpenApproveModal = (vendor) => {
    dispatch(openConfirmModal({ vendor, type: "approve" }));
  };

  const handleOpenRejectModal = (vendor) => {
    dispatch(openConfirmModal({ vendor, type: "reject" }));
  };

  const handleCloseModal = () => {
    dispatch(closeConfirmModal());
  };

  const handleViewDetails = (vendor) => {
    dispatch(setSelectedVendor(vendor));
    dispatch(setActiveTab("pending"));
    navigate(`/vendors/${vendor._id}`);
  };

  const handleConfirm = async () => {
    if (!selectedVendor) return;

    try {
      if (confirmModalType === "approve") {
        await approveVendor(selectedVendor._id).unwrap();
        dispatch(approveVendorAction(selectedVendor._id));
        successNotify("Vendor approved successfully!");
        refetch();
        handleCloseModal();
      } else if (confirmModalType === "reject") {
        await rejectVendor(selectedVendor._id).unwrap();
        dispatch(deleteVendorAction(selectedVendor._id));
        successNotify("Vendor rejected successfully!");
        refetch();
        handleCloseModal();
      }
    } catch (error) {
      errorNotify(
        error?.data?.message ||
          `Failed to ${confirmModalType} vendor. Please try again.`,
      );
    }
  };

  return {
    isLoading,
    isError,
    status: error?.status,
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
  };
};

// Hook for Vendor Details
export const useGetVendorDetails = (vendorId) => {
  const navigate = useNavigate();

  const {
    data: vendorData,
    isLoading,
    isError,
  } = useGetSingleVendorQuery(vendorId, {
    skip: !vendorId,
  });

  const { activeTab } = useSelector((state) => state.vendor);

  const vendor = vendorData?.data;
  const stats = vendor?.details?.stats;
  const orders = vendor?.details?.orders || [];
  const meta = vendor?.details?.meta || null;

  const vendorSummary = [
    {
      title: "Package Sold",
      number: stats?.total_package_sold || 0,
      bgColor: "bg-[#CDFFE9]",
    },
    {
      title: "Selling Value",
      number: stats?.total_selling_value || 0,
      currency: getSymbol(stats?.currency),
      bgColor: "bg-[#FFE5CC]",
    },
    {
      title: "Package Fee",
      number: stats?.total_retailer_fee || 0,
      currency: getSymbol(stats?.currency),
      bgColor: "bg-[#C9ECFF]",
    },
    {
      title: "Gross Revenue",
      number: stats?.revenue || 0,
      currency: getSymbol(stats?.currency),
      bgColor: "bg-[#FFE0DF]",
    },
    {
      title: "Withdrawn",
      number: stats?.withdrawn_amount || 0,
      currency: getSymbol(stats?.currency),
      bgColor: "bg-yellowLight",
    },
  ];

  const handleBack = () => {
    navigate("/vendors/active");
  };

  return {
    selectedVendor: vendor,
    transactionData: orders,
    handleBack,
    vendorSummary,
    isLoading,
    isError,
    stats,
    activeTab,
    meta,
  };
};
