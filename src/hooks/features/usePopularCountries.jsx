import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  setSelectedPopularCountryData,
  setPopularCountryMetaData,
  updatePopularCountryInList,
  addNewPopularCountryToList,
  reorderCountries,
  setSelectedFeatureCountries,
  removeCountryFromFeatureList,
} from "../../features/packages/popularCountry/popularCountrySlice";
import {
  useGetAllPopularCountrysQuery,
  useDeletePopularCountryMutation,
  useUpdatePopularCountryMutation,
  useGetAllApiPopularCountrysQuery,
  useAddPopularCountriesMutation,
} from "../../features/packages/popularCountry/popularCountryApi";
import { useNavigate } from "react-router-dom";
import { Select, Tag } from "antd";
import ReactCountryFlag from "react-country-flag";
import { AddPopularCountrySchema } from "../../utils/validations/popularCountrySchemas";

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

// ** PopularCountry List **
export const useGetPopularCountrys = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList } = useSelector((state) => state.popularCountry);
  const [countryId, setCountryId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const meta = useSelector((state) => state.popularCountry.meta);
  const selectedData = useSelector(
    (state) => state.popularCountry.selectedData
  );
  const selectedFeatureCountries = useSelector(
    (state) => state.popularCountry.selectedFeatureCountries
  );
  
  const hasInitialData = dataList && dataList.length > 0;
  const { current_page, page_size } = meta || {};
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebouncedSearch(searchKeyword, 1000);
  const isInitialRender = useRef(true);
  const [shouldFetch, setShouldFetch] = useState(!hasInitialData); // Only fetch if we don't have initial data
  
  const apiParams = {
    page: current_page,
    limit: page_size,
    search: debouncedSearch,
  };
  
  const shouldSkipQuery = !shouldFetch && dataList.length > 0;
  
  const { isLoading, isFetching, isError, error } =
    useGetAllPopularCountrysQuery(apiParams, {
      refetchOnMountOrArgChange: false, 
      refetchOnFocus: false,
      skip: shouldSkipQuery,
    });
  const [deletePopularCountry, { isLoading: deleteLoading }] =
    useDeletePopularCountryMutation();
  const [updatePopularCountry] = useUpdatePopularCountryMutation();
  const [popularCountryId, setPopularCountryId] = useState(null);
  const [deleteCountryId, setDeleteCountryId] = useState(null);
  const popularCountryData = useSelector((state) => state.popularCountry.data);
  
  const updatePageMeta = (value) => {
    const newPage = value.current_page;
    const pageKey = `page${newPage}`;
    const pageExists = popularCountryData && popularCountryData[pageKey] && popularCountryData[pageKey].length > 0;
    
    if (!pageExists) {
      setShouldFetch(true);
    }
    
    dispatch(setPopularCountryMetaData(value));
  };
  const handleSetSelectedPopularCountry = (data) =>
    dispatch(setSelectedPopularCountryData(data));

  const [updatingPopularCountrys, setUpdatingPopularCountrys] = useState({});

  const handleDelete = async () => {
    if (!popularCountryId || !deleteCountryId) {
      errorNotify(err?.data?.message || "Failed to delete country");
      return false;
    }

    try {
      const response = await deletePopularCountry({
        popular_country_id: popularCountryId,
        country_id: deleteCountryId,
      }).unwrap();

      if (response?.success) {
        dispatch(
          removeCountryFromFeatureList({
            popularCountryId,
            countryId: deleteCountryId,
          })
        );
        successNotify(response?.message);
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete country");
    }
  };

  const handleNavigate = (item) => {
    dispatch(setSelectedPopularCountryData(item));
    navigate("/popular-country-edit");
  };

  const handleSaveOrder = async (popularCountryId, featureCountryIds) => {
    try {
      const response = await updatePopularCountry({
        id: popularCountryId,
        data: { feature_countries: featureCountryIds },
      }).unwrap();

      if (response?.success) {
        successNotify(response?.message);
        const updatedDataList = dataList.map((country) => {
          if (country._id === popularCountryId) {
            return {
              ...country,
              feature_countries: featureCountryIds
                .map((id) =>
                  country.feature_countries.find((fc) => fc._id === id)
                )
                .filter(Boolean),
            };
          }
          return country;
        });
        dispatch(
          reorderCountries({
            popularCountryId,
            orderedCountries: featureCountryIds
              .map((id) =>
                updatedDataList
                  .find((c) => c._id === popularCountryId)
                  ?.feature_countries.find((fc) => fc._id === id)
              )
              .filter(Boolean),
          })
        );
        return true;
      }
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to update order");
      return false;
    }
  };
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setShouldFetch(true);
    dispatch(setPopularCountryMetaData({ ...meta, current_page: 1 }));
  }, [debouncedSearch]);
  
  useEffect(() => {
    if (!isLoading && !isFetching && dataList.length > 0) {
      setShouldFetch(false);
    }
  }, [isLoading, isFetching, dataList.length]);

  const { Option } = Select;

  const handleNavigateSub = (country) => {
    dispatch(setSelectedPopularCountryData(country));
    dispatch(setSelectedFeatureCountries(country.feature_countries || []));
    navigate("/popular-country");
  };

  const handleOpenAddPopularCountryModal = () => {
    navigate("/popular-country-add", {
      state: {
        type: "add",
      },
    });
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
    handleSetSelectedPopularCountry,
    setPopularCountryId,
    handleNavigate,
    handleOpenAddPopularCountryModal,
    updatingPopularCountrys,
    Option,
    Select,
    handleNavigateSub,
    selectedFeatureCountries,
    navigate,
    handleSaveOrder,
    hasChanges,
    setCountryId,
    setDeleteCountryId,
    setShouldFetch, 
  };
};

