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
} from "../../features/business/businessSlice";
import {
  useGetActiveBusinessesQuery,
  useGetPendingBusinessesQuery,
  useApproveBusinessMutation,
  useDeleteBusinessMutation,
} from "../../features/business/businessApi";
import { getSymbol } from "../../utils/currency";

// Hook for Active Businesses
export const useGetActiveBusinesses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeBusinesses } = useSelector((state) => state.business);
  const { dataList, meta } = activeBusinesses;

  const { data, isLoading, isError, error } = useGetActiveBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setActiveBusinessData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const updatePageMeta = (value) => {
    // Handle pagination if needed
    console.log("Update page meta:", value);
  };

  const handleViewDetails = (business) => {
    dispatch(setSelectedBusiness(business));
    navigate(`/business/${business._id}`);
  };

  return {
    isLoading,
    isError,
    status: error?.status,
    meta,
    dataList,
    updatePageMeta,
    handleViewDetails,
  };
};

// Hook for Pending Businesses
export const useGetPendingBusinesses = () => {
  const dispatch = useDispatch();
  const { pendingBusinesses, isConfirmModalOpen, selectedBusiness, confirmModalType } =
    useSelector((state) => state.business);
  const { dataList, meta } = pendingBusinesses;

  const { data, isLoading, isError, error } = useGetPendingBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setPendingBusinessData({ data: data.data, meta: data.meta }));
    }
  }, [data, dispatch]);

  const [approveBusiness, { isLoading: approveLoading }] =
    useApproveBusinessMutation();
  const [deleteBusiness, { isLoading: deleteLoading }] =
    useDeleteBusinessMutation();

  const updatePageMeta = (value) => {
    // Handle pagination if needed
    console.log("Update page meta:", value);
  };

  const handleOpenApproveModal = (business) => {
    dispatch(openConfirmModal({ business, type: "approve" }));
  };

  const handleOpenDeleteModal = (business) => {
    dispatch(openConfirmModal({ business, type: "delete" }));
  };

  const handleCloseModal = () => {
    dispatch(closeConfirmModal());
  };

  const handleConfirm = async () => {
    if (!selectedBusiness) return;

    try {
      if (confirmModalType === "approve") {
        await approveBusiness({ id: selectedBusiness._id }).unwrap();
        dispatch(approveBusinessAction(selectedBusiness._id));
        successNotify("Business approved successfully!");
      } else if (confirmModalType === "delete") {
        await deleteBusiness({ id: selectedBusiness._id }).unwrap();
        dispatch(deleteBusinessAction(selectedBusiness._id));
        successNotify("Business deleted successfully!");
      }
      handleCloseModal();
    } catch (error) {
      errorNotify(
        error?.data?.message ||
          `Failed to ${confirmModalType} business. Please try again.`
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
    handleOpenDeleteModal,
    handleConfirm,
    handleCloseModal,
    isConfirmModalOpen,
    selectedBusiness,
    confirmModalType,
    approveLoading,
    deleteLoading,
  };
};

// Hook for Business Details
export const useGetBusinessDetails = () => {
  const { selectedBusiness } = useSelector((state) => state.business);
  const navigate = useNavigate();

  // Mock transaction data for the business
  const [transactionData] = useState([
    {
      id: "1",
      date: "25-10-2024",
      package: "Package 1",
      customer: "Cust Name 1",
      groupName: "-",
      customerEmail: "cust@gmail.com",
      customerPhone: "+88 0215521552",
      amount: "$299",
      revenue: "$88",
    },
    {
      id: "2",
      date: "25-10-2024",
      package: "Package 1",
      customer: "Cust Name 1",
      groupName: "-",
      customerEmail: "cust@gmail.com",
      customerPhone: "+88 0215521552",
      amount: "$299",
      revenue: "$10",
    },
    {
      id: "3",
      date: "25-10-2024",
      package: "Package 1",
      customer: "Cust Name 1",
      groupName: "-",
      customerEmail: "cust@gmail.com",
      customerPhone: "+88 0215521552",
      amount: "$299",
      revenue: "$1",
    },
  ]);

    const businessSummary = [
      {
        title: "Package Sold",
        number:  0,
        bgColor: "bg-[#CDFFE9]",
      },
      {
        title: "Selling Value",
        number:  0,
        currency: getSymbol(),
        bgColor: "bg-[#FFE5CC]",
      },
      {
        title: "Package Fee",
        number:  0,
        currency: getSymbol(),
        bgColor: "bg-[#C9ECFF]",
      },
      {
        title: "Gross Revenue",
        number:  0,
        currency: getSymbol(),
        bgColor: "bg-[#FFE0DF]",
      },
      {
        title: "Withdrawn",
        number: 0,
        currency: getSymbol(),
        bgColor: "bg-yellowLight",
      },
    ];

  const handleBack = () => {
    navigate("/business/active");
  };

  return {
    selectedBusiness,
    transactionData,
    handleBack,
    businessSummary,
    isLoading: false,
  };
};
