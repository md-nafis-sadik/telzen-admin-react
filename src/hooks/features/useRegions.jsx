import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removeRegionFromList,
  setSelectedRegionData,
  setRegionMetaData,
  updateRegionInList,
  addNewRegionToList,
} from "../../features/packages/packageRegion/regionSlice";
import {
  useGetAllRegionsQuery,
  useDeleteRegionMutation,
  useUpdateRegionMutation,
  useAddRegionMutation,
} from "../../features/packages/packageRegion/regionApi";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { regionSchema } from "../../utils/validations/regionSchemas";

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

// ** Region List **
export const useGetRegions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector((state) => state.region);
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

  const { isLoading, isFetching, isError, error } = useGetAllRegionsQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [regionId, setRegionId] = useState(null);
  const [updatingRegions, setUpdatingRegions] = useState({});
  const [updatePackageRegion] = useUpdateRegionMutation();
  const [deleteRegion, { isLoading: deleteLoading }] =
    useDeleteRegionMutation();

  const updatePageMeta = (value) => dispatch(setRegionMetaData(value));
  const handleSetSelectedRegion = (data) =>
    dispatch(setSelectedRegionData(data));

  // Reset page on search/filter change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
    // dispatch(setRegionMetaData({ ...meta, current_page: 1 }));
  }, [debouncedSearch, filterKey]);

  // Force refetch if search is cleared
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

  // Handle delete region
  const handleDelete = async () => {
    if (!regionId) {
      errorNotify("Region ID is required.");
      return false;
    }

    try {
      const response = await deleteRegion({ id: regionId }).unwrap();
      if (response?.success) {
        dispatch(removeRegionFromList({ _id: regionId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete region");
      return false;
    }
  };

  const handleNavigate = (item) => {
    dispatch(setSelectedRegionData(item));
    navigate("/package-region-edit");
  };

  const handleOpenAddRegionModal = () => {
    navigate("/package-region-add", { state: { type: "add" } });
  };

  const handleStatusChange = async (regionId, newStatus) => {
    const apiStatus = newStatus === "Active" ? "active" : "inactive";

    setUpdatingRegions((prev) => ({ ...prev, [regionId]: true }));

    try {
      const result = await updatePackageRegion({
        id: regionId,
        data: { status: apiStatus },
      }).unwrap();

      if (result?.success) {
        dispatch(updateRegionInList({ ...result.data, _id: result.data._id }));
      } else {
        errorNotify(result?.message || "Failed to update region status");
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to update region status");
    } finally {
      setUpdatingRegions((prev) => {
        const newState = { ...prev };
        delete newState[regionId];
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
    handleSetSelectedRegion,
    filterKey,
    setFilterKey,
    setRegionId,
    handleNavigate,
    handleOpenAddRegionModal,
    handleStatusChange,
    updatingRegions,
  };
};

// ** Add Region **
export const useAddRegion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addRegion, { isLoading }] = useAddRegionMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const result = regionSchema.safeParse({ name: formData.name.trim() });
    if (!result.success) {
      const newErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message])
      );
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      message.error("Please fix the errors in the form");
      return;
    }

    try {
      const payload = { ...formData, name: formData.name.trim() };
      const response = await addRegion({ data: payload }).unwrap();

      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewRegionToList(response.data));
      } else {
        message.error(response?.message || "Failed to create region");
      }
    } catch (error) {
      console.error("Error creating region:", error);
      message.error(
        error?.data?.message || "Failed to create region. Please try again."
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/package-regions");
  };

  const isFormValid = regionSchema.safeParse({
    name: formData.name.trim(),
  }).success;

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
  };
};

// ** Update Region **
export const useUpdateRegion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.region);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    _id: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateRegion, { isLoading }] = useUpdateRegionMutation();

  useEffect(() => {
    if (selectedData) {
      setFormData({
        name: selectedData.name || "",
        status: selectedData.status || "active",
        _id: selectedData._id || "",
      });
    }
  }, [selectedData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const result = regionSchema.safeParse({
      ...formData,
      name: formData.name.trim(),
    });
    if (!result.success) {
      const newErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message])
      );
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      message.error("Please fix the errors in the form");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        status: formData.status,
      };

      const result = await updateRegion({
        id: formData._id,
        data: payload,
      }).unwrap();

      if (result.success) {
        setIsModalVisible(true);
        dispatch(updateRegionInList({ ...result.data, _id: result.data._id }));
      } else {
        message.error(result.message || "Failed to update region");
      }
    } catch (error) {
      console.error("Error updating region:", error);
      if (error.data?.errorMessages) {
        const apiErrors = Object.fromEntries(
          error.data.errorMessages.map((err) => [
            err.path[0] || "name",
            err.message,
          ])
        );
        setErrors(apiErrors);
      }
      message.error(
        error.data?.message || "An error occurred while updating the region"
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/package-regions");
  };

  const isFormValid = regionSchema.safeParse({
    ...formData,
    name: formData.name.trim(),
  }).success;

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
  };
};
