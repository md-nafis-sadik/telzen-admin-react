import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removePackageFromList,
  setPackageMetaData,
  updatePackageInList,
  addNewPackageToList,
  setEditFormData,
  resetEditFormData,
  setAddFormPackageType,
  setAddFormData,
  resetAddFormState,
  setAddFormSelectedPackage,
  setAvailablePackages,
} from "../../features/packages/package/packageSlice";
import {
  useGetAllPackagesQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useAddPackageMutation,
  useLazyGetSinglePackageQuery,
  useSelectPackageForAddMutation,
  useGetAllKeepgoOriginalPackagesQuery,
} from "../../features/packages/package/packageApi";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Tag } from "antd";
import { useGetAllActiveRegionsQuery } from "../../features/packages/packageRegion";
import { useGetAllActiveCountrysQuery } from "../../features/packages/packageCountry";
import {
  AddPackageSchema,
  UpdatePackageSchema,
  validatePackageCoverage,
} from "../../utils/validations/packageSchemas";
import {
  dropdownRenderFn,
  finalPriceFn,
  tagRenderFn,
} from "../../utils/tagsHelper";
import {
  validateWithSchema,
  createFormValidator,
  clearNestedErrors,
  createDiscountToggleHandler,
} from "../../utils/validationHelpers";

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

