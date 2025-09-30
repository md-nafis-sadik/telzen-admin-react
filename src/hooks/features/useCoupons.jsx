import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removeCouponFromList,
  setSelectedCouponData,
  setCouponMetaData,
  updateCouponInList,
  addNewCouponToList,
} from "../../features/coupons/couponSlice";
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
  useAddCouponMutation,
} from "../../features/coupons/couponApi";
import { useNavigate } from "react-router-dom";
import { useGetAllActiveCountrysQuery } from "../../features/packages/packageCountry";
import {
  AddCouponSchema,
  UpdateCouponSchema,
} from "../../utils/validations/couponSchemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const useDebouncedSearch = (inputValue, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => clearTimeout(debounceTimeout);
  }, [inputValue, delay]);

  return debouncedValue;
};

// ** Coupon List **
export const useGetCoupons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector((state) => state.coupon);
  const { current_page, page_size } = meta || {};
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterKey, setFilterKey] = useState(undefined);
  const debouncedSearch = useDebouncedSearch(searchKeyword, 1000);

  const isInitialRender = useRef(true);
  const prevSearchRef = useRef(debouncedSearch);
  const [forceRefetchTrigger, setForceRefetchTrigger] = useState(0);

  const apiParams = {
    page: current_page,
    limit: page_size,
    search: debouncedSearch,
    ...(filterKey !== undefined && { status: filterKey || null }),
    forceRefetch: forceRefetchTrigger,
  };

  const { isLoading, isFetching, isError, error } = useGetAllCouponsQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [couponId, setCouponId] = useState(null);
  const updatePageMeta = (value) => dispatch(setCouponMetaData(value));
  const handleSetSelectedCoupon = (data) =>
    dispatch(setSelectedCouponData(data));
  const [deleteCoupon, { isLoading: deleteLoading }] =
    useDeleteCouponMutation();
  const [updatingCoupons, setUpdatingCoupons] = useState({});
  const [updatePackageCoupon] = useUpdateCouponMutation();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
    // dispatch(setCouponMetaData({ ...meta, current_page: 1 }));
  }, [debouncedSearch, filterKey]);

  useEffect(() => {
    if (
      prevSearchRef.current !== "" &&
      debouncedSearch === "" &&
      dataList.length > 0
    ) {
      setForceRefetchTrigger((prev) => prev + 1);
    }

    prevSearchRef.current = debouncedSearch;
  }, [debouncedSearch, dataList.length]);

  const handleDelete = async () => {
    if (!couponId) {
      errorNotify("Coupon ID is required.");
      return false;
    }

    try {
      const response = await deleteCoupon({ id: couponId }).unwrap();
      if (response?.success) {
        dispatch(removeCouponFromList({ _id: couponId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete coupon");
      return false;
    }
  };

  const handleNavigate = (item) => {
    dispatch(setSelectedCouponData(item));
    navigate("/coupon-edit");
  };

  const handleOpenAddCouponModal = () => {
    navigate("/coupon-add", {
      state: {
        type: "add",
      },
    });
  };

  const handleStatusChange = async (couponId, newStatus) => {
    const apiStatus = newStatus === "Active";

    setUpdatingCoupons((prev) => ({ ...prev, [couponId]: true }));

    try {
      const result = await updatePackageCoupon({
        id: couponId,
        data: { is_active: apiStatus },
      }).unwrap();

      if (result?.success) {
        dispatch(
          updateCouponInList({ ...result?.data, _id: result?.data._id })
        );
      } else {
        errorNotify(result?.message || "Failed to update coupon status");
      }
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to update coupon status");
    } finally {
      setUpdatingCoupons((prev) => {
        const newState = { ...prev };
        delete newState[couponId];
        return newState;
      });
    }
  };

  return {
    dataList,
    meta,
    isLoading: isLoading || isFetching,
    isError,
    status: error?.status,
    updatePageMeta,
    handleDelete,
    deleteLoading,
    searchKeyword,
    setSearchKeyword,
    selectedData,
    handleSetSelectedCoupon,
    setCouponId,
    handleNavigate,
    handleOpenAddCouponModal,
    handleStatusChange,
    updatingCoupons,
  };
};

// ** Add Coupon **
export const useAddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discount: { amount: "" },
    is_private: false,
    validity_end_at: dayjs().utc().endOf("day").unix(),
    coverage_countries: [],
    max_usages_limit: 1,
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCoupon, { isLoading }] = useAddCouponMutation();

  const { data: countriesResponse, isLoading: isCountryLoading } =
    useGetAllActiveCountrysQuery();
  const countries = countriesResponse?.data || [];

  const sortedCountries = useMemo(() => {
    return countries
      .slice()
      .sort(
        (a, b) =>
          formData.coverage_countries.includes(b._id) -
          formData.coverage_countries.includes(a._id)
      );
  }, [countries, formData.coverage_countries]);

  // Generic nested value updater
  const updateNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) return { ...obj, [keys[0]]: value };
    const [parent, child] = keys;
    return { ...obj, [parent]: { ...obj[parent], [child]: value } };
  };

  const handleChange = (name, value) => {
    setFormData((prev) =>
      name === "is_private" && value === true
        ? { ...prev, is_private: true, coverage_countries: [] }
        : updateNestedValue(prev, name, value)
    );

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const result = AddCouponSchema.safeParse({
      ...formData,
      discount: { amount: Number(formData.discount.amount) || 0 },
    });

    if (!result.success) {
      const newErrors = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ])
      );
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm())
      return errorNotify("Please fix the errors in the form");

    try {
      const payload = {
        ...formData,
        discount: { amount: Number(formData.discount.amount) },
        ...(formData.max_usages_limit && {
          max_usages_limit: Number(formData.max_usages_limit),
        }),
        validity_end_at: formData.validity_end_at,
      };

      const response = await addCoupon({ data: payload }).unwrap();
      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewCouponToList(response.data));
      } else {
        errorNotify(response?.message || "Failed to create coupon");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      if (error.data?.errorMessages) {
        const apiErrors = Object.fromEntries(
          error.data.errorMessages.map((err) => [
            err.path.split(".")[0],
            err.message,
          ])
        );
        setErrors(apiErrors);
      }
      errorNotify(
        error.data?.message || "Failed to create coupon. Please try again."
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/coupon");
  };

  const isFormValid = AddCouponSchema.safeParse(formData).success;

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleModalOk,
    isModalVisible,
    isLoading,
    isFormValid,
    navigate,
    isCountryLoading,
    sortedCountries,
    countries,
  };
};

