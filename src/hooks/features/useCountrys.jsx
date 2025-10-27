import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removeCountryFromList,
  setSelectedCountryData,
  setCountryMetaData,
  updateCountryInList,
  addNewCountryToList,
  setEditFormData,
  resetEditFormData,
} from "../../features/packages/packageCountry/countrySlice";
import {
  useGetAllCountrysQuery,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
  useAddCountryMutation,
  useGetAllApiCountrysQuery,
  useLazyGetSingleCountryQuery,
} from "../../features/packages/packageCountry/countryApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllActiveRegionsQuery } from "../../features/packages/packageRegion";
import {
  AddCountrySchema,
  transformFormDataToAPI,
  UpdateCountrySchema,
} from "../../utils/validations/countrySchemas";
import { CloseSvg } from "../../utils/svgs";

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

// ** Country List **
export const useGetCountries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector(
    (state) => state.country
  );
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

  const { isLoading, isFetching, isError, error } = useGetAllCountrysQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "" &&
        filterKey === undefined,
    }
  );

  const [countryId, setCountryId] = useState(null);
  const [updatingCountrys, setUpdatingCountrys] = useState({});
  const [updatePackageCountry] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: deleteLoading }] =
    useDeleteCountryMutation();
  const { data: regionsResponse, isLoading: isRegionsLoading } =
    useGetAllActiveRegionsQuery();
  const regions = regionsResponse?.data || [];

  const updatePageMeta = (value) => dispatch(setCountryMetaData(value));
  const handleSetSelectedCountry = (data) =>
    dispatch(setSelectedCountryData(data));

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
    // dispatch(setCountryMetaData({ ...meta, current_page: 1 }));
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
    if (!countryId) {
      errorNotify("Country ID is required.");
      return false;
    }
    try {
      const response = await deleteCountry({ id: countryId }).unwrap();
      if (response?.success) {
        dispatch(removeCountryFromList({ _id: countryId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete country");
      return false;
    }
  };

  const handleNavigate = (item) => {
    navigate(`/package-country-edit/${item._id}`);
  };

  const handleOpenAddCountryModal = () => {
    navigate("/package-country-add", { state: { type: "add" } });
  };

  const handleStatusChange = async (countryId, newStatus) => {
    const apiStatus = newStatus === "Active" ? "active" : "inactive";

    setUpdatingCountrys((prev) => ({ ...prev, [countryId]: true }));

    try {
      const result = await updatePackageCountry({
        id: countryId,
        formData: { status: apiStatus },
      });

      let updatedCountry = { ...result?.data?.data };

      if (!updatedCountry) throw new Error("No country data returned");

      if (updatedCountry.region && typeof updatedCountry.region === "string") {
        const matchedRegion = regions.find(
          (r) => r._id === updatedCountry.region
        );
        if (matchedRegion) {
          updatedCountry = { ...updatedCountry, region: matchedRegion };
        }
      }

      dispatch(updateCountryInList(updatedCountry));
    } catch (error) {
      console.error("Error updating country:", error);
      errorNotify(
        error?.data?.message ||
          error.message ||
          "Failed to update country status"
      );
    } finally {
      setUpdatingCountrys((prev) => {
        const newState = { ...prev };
        delete newState[countryId];
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
    handleSetSelectedCountry,
    filterKey,
    setFilterKey,
    setCountryId,
    handleNavigate,
    handleOpenAddCountryModal,
    handleStatusChange,
    updatingCountrys,
  };
};

// ** Add Country **
export const useAddCountry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: null,
    region: null,
    is_popular: false,
    file: null,
    cover_image: null,
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [typeError, setTypeError] = useState(false);
  const [addCountry, { isLoading: isSubmitting }] = useAddCountryMutation();

  const { data: regionsResponse, isLoading: isRegionsLoading } =
    useGetAllActiveRegionsQuery();
  const regions = regionsResponse?.data || [];

  const { data: countriesResponse, isLoading: isCountriesLoading } =
    useGetAllApiCountrysQuery();
  const countries = countriesResponse?.data || [];

  const imageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const handleFileDelete = (name) => {
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
      setTypeError(false);
      setErrors((prev) => ({ ...prev, image: null }));
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else if (name === "cover_image") {
      setFormData((prev) => ({ ...prev, cover_image: null }));
      setCoverImagePreview(null);
      setTypeError(false);
      setErrors((prev) => ({ ...prev, cover_image: null }));
      if (coverImageInputRef.current) coverImageInputRef.current.value = "";
    }
  };

  const handleChange = (name, value) => {
    let processedValue = value;

    if (name === "image") {
      const file = value;
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: null }));
      }
    } else if (name === "cover_image") {
      const file = value;
      if (file) {
        setFormData((prev) => ({ ...prev, cover_image: file }));
        setCoverImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, cover_image: null }));
      }
    }

    if (name === "country" || name === "code") {
      processedValue = value && typeof value === "object" ? value.code : value;
      name = "code";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const result = AddCountrySchema.safeParse(formData);

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
    if (!validateForm())
      return errorNotify("Please fix the errors in the form");

    try {
      const payload = transformFormDataToAPI(formData, countries);

      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        JSON.stringify({
          ...payload,
        })
      );

      if (formData.image) {
        formDataToSend.append("single", formData.image);
      }
      if (formData.cover_image) {
        formDataToSend.append("cover_single", formData.cover_image);
      }

      const response = await addCountry(formDataToSend).unwrap();
      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewCountryToList(response.data));
      } else {
        errorNotify(response?.message || "Failed to add country");
      }
    } catch (error) {
      console.error("Error creating country:", error);
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
        error.data?.message || "Failed to create country. Please try again."
      );
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/package-countries");
  };

  const isFormValid = AddCountrySchema.safeParse(formData).success;

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleModalOk,
    isModalVisible,
    isFormValid,
    navigate,
    regions,
    countries,
    isRegionsLoading,
    isCountriesLoading,
    isSubmitting,
    imagePreview,
    coverImagePreview,
    imageInputRef,
    coverImageInputRef,
    typeError,
    handleFileDelete,
  };
};