// ** Package List **
export const useGetPackages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector(
    (state) => state.package
  );
  const { current_page, page_size } = meta || {};
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterKey, setFilterKey] = useState(undefined);
  const [regionFilter, setRegionFilter] = useState(undefined);
  const debouncedSearch = useDebouncedSearch(searchKeyword, 1000);

  const {
    data: regionsData,
    isLoading: isRegionsLoading,
    isFetching: isRegionsFetching,
  } = useGetAllActiveRegionsQuery();
  const isRegionLoading = isRegionsLoading || isRegionsFetching;
  const regions = regionsData?.data || [];

  const isInitialRender = useRef(true);
  const prevSearchRef = useRef(debouncedSearch);
  const [forceRefetchTrigger, setForceRefetchTrigger] = useState(0);
  const apiParams = {
    page: current_page,
    limit: page_size,
    search: debouncedSearch,
    ...(filterKey !== undefined && { status: filterKey || null }),
    ...(regionFilter !== undefined && { region_id: regionFilter || null }),
    forceRefetch: forceRefetchTrigger,
  };
  const { isLoading, isFetching, isError, error } = useGetAllPackagesQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [packageId, setPackageId] = useState(null);
  const updatePageMeta = (value) => dispatch(setPackageMetaData(value));
  const [deletePackage, { isLoading: deleteLoading }] =
    useDeletePackageMutation();
  const [updatingPackages, setUpdatingPackages] = useState({});
  const [updatePackagePackage] = useUpdatePackageMutation();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
  }, [debouncedSearch, filterKey, regionFilter]);

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
    if (!packageId) {
      errorNotify("Package ID is required.");
      return false;
    }

    try {
      const response = await deletePackage({ id: packageId }).unwrap();
      if (response?.success) {
        dispatch(removePackageFromList({ _id: packageId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete package");
      return false;
    }
  };

  const handleNavigate = (item) => {
    navigate(`/package-edit/${item._id}`);
  };

  const handleOpenAddPackageModal = () => {
    navigate("/package-add", {
      state: {
        type: "add",
      },
    });
  };

  const handleStatusChange = async (packageId, newStatus) => {
    const apiStatus = newStatus === "Active" ? "active" : "inactive";

    setUpdatingPackages((prev) => ({ ...prev, [packageId]: true }));

    try {
      const result = await updatePackagePackage({
        id: packageId,
        data: { status: apiStatus },
      }).unwrap();
      dispatch(updatePackageInList({ ...result?.data, _id: result?.data._id }));
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to change status");
    } finally {
      setUpdatingPackages((prev) => {
        const newState = { ...prev };
        delete newState[packageId];
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
    filterKey,
    setFilterKey,
    setPackageId,
    handleNavigate,
    handleOpenAddPackageModal,
    handleStatusChange,
    updatingPackages,
    Option,
    Select,
    regionFilter,
    setRegionFilter,
    regions,
    isRegionLoading,
  };
};

export const useAddPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availablePackages, addFormState, cachedPackages } = useSelector(
    (state) => state.package
  );

  const { packageType, selectedPackageCode, selectedPackageData, formData } =
    addFormState;

  const [addPackage] = useAddPackageMutation();
  const [selectPackageForAdd] = useSelectPackageForAddMutation();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [packageCountries, setPackageCountries] = useState([]);
  const [coverageError, setCoverageError] = useState(null);

  const {
    data: countriesResponse,
    isLoading: isCountrysLoading,
    isFetching: isCountrysFetching,
  } = useGetAllActiveCountrysQuery();

  const {
    data: regionsResponse,
    isLoading: isRegionsLoading,
    isFetching: isRegionsFetching,
  } = useGetAllActiveRegionsQuery();

  const hasPackagesForType = cachedPackages[packageType]?.length > 0;

  const { isLoading: isPackagesLoading } = useGetAllKeepgoOriginalPackagesQuery(
    { coverage_type: packageType },
    {
      skip: !packageType || hasPackagesForType,
    }
  );

  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const isRegionLoading = isRegionsLoading || isRegionsFetching;
  const regions = regionsResponse?.data || [];

  const [sortedCountries, sortedRegions] = useMemo(() => {
    const countriesCopy = countries.length ? [...countries] : [];
    const regionsCopy = regions?.length ? [...regions] : [];

    return [
      countriesCopy.sort((a, b) => {
        const aSelected = formData.coverage_countries.includes(a._id);
        const bSelected = formData.coverage_countries.includes(b._id);
        return bSelected - aSelected;
      }),
      regionsCopy.sort((a, b) => {
        const aSelected = formData.coverage_regions.includes(a._id);
        const bSelected = formData.coverage_regions.includes(b._id);
        return bSelected - aSelected;
      }),
    ];
  }, [
    countries,
    regions,
    formData.coverage_countries,
    formData.coverage_regions,
  ]);

  const finalPrice = finalPriceFn({ formData });

  const availablePackageOptions = useMemo(() => {
    if (packageType && availablePackages.length > 0) {
      const firstPackage = availablePackages[0];
      if (firstPackage && firstPackage.coverage_type !== packageType) {
        const correctPackages = cachedPackages[packageType] || [];
        if (correctPackages.length > 0) {
          setTimeout(() => {
            dispatch(setAvailablePackages(correctPackages));
          }, 0);
          return correctPackages.map((pkg) => ({
            value: pkg.package_code,
            label: `${pkg.name} (${pkg.data_plan_in_mb}MB - ${pkg.validity.amount} days)`,
            data: pkg,
          }));
        }
        return [];
      }
    }

    const options = availablePackages.map((pkg) => ({
      value: pkg.package_code,
      label: `${pkg.name} (${pkg.data_plan_in_mb}MB - ${pkg.validity.amount} days)`,
      data: pkg,
    }));

    if (selectedPackageCode && availablePackages.length > 0) {
      const isSelectedPackageValid = availablePackages.some(
        (pkg) => pkg.package_code === selectedPackageCode
      );
      if (!isSelectedPackageValid) {
        setTimeout(() => {
          dispatch(
            setAddFormSelectedPackage({ packageCode: null, packageData: null })
          );
        }, 0);
      }
    }

    return options;
  }, [
    availablePackages,
    selectedPackageCode,
    packageType,
    cachedPackages,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetAddFormState());
    };
  }, [dispatch]);

  const handlePackageTypeChange = useCallback(
    (newPackageType) => {
      dispatch(setAddFormPackageType(newPackageType));
    },
    [dispatch]
  );

  const handlePackageSelection = useCallback(
    (packageCode) => {
      if (!packageCode) {
        selectPackageForAdd({ packageCode: null, availablePackages });
        setPackageCountries([]);
        return;
      }

      selectPackageForAdd({ packageCode, availablePackages });

      const packageData = availablePackages.find(
        (pkg) => pkg.package_code === packageCode
      );
      if (packageData?.country_code) {
        const countryCodes = packageData.country_code
          .split(",")
          .map((code) => code.trim());
        setPackageCountries(countryCodes);
      }
    },
    [selectPackageForAdd, availablePackages]
  );

  const handleCountrySelection = useCallback(
    (selectedCountryIds) => {
      const previousCountries = formData.coverage_countries || [];
      const newlySelected = selectedCountryIds.filter(
        (id) => !previousCountries.includes(id)
      );
      const newCountryRegions = newlySelected
        .map((countryId) => {
          const country = countries.find((c) => c._id === countryId);
          return country?.region?._id;
        })
        .filter((regionId) => regionId);
      const allRegions = [
        ...new Set([...formData.coverage_regions, ...newCountryRegions]),
      ];

      const updatedFormData = {
        ...formData,
        coverage_countries: selectedCountryIds,
        coverage_regions: allRegions,
      };

      dispatch(setAddFormData(updatedFormData));
    },
    [countries, formData, dispatch]
  );

  const handleChange = useCallback(
    (name, value) => {
      if (name === "coverage_countries") {
        handleCountrySelection(value);
      } else if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const updatedFormData = {
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        };
        dispatch(setAddFormData(updatedFormData));
      } else {
        const updatedFormData = {
          ...formData,
          [name]: value,
        };
        dispatch(setAddFormData(updatedFormData));
      }

      clearNestedErrors(name, setErrors);

      if (name === "coverage_countries" || name === "coverage_regions") {
        setCoverageError(null);
      }
    },
    [handleCountrySelection, formData, dispatch]
  );

  const handleDiscountTypeToggle = useCallback(
    createDiscountToggleHandler(formData, (data) =>
      dispatch(setAddFormData(data))
    ),
    [formData, dispatch]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validatedData = validateWithSchema(
      AddPackageSchema,
      formData,
      setErrors
    );
    if (!validatedData) return;

    const coverageValidation = validatePackageCoverage(validatedData);
    if (!coverageValidation.isValid) {
      setErrors({ [coverageValidation.field]: coverageValidation.error });
      return;
    }

    setIsSubmitting(true);

    try {
      let submitData = {
        ...validatedData,
        vat_on_selling_price: {
          amount: 0,
          is_type_percentage: true,
        },
      };

      if (formData.coverage_type === "regional") {
        const { coverage_countries, ...rest } = submitData;
        submitData = rest;
      }

      const response = await addPackage({ data: submitData }).unwrap();
      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewPackageToList(response.data));
      }
    } catch (error) {
      console.error("Error creating package:", error);
      errorNotify(error.data?.message || "Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = useCallback(() => {
    setIsModalVisible(false);
    navigate("/packages");
  }, [navigate]);

  const tagRender = tagRenderFn({ countries });
  const dropdownRender = dropdownRenderFn({
    formData,
    countries,
    handleChange,
  });

  const isFormValid = useMemo(() => {
    const basicValidation = createFormValidator(
      AddPackageSchema,
      formData,
      selectedPackageCode
    );
    if (!basicValidation) return false;

    const coverageValidation = validatePackageCoverage(formData);
    return coverageValidation.isValid;
  }, [formData, selectedPackageCode]);

  return {
    isModalVisible,
    isCountryLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    errors,
    formData,
    navigate,
    isSubmitting,
    sortedCountries,
    packageType,
    setPackageType: handlePackageTypeChange,
    selectedPackage: selectedPackageCode,
    setSelectedPackage: handlePackageSelection,
    isLoading: isPackagesLoading && !hasPackagesForType,
    packageCountries,
    availablePackageOptions,
    selectedPackageData,
    setSelectedPackageData: handlePackageSelection,
    availablePackages,
    isRegionLoading,
    sortedRegions,
    finalPrice,
    coverageError,
    handleDiscountTypeToggle,
    tagRender,
    dropdownRender,
    isFormValid,
  };
};

