import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  setActiveBusinessData,
  setPendingBusinessData,
  approveBusiness as approveBusinessAction,
  deleteBusiness as deleteBusinessAction,
  setSelectedBusiness,
  openConfirmModal,
  closeConfirmModal,
  setActiveTab,
} from "../../features/business/businessSlice";
import {
  useGetActiveBusinessesQuery,
  useGetPendingBusinessesQuery,
  useGetSingleBusinessQuery,
  useBlockBusinessMutation,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} from "../../features/business/businessApi";
import { getSymbol } from "../../utils/currency";

// Hook for Active Businesses
export const useGetActiveBusinesses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeBusinesses } = useSelector((state) => state.business);
  const { dataList, meta } = activeBusinesses;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [updatingBusinesses, setUpdatingBusinesses] = useState({});

  const { data, isLoading, isError, error, refetch } =
    useGetActiveBusinessesQuery(
      { page, limit },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const [blockBusiness] = useBlockBusinessMutation();

  useEffect(() => {
    if (data?.data) {
      dispatch(setActiveBusinessData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const updatePageMeta = (value) => {
    setPage(value);
  };

  const handleViewDetails = (business) => {
    dispatch(setSelectedBusiness(business));
    dispatch(setActiveTab("active"));
    navigate(`/business/${business._id}`);
  };

  const handleBlockBusiness = async (businessId, isBlocked) => {
    setUpdatingBusinesses((prev) => ({ ...prev, [businessId]: true }));
    try {
      await blockBusiness({ businessId, isBlocked }).unwrap();
      successNotify(
        isBlocked
          ? "Business blocked successfully!"
          : "Business unblocked successfully!",
      );
      refetch();
    } catch (error) {
      errorNotify(
        error?.data?.message ||
          "Failed to update business status. Please try again.",
      );
    } finally {
      setUpdatingBusinesses((prev) => ({ ...prev, [businessId]: false }));
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
    handleBlockBusiness,
    updatingBusinesses,
  };
};

// Hook for Pending Businesses
export const useGetPendingBusinesses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    pendingBusinesses,
    isConfirmModalOpen,
    selectedBusiness,
    confirmModalType,
  } = useSelector((state) => state.business);
  const { dataList, meta } = pendingBusinesses;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error, refetch } =
    useGetPendingBusinessesQuery(
      { page, limit },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  useEffect(() => {
    if (data?.data) {
      dispatch(setPendingBusinessData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const [approveBusiness, { isLoading: approveLoading }] =
    useApproveBusinessMutation();
  const [rejectBusiness, { isLoading: rejectLoading }] =
    useRejectBusinessMutation();

  const updatePageMeta = (value) => {
    setPage(value);
  };

  const handleOpenApproveModal = (business) => {
    dispatch(openConfirmModal({ business, type: "approve" }));
  };

  const handleOpenRejectModal = (business) => {
    dispatch(openConfirmModal({ business, type: "reject" }));
  };

  const handleCloseModal = () => {
    dispatch(closeConfirmModal());
  };

  const handleViewDetails = (business) => {
    dispatch(setSelectedBusiness(business));
    dispatch(setActiveTab("pending"));
    navigate(`/business/${business._id}`);
  };

  const handleConfirm = async () => {
    if (!selectedBusiness) return;

    try {
      if (confirmModalType === "approve") {
        await approveBusiness(selectedBusiness._id).unwrap();
        dispatch(approveBusinessAction(selectedBusiness._id));
        successNotify("Business approved successfully!");
        refetch();
        handleCloseModal();
      } else if (confirmModalType === "reject") {
        await rejectBusiness(selectedBusiness._id).unwrap();
        dispatch(deleteBusinessAction(selectedBusiness._id));
        successNotify("Business rejected successfully!");
        refetch();
        handleCloseModal();
      }
    } catch (error) {
      errorNotify(
        error?.data?.message ||
          `Failed to ${confirmModalType} business. Please try again.`,
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
    selectedBusiness,
    confirmModalType,
    approveLoading,
    rejectLoading,
  };
};

// Hook for Business Details
export const useGetBusinessDetails = (businessId) => {
  const navigate = useNavigate();

  const {
    data: businessData,
    isLoading,
    isError,
  } = useGetSingleBusinessQuery(businessId, {
    skip: !businessId,
  });

  const { activeTab } = useSelector((state) => state.business);

  const business = businessData?.data;
  const stats = business?.details?.stats;
  const orders = business?.details?.orders || [];
  const meta = business?.details?.meta || null;

  const businessSummary = [
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
    navigate("/business/active");
  };

  return {
    selectedBusiness: business,
    transactionData: orders,
    handleBack,
    businessSummary,
    isLoading,
    isError,
    stats,
    activeTab,
    meta,
  };
};