export const useAddPopularCountry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country_id: null,
    feature_countries: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addPopularCountries] = useAddPopularCountriesMutation();

  // Fetch countries
  const {
    data: countriesResponse,
    isLoading: isCountriesLoading,
    isFetching: isCountriesFetching,
  } = useGetAllApiPopularCountrysQuery();
  const isCountryLoading = isCountriesLoading || isCountriesFetching;

  useEffect(() => {
    const result = AddPopularCountrySchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }
  }, [formData]);

  const countries = countriesResponse?.data || [];

  const sortedCountries = useMemo(() => {
    return countries.length > 0
      ? [...countries].sort((a, b) => {
          const aSelected = formData.feature_countries.includes(a._id);
          const bSelected = formData.feature_countries.includes(b._id);
          return bSelected - aSelected;
        })
      : [];
  }, [countries, formData.feature_countries]);

  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );
  const handleFeatureCountriesChange = useCallback(
    (value) => {
      handleChange("feature_countries", value);
    },
    [handleChange]
  );

  const validateForm = () => {
    const result = AddPopularCountrySchema.safeParse({
      country_id: formData.country_id,
      feature_countries: formData.feature_countries,
    });

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const isFormValid = AddPopularCountrySchema.safeParse(formData).success;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addPopularCountries({
        country_id: formData.country_id,
        feature_countries: formData.feature_countries,
      }).unwrap();

      if (response.success) {
        setIsModalVisible(true);
        dispatch(addNewPopularCountryToList(response.data));
      } else {
        errorNotify(response.message || "Failed to add popular countries");
      }
    } catch (error) {
      console.error("Error adding popular countries:", error);
      const errorMessage =
        error.data?.message ||
        "Failed to add popular countries. Please try again.";
      errorNotify(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/popular-country");
  };

  return {
    isModalVisible,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    countries,
    isCountryLoading,
    isSubmitting,
    sortedCountries,
    handleFeatureCountriesChange,
  };
};

export const useUpdatePopularCountry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.popularCountry);
  const [formData, setFormData] = useState({
    country_id: selectedData?._id || null,
    feature_countries: selectedData?.feature_countries || [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePopularCountries] = useUpdatePopularCountryMutation();

  // Fetch countries
  const {
    data: countriesResponse,
    isLoading: isCountriesLoading,
    isFetching: isCountriesFetching,
  } = useGetAllApiPopularCountrysQuery();
  const isCountryLoading = isCountriesLoading || isCountriesFetching;

  useEffect(() => {
    const result = AddPopularCountrySchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }
  }, [formData]);

  const countries = countriesResponse?.data || [];

  useEffect(() => {
    if (selectedData) {
      setFormData({
        country_id: selectedData._id,
        feature_countries:
          selectedData.feature_countries?.map((country) =>
            typeof country === "object" ? country._id : country
          ) || [],
      });
    }
  }, [selectedData]);

  const sortedCountries = useMemo(() => {
    return countries.length > 0
      ? [...countries].sort((a, b) => {
          const aSelected = formData.feature_countries.includes(a._id);
          const bSelected = formData.feature_countries.includes(b._id);
          return bSelected - aSelected;
        })
      : [];
  }, [countries, formData.feature_countries]);

  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  const handleFeatureCountriesChange = useCallback(
    (value) => {
      handleChange("feature_countries", value);
    },
    [handleChange]
  );

  const validateForm = () => {
    const result = AddPopularCountrySchema.safeParse({
      country_id: formData.country_id,
      feature_countries: formData.feature_countries,
    });

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.country_id &&
    formData.feature_countries.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updatePopularCountries({
        id: selectedData._id,
        data: {
          country_id: formData.country_id._id,
          feature_countries: formData.feature_countries,
        },
      }).unwrap();

      if (response.success) {
        setIsModalVisible(true);
        dispatch(updatePopularCountryInList(response.data));
      } else {
        errorNotify(response.message || "Failed to update popular countries");
      }
    } catch (error) {
      console.error("Error updating popular countries:", error);
      const errorMessage =
        error.data?.message ||
        "Failed to update popular countries. Please try again.";
      errorNotify(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/popular-country");
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          margin: 0,
          padding: "0 6px",
        }}
      >
        <ReactCountryFlag
          countryCode={label} 
          svg
          style={{ width: "16px", height: "12px" }}
        />
        <span>{label}</span>
      </Tag>
    );
  };

  const dropdownRender = (menu) => (
    <>
      {/* Selected countries section */}
      {formData.feature_countries.length > 0 && (
        <div className="p-2 border-b border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 mb-1">
            Selected Countries
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.feature_countries.map((countryId) => {
              const country = countries.find((c) => c._id === countryId);
              if (!country) return null;
              return (
                <Tag
                  key={country._id}
                  closable
                  onClose={(e) => {
                    e.stopPropagation();
                    handleChange(
                      "feature_countries",
                      formData.feature_countries.filter(
                        (id) => id !== country._id
                      )
                    );
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    margin: 0,
                    padding: "0 6px",
                  }}
                >
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{ width: "16px", height: "12px" }}
                  />
                  <span>{country.name}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      )}
      {/* Regular dropdown menu */}
      {menu}
    </>
  );

  return {
    isModalVisible,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    countries,
    isCountryLoading,
    isSubmitting,
    tagRender,
    dropdownRender,
    sortedCountries,
    handleFeatureCountriesChange,
    selectedData,
  };
};