// ** Update Coupon **
export const useUpdateCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.coupon);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discount: { amount: "" },
    is_private: false,
    validity_end_at: dayjs().utc().endOf("day").unix(),
    coverage_countries: [],
    max_usages_limit: 1,
    _id: "",
  });

  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const { data: countriesResponse, isLoading: isCountryLoading } =
    useGetAllActiveCountrysQuery();
  const countries = countriesResponse?.data || [];

  useEffect(() => {
    if (!selectedData) return;
    setFormData({
      title: selectedData.title || "",
      code: selectedData.code || "",
      discount: { amount: selectedData.discount?.amount || "" },
      is_private: selectedData.is_private || false,
      validity_end_at:
        selectedData.validity_end_at || dayjs().utc().endOf("day").unix(),
      coverage_countries:
        selectedData.coverage_countries?.map((c) => c._id) || [],
      max_usages_limit: selectedData.max_usages_limit || 1,
      _id: selectedData._id || "",
    });
  }, [selectedData]);

  const sortedCountries = useMemo(() => {
    return countries
      .slice()
      .sort(
        (a, b) =>
          formData.coverage_countries.includes(b._id) -
          formData.coverage_countries.includes(a._id)
      );
  }, [countries, formData.coverage_countries]);

  const updateNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) return { ...obj, [keys[0]]: value };
    const [parent, child] = keys;
    return { ...obj, [parent]: { ...obj[parent], [child]: value } };
  };

  const handleChange = (name, value) => {
    setFormData((prev) =>
      name === "is_private" && value === true
        ? { ...prev, is_private: true, coverage_countries: [] }
        : updateNestedValue(prev, name, value)
    );

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const result = UpdateCouponSchema.safeParse({
      ...formData,
      discount: {
        amount:
          formData.discount.amount === ""
            ? undefined
            : Number(formData.discount.amount),
      },
    });

    if (!result.success) {
      const newErrors = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ])
      );
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm())
      return message.error("Please fix the errors in the form");

    try {
      const payload = {
        title: formData.title,
        code: formData.code,
        discount: { amount: Number(formData.discount.amount) },
        is_private: formData.is_private,
        validity_end_at: formData.validity_end_at,
        coverage_countries: formData.coverage_countries,
        ...(formData.max_usages_limit && {
          max_usages_limit: Number(formData.max_usages_limit),
        }),
      };

      const result = await updateCoupon({
        id: formData._id,
        data: payload,
      }).unwrap();

      if (result.success) {
        setIsModalVisible(true);
        dispatch(updateCouponInList(result.data));
      } else {
        message.error(result.message || "Failed to update coupon");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      if (error.data?.errorMessages) {
        const apiErrors = Object.fromEntries(
          error.data.errorMessages.map((err) => [
            err.path.split(".")[0],
            err.message,
          ])
        );
        setErrors(apiErrors);
      }
      message.error(
        error.data?.message || "An error occurred while updating the coupon"
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/coupon");
  };

  const isFormValid = UpdateCouponSchema.safeParse(formData).success;

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleModalOk,
    isModalVisible,
    isLoading,
    isFormValid,
    navigate,
    isCountryLoading,
    sortedCountries,
    countries,
  };
};
