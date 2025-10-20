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
        formData: { status: apiStatus },
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
  const [formData, setFormData] = useState({ name: "", file: null });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addRegion, { isLoading }] = useAddRegionMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [typeError, setTypeError] = useState(false);

  const handleChange = (name, value) => {
    if (name === "file") {
      const file = value;
      if (file) {
        setFormData((prev) => ({ ...prev, file }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, file: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const fileInputRef = useRef(null);

  const handleFileDelete = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview(null);
    setTypeError(false);
    setErrors((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        JSON.stringify({
          name: formData.name,
        })
      );

      if (formData.file) {
        formDataToSend.append("single", formData.file);
      }
      const response = await addRegion(formDataToSend).unwrap();

      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewRegionToList(response.data));
      } else {
        console.error(response?.message || "Failed to create region");
      }
    } catch (error) {
      console.error("Error creating region:", error);
      errorNotify(
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
    imagePreview,
    fileInputRef,
    typeError,
    handleFileDelete,
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
    file: null,
    _id: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateRegion, { isLoading }] = useUpdateRegionMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [typeError, setTypeError] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setFormData({
        name: selectedData.name || "",
        status: selectedData.status || "active",
        _id: selectedData._id || "",
        file: {
          name: selectedData.image ? selectedData.image.split("/").pop() : "",
          value: selectedData.image || "",
        },
      });
      setImagePreview(selectedData.image);
    }
  }, [selectedData]);

  const handleChange = (name, value) => {
    if (name === "file") {
      const file = value;
      if (file) {
        setFormData((prev) => ({ ...prev, file }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, file: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const fileInputRef = useRef(null);

  const handleFileDelete = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview(null);
    setTypeError(false);
    setErrors((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        JSON.stringify({
          name: formData.name,
        })
      );

      if (formData.file) {
        formDataToSend.append("single", formData.file);
      }

      const result = await updateRegion({
        id: formData._id,
        formData: formDataToSend,
      }).unwrap();

      if (result.success) {
        setIsModalVisible(true);
        dispatch(updateRegionInList({ ...result.data, _id: result.data._id }));
      } else {
        console.error(result.message || "Failed to update region");
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
      errorNotify(
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
    imagePreview,
    fileInputRef,
    typeError,
    handleFileDelete,
  };
};
