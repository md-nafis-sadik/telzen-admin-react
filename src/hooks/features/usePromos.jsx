import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removePromoFromList,
  setSelectedPromoData,
  setPromoMetaData,
  updatePromoInList,
  addNewPromoToList,
} from "../../features/promos/promoSlice";
import {
  useGetAllPromosQuery,
  useDeletePromoMutation,
  useUpdatePromoMutation,
  useAddPromoMutation,
} from "../../features/promos/promoApi";
import { useNavigate } from "react-router-dom";
import { useGetAllActiveCountrysQuery } from "../../features/packages/packageCountry";
import {
  AddPromoSchema,
  UpdatePromoSchema,
} from "../../utils/validations/promoSchemas";
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

// ** Promo List **
export const useGetPromos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector((state) => state.promo);
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

  const { isLoading, isFetching, isError, error } = useGetAllPromosQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [promoId, setPromoId] = useState(null);
  const updatePageMeta = (value) => dispatch(setPromoMetaData(value));
  const handleSetSelectedPromo = (data) => dispatch(setSelectedPromoData(data));
  const [deletePromo, { isLoading: deleteLoading }] = useDeletePromoMutation();
  const [updatingPromos, setUpdatingPromos] = useState({});
  const [updatePackagePromo] = useUpdatePromoMutation();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
    // dispatch(setPromoMetaData({ ...meta, current_page: 1 }));
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
    if (!promoId) {
      errorNotify("Promo ID is required.");
      return false;
    }

    try {
      const response = await deletePromo({ id: promoId }).unwrap();
      if (response?.success) {
        dispatch(removePromoFromList({ _id: promoId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete promo");
      return false;
    }
  };

  const handleNavigate = (item) => {
    dispatch(setSelectedPromoData(item));
    navigate("/promo-edit");
  };

  const handleOpenAddPromoModal = () => {
    navigate("/promo-add", {
      state: {
        type: "add",
      },
    });
  };

  const handleStatusChange = async (promoId, newStatus) => {
    const apiStatus = newStatus === "Active";

    setUpdatingPromos((prev) => ({ ...prev, [promoId]: true }));

    try {
      const result = await updatePackagePromo({
        id: promoId,
        data: { is_active: apiStatus },
      }).unwrap();

      if (result?.success) {
        dispatch(updatePromoInList({ ...result?.data, _id: result?.data._id }));
      } else {
        errorNotify(result?.message || "Failed to update promo status");
      }
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to update promo status");
    } finally {
      setUpdatingPromos((prev) => {
        const newState = { ...prev };
        delete newState[promoId];
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
    handleSetSelectedPromo,
    setPromoId,
    handleNavigate,
    handleOpenAddPromoModal,
    handleStatusChange,
    updatingPromos,
  };
};

// ** Add Promo **
export const useAddPromo = () => {
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
  const [addPromo, { isLoading }] = useAddPromoMutation();

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
    const result = AddPromoSchema.safeParse({
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

      const response = await addPromo({ data: payload }).unwrap();
      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewPromoToList(response.data));
      } else {
        errorNotify(response?.message || "Failed to create promo");
      }
    } catch (error) {
      console.error("Error creating promo:", error);
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
        error.data?.message || "Failed to create promo. Please try again."
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/promo");
  };

  const isFormValid = AddPromoSchema.safeParse(formData).success;

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

// ** Update Promo **
export const useUpdatePromo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.promo);

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
  const [updatePromo, { isLoading }] = useUpdatePromoMutation();

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
    const result = UpdatePromoSchema.safeParse({
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

      const result = await updatePromo({
        id: formData._id,
        data: payload,
      }).unwrap();

      if (result.success) {
        setIsModalVisible(true);
        dispatch(updatePromoInList(result.data));
      } else {
        message.error(result.message || "Failed to update promo");
      }
    } catch (error) {
      console.error("Error updating promo:", error);
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
        error.data?.message || "An error occurred while updating the promo"
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/promo");
  };

  const isFormValid = UpdatePromoSchema.safeParse(formData).success;

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