// ** Update Country **
export const useUpdateCountry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedData, editFormData } = useSelector((state) => state.country);

  const [
    getSingleCountry,
    { isLoading: isSingleCountryLoading, isError: isSingleCountryError },
  ] = useLazyGetSingleCountryQuery();

  const formData = editFormData;
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [typeError, setTypeError] = useState(false);
  const [updateCountry] = useUpdateCountryMutation();

  const { data: regionsResponse, isLoading: isRegionsLoading } =
    useGetAllActiveRegionsQuery();
  const regions = regionsResponse?.data || [];

  const { data: countriesResponse, isLoading: isCountriesLoading } =
    useGetAllApiCountrysQuery();
  const countries = countriesResponse?.data || [];

  const imageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(resetEditFormData());
      getSingleCountry({ country_id: id });
    }
  }, [dispatch, id, getSingleCountry]);

  useEffect(() => {
    if (formData.image) {
      if (formData.image instanceof File) {
        setImagePreview(URL.createObjectURL(formData.image));
      } else if (typeof formData.image === "string") {
        setImagePreview(formData.image);
      }
    } else {
      setImagePreview(null);
    }

    if (formData.cover_image) {
      if (formData.cover_image instanceof File) {
        setCoverImagePreview(URL.createObjectURL(formData.cover_image));
      } else if (typeof formData.cover_image === "string") {
        setCoverImagePreview(formData.cover_image);
      }
    } else {
      setCoverImagePreview(null);
    }
  }, [formData.image, formData.cover_image]);

  const handleFileDelete = (name) => {
    if (name === "image") {
      dispatch(setEditFormData({ ...formData, image: null }));
      setImagePreview(null);
      setTypeError(false);
      setErrors((prev) => ({ ...prev, image: null }));
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else if (name === "cover_image") {
      dispatch(setEditFormData({ ...formData, cover_image: null }));
      setCoverImagePreview(null);
      setTypeError(false);
      setErrors((prev) => ({ ...prev, cover_image: null }));
      if (coverImageInputRef.current) coverImageInputRef.current.value = "";
    }
  };

  const handleChange = (name, value) => {
    let processedValue = value;

    if (name === "image") {
      const file = value;
      if (file) {
        dispatch(setEditFormData({ ...formData, image: file }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: null }));
      }
      return;
    } else if (name === "cover_image") {
      const file = value;
      if (file) {
        dispatch(setEditFormData({ ...formData, cover_image: file }));
        setCoverImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, cover_image: null }));
      }
      return;
    }

    if (name === "country" || name === "code") {
      processedValue = value && typeof value === "object" ? value.code : value;
      name = "code";
    }

    dispatch(setEditFormData({ ...formData, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const result = UpdateCountrySchema.safeParse(formData);

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
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = transformFormDataToAPI(formData, countries);

      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        JSON.stringify({
          ...payload,
        })
      );

      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("single", formData.image);
      }
      if (formData.cover_image && typeof formData.cover_image !== "string") {
        formDataToSend.append("cover_single", formData.cover_image);
      }

      const response = await updateCountry({
        id: formData.id,
        formData: formDataToSend,
      }).unwrap();

      if (response?.success) {
        let updatedCountry = { ...response.data };

        if (updatedCountry.region) {
          const matchedRegion = regions.find(
            (r) => r._id === updatedCountry.region
          );

          if (matchedRegion) {
            updatedCountry.region = matchedRegion;
          }
        }

        dispatch(updateCountryInList(updatedCountry));
        setIsModalVisible(true);
      } else {
        errorNotify(response?.message || "Failed to update country");
      }
    } catch (error) {
      console.error("Error updating country:", error);
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
        error.data?.message || "Failed to update country. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/package-countries");
  };

  const isFormValid = useMemo(() => {
    if (!formData.id) return false;
    return UpdateCountrySchema.safeParse(formData).success;
  }, [formData]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleModalOk,
    isModalVisible,
    isFormValid,
    navigate,
    regions,
    countries,
    isRegionsLoading,
    isCountriesLoading,
    isSubmitting,
    imagePreview,
    coverImagePreview,
    imageInputRef,
    coverImageInputRef,
    typeError,
    handleFileDelete,
    selectedData,
    isSingleCountryLoading,
    isSingleCountryError,
  };
};