export const useUpdatePackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedData, editFormData } = useSelector((state) => state.package);

  const [
    getSinglePackage,
    { isLoading: isSinglePackageLoading, isError: isSinglePackageError },
  ] = useLazyGetSinglePackageQuery();

  const formData = editFormData;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [updatePackageMutation] = useUpdatePackageMutation();

  const {
    data: countriesResponse,
    isLoading: isCountrysLoading,
    isFetching: isCountrysFetching,
  } = useGetAllActiveCountrysQuery();

  const {
    data: regionsResponse,
    isLoading: isRegionsLoading,
    isFetching: isRegionsFetching,
  } = useGetAllActiveRegionsQuery();

  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const isRegionLoading = isRegionsLoading || isRegionsFetching;
  const regions = regionsResponse?.data || [];

  const finalPrice = finalPriceFn({ formData });

  const sortedCountries = useMemo(() => {
    if (!countries.length) return [];
    const countriesCopy = [...countries];
    return countriesCopy.sort((a, b) => {
      const aSelected = formData.coverage_countries.includes(a._id);
      const bSelected = formData.coverage_countries.includes(b._id);
      return bSelected - aSelected;
    });
  }, [countries, formData.coverage_countries]);

  const sortedRegions = useMemo(() => {
    if (!regions || !Array.isArray(regions)) return [];
    if (
      !formData.coverage_regions ||
      !Array.isArray(formData.coverage_regions)
    ) {
      return [...regions];
    }
    return [...regions].sort((a, b) => {
      const aSelected = formData.coverage_regions.includes(a._id);
      const bSelected = formData.coverage_regions.includes(b._id);
      return bSelected - aSelected;
    });
  }, [regions, formData.coverage_regions]);

  const handleCountrySelection = useCallback(
    (selectedCountryIds) => {
      const previousCountries = formData.coverage_countries || [];
      const newlySelected = selectedCountryIds.filter(
        (id) => !previousCountries.includes(id)
      );
      const newCountryRegions = newlySelected
        .map((countryId) => {
          const country = countries.find((c) => c._id === countryId);
          return country?.region?._id;
        })
        .filter((regionId) => regionId);
      const allRegions = [
        ...new Set([...formData.coverage_regions, ...newCountryRegions]),
      ];

      const updatedFormData = {
        ...formData,
        coverage_countries: selectedCountryIds,
        coverage_regions: allRegions,
      };
      dispatch(setEditFormData(updatedFormData));
    },
    [countries, formData, dispatch]
  );

  useEffect(() => {
    if (id) {
      dispatch(resetEditFormData());
      getSinglePackage({ package_id: id }, false);
    }

    return () => {
      dispatch(resetEditFormData());
    };
  }, [dispatch, id, getSinglePackage]);

  const handleChange = useCallback(
    (name, value) => {
      if (name === "coverage_countries") {
        handleCountrySelection(value);
      } else if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const updatedFormData = {
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        };
        dispatch(setEditFormData(updatedFormData));
      } else {
        const updatedFormData = {
          ...formData,
          [name]: value,
        };
        dispatch(setEditFormData(updatedFormData));
      }

      clearNestedErrors(name, setErrors);
    },
    [errors, handleCountrySelection, formData, dispatch]
  );

  const handleDiscountTypeToggle = useCallback(
    createDiscountToggleHandler(formData, (data) =>
      dispatch(setEditFormData(data))
    ),
    [formData, dispatch]
  );

  const isFormValid = useMemo(() => {
    const basicValidation = createFormValidator(
      UpdatePackageSchema,
      formData,
      formData.id
    );
    if (!basicValidation) return false;

    const coverageValidation = validatePackageCoverage(formData);
    return coverageValidation.isValid;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validatedData = validateWithSchema(
      UpdatePackageSchema,
      formData,
      setErrors
    );
    if (!validatedData) return;

    const coverageValidation = validatePackageCoverage(validatedData);
    if (!coverageValidation.isValid) {
      setErrors({ [coverageValidation.field]: coverageValidation.error });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalData = validatedData;

      if (selectedData.coverage_type === "regional") {
        const { coverage_countries, ...rest } = finalData;
        finalData = rest;
      }

      const response = await updatePackageMutation({
        id: formData.id,
        data: {
          ...finalData,
          vat_on_selling_price: {
            amount: 0,
            is_type_percentage: true,
          },
        },
      }).unwrap();

      if (response.success) {
        setIsModalVisible(true);
        dispatch(
          updatePackageInList({
            ...response?.data,
            _id: response?.data._id,
          })
        );
      } else {
        errorNotify(response.message || "Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else if (error.data?.errorMessages) {
        const apiErrors = {};
        error.data.errorMessages.forEach((err) => {
          const path = err.path.split(".")[0];
          apiErrors[path] = err.message;
        });
        setErrors(apiErrors);
      }
      errorNotify(error.data?.message || "Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = useCallback(() => {
    setIsModalVisible(false);
    navigate("/packages");
  }, [navigate]);

  const tagRender = tagRenderFn({ countries });
  const dropdownRender = dropdownRenderFn({
    formData,
    countries,
    handleChange,
  });

  return {
    isModalVisible,
    isCountryLoading: isCountryLoading || isSinglePackageLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    isSubmitting,
    sortedCountries,
    tagRender,
    dropdownRender,
    selectedData,
    isRegionLoading,
    sortedRegions,
    finalPrice,
    handleDiscountTypeToggle,
    isSinglePackageLoading,
    isSinglePackageError,
  };
};
