import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removePackageFromList,
  setSelectedPackageData,
  setPackageMetaData,
  updatePackageInList,
  addNewPackageToList,
} from "../../features/packages/package/packageSlice";
import {
  useGetAllPackagesQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useAddPackageMutation,
  useLazyGetAllKeepgoOriginalPackagesQuery,
} from "../../features/packages/package/packageApi";
import { useNavigate } from "react-router-dom";
import { Select, Tag } from "antd";
import { useGetAllActiveRegionsQuery } from "../../features/packages/packageRegion";
import { useGetAllActiveCountrysQuery } from "../../features/packages/packageCountry";
import ReactCountryFlag from "react-country-flag";
import {
  AddPackageSchema,
  UpdatePackageSchema,
} from "../../utils/validations/packageSchemas";

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
  // Add region data fetching
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
    ...(regionFilter !== undefined && { region: regionFilter || null }),
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
  const handleSetSelectedPackage = (data) =>
    dispatch(setSelectedPackageData(data));
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
    // dispatch(setPackageMetaData({ ...meta, current_page: 1 }));
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

  // handle delete package
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
    dispatch(setSelectedPackageData(item));
    navigate("/package-edit");
  };

  const handleOpenAddPackageModal = () => {
    navigate("/package-add", {
      state: {
        type: "add",
      },
    });
  };

  // Remove updating status
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
    selectedData,
    handleSetSelectedPackage,
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

  // Initial form state
  const initialFormState = useMemo(
    () => ({
      name: "",
      type: "data",
      data_plan_in_mb: "",
      bonus_data_plan_in_mb: 0,
      validity: { amount: "", type: "day" },
      status: "active",
      coverage_countries: [],
      coverage_regions: [],
      original_price: { USD: "" },
      price: { USD: "", EUR: "" },
      vat: { amount: "" },
      is_auto_renew_available: false,
      discount: { amount: "" },
      vendor_type: "keep-go",
      note: "",
      keep_go_bundle_id: "",
      keep_go_bundle_type: "country",
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addPackage] = useAddPackageMutation();
  const [packageType, setPackageType] = useState("country");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [packageCountries, setPackageCountries] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  const [coverageError, setCoverageError] = useState(null);

  // API queries
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

  const [fetchPackages] = useLazyGetAllKeepgoOriginalPackagesQuery();

  // Derived state
  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const isRegionLoading = isRegionsLoading || isRegionsFetching;
  const regions = regionsResponse?.data || [];

  // Memoized sorted countries and regions
  // Combine related memoized values
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

  // Final price calculation
  const finalPrice = useMemo(() => {
    const baseEUR = parseFloat(formData.price.EUR || 0);
    const baseUSD = parseFloat(formData.price.USD || 0);
    const vat = parseFloat(formData.vat.amount || 0);
    const discount = parseFloat(formData.discount.amount || 0);

    const priceAfterDiscountUSD = baseUSD - (baseUSD * discount) / 100;
    const finalUSD =
      priceAfterDiscountUSD + (priceAfterDiscountUSD * vat) / 100;

    const priceAfterDiscountEUR = baseEUR - (baseEUR * discount) / 100;
    const finalEUR =
      priceAfterDiscountEUR + (priceAfterDiscountEUR * vat) / 100;

    return {
      finalUSD: finalUSD.toFixed(2),
      finalEUR: finalEUR.toFixed(2),
    };
  }, [
    formData.price.EUR,
    formData.price.USD,
    formData.vat.amount,
    formData.discount.amount,
  ]);

  // Available refills derived from selected package
  const availableRefills = useMemo(() => {
    if (!selectedPackageData) return [];

    return selectedPackageData.refills.map((refill) => ({
      value: refill.title,
      label: `${refill.title} (${refill.price_usd} USD) ${
        refill.amount_days ? "" : "Unlimited"
      }`,
    }));
  }, [selectedPackageData]);

  // Available package options
  const availablePackageOptions = useMemo(() => {
    if (availablePackages.length > 1) {
      return availablePackages.map((pkg) => ({
        value: pkg.id,
        label: pkg.name,
        data: pkg,
      }));
    }
    return [];
  }, [availablePackages]);

  // Combined effect for form validation and package type changes
  useEffect(() => {
    // Form validation
    const result = AddPackageSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }

    // Reset form when package type changes
    if (!packageType) return;

    const resetFormAndFetchData = async () => {
      setFormData((prev) => ({
        ...initialFormState,
        keep_go_bundle_type: packageType,
      }));
      setSelectedPackage(null);
      setSelectedRegion(null);
      setSelectedCountry(null);
      setSelectedPackageData(null);

      // Fetch data based on package type
      setIsLoading(true);
      try {
        const response = await fetchPackages({
          bundle_type: packageType,
        }).unwrap();
        const packages = response.data || [];
        setAvailablePackages(packages);

        if (packageType === "country") {
          const uniqueCountries = [
            ...new Set(packages.flatMap((pkg) => pkg.coverage)),
          ].map((name) => ({ name }));
          setAvailableCountries(uniqueCountries);
        } else {
          const uniqueRegions = packages.map((pkg) => ({
            id: pkg.id,
            name: pkg.name,
            coverage: pkg.coverage,
          }));
          setAvailableRegions(uniqueRegions);
        }
      } finally {
        setIsLoading(false);
      }
    };

    resetFormAndFetchData();
  }, [packageType, fetchPackages]);

  // Effect for handling selected package changes
  useEffect(() => {
    if (!selectedPackage || availablePackages.length === 0) return;

    const selectedPkg = selectedPackageData;
    if (selectedPkg) {
      const selectedRefill = selectedPkg.refills.find(
        (refill) => refill.title === selectedPackage
      );

      if (selectedRefill) {
        const coverageCountryIds = selectedPkg.coverage.map((countryName) => {
          const country = countries.find((c) => c.name === countryName);
          return country?.name || countryName;
        });
        setPackageCountries(coverageCountryIds);
        setFormData((prev) => ({
          ...prev,
          name: selectedRefill.title,
          data_plan_in_mb: selectedRefill.amount_mb,
          validity: {
            amount: selectedRefill.amount_days || 0,
            type: "day",
          },
          original_price: { USD: selectedRefill.price_usd },
          keep_go_bundle_id: String(selectedPkg.id),
        }));
      }
    }
  }, [selectedPackage, availablePackages, countries]);

  // Effect for handling region/country selection changes
  useEffect(() => {
    if (!selectedRegion && !selectedCountry) return;

    const fetchPackagesForSelection = async () => {
      setIsLoading(true);
      try {
        setFormData((prev) => ({
          ...initialFormState,
          keep_go_bundle_type: packageType,
        }));
        setSelectedPackage(null);
        setSelectedPackageData(null);

        const searchTerm =
          packageType === "country" ? selectedCountry : selectedRegion;
        const response = await fetchPackages({
          bundle_type: packageType,
          search: searchTerm,
        }).unwrap();

        const packages = response.data || [];
        setAvailablePackages(packages);

        // If there's only one package, select it automatically
        if (packages.length === 1) {
          setSelectedPackageData(packages[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackagesForSelection();
  }, [selectedRegion, selectedCountry, packageType]);

  // Form change handler
  const handleChange = useCallback(
    (name, value) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  // Form validation
  const validateForm = useCallback(() => {
    const dataToValidate = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === ""
          ? NaN
          : Number(formData.data_plan_in_mb),
      original_price: {
        USD:
          formData.original_price.USD === ""
            ? NaN
            : Number(formData.original_price.USD),
      },
      price: {
        USD: formData.price.USD === "" ? NaN : Number(formData.price.USD),
        EUR: formData.price.EUR === "" ? NaN : Number(formData.price.EUR),
      },
      validity: {
        amount:
          formData.validity.amount === ""
            ? NaN
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
      },
      vat: {
        amount: formData.vat.amount ? Number(formData.vat.amount) : 0,
      },
      discount: {
        amount: formData.discount.amount ? Number(formData.discount.amount) : 0,
      },
      keep_go_bundle_id: formData.keep_go_bundle_id,
    };

    // First validate with schema
    const result = AddPackageSchema.safeParse(dataToValidate);
    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (path === "coverage") {
          newErrors.coverage_countries = issue.message;
          newErrors.coverage_regions = issue.message;
        } else if (formData[path] !== undefined && formData[path] !== "") {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    // Then validate coverage based on package type
    let isValid = true;
    if (packageType === "country" && formData.coverage_countries.length === 0) {
      setCoverageError("At least one country must be selected");
      isValid = false;
    } else if (
      packageType === "regional" &&
      formData.coverage_regions.length === 0
    ) {
      setCoverageError("At least one region must be selected");
      isValid = false;
    } else {
      setCoverageError(null);
    }

    if (!isValid) {
      return false;
    }

    setErrors({});
    return true;
  }, [formData, packageType]);

  // Update isFormValid to use the same logic as validateForm
  const isFormValid = useMemo(() => {
    const dataToValidate = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === ""
          ? NaN
          : Number(formData.data_plan_in_mb),
      original_price: {
        USD:
          formData.original_price.USD === ""
            ? NaN
            : Number(formData.original_price.USD),
      },
      price: {
        USD: formData.price.USD === "" ? NaN : Number(formData.price.USD),
        EUR: formData.price.EUR === "" ? NaN : Number(formData.price.EUR),
      },
      validity: {
        amount:
          formData.validity.amount === ""
            ? NaN
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
      },
      vat: {
        amount: formData.vat.amount ? Number(formData.vat.amount) : 0,
      },
      discount: {
        amount: formData.discount.amount ? Number(formData.discount.amount) : 0,
      },
      keep_go_bundle_id: formData.keep_go_bundle_id,
    };

    const result = AddPackageSchema.safeParse(dataToValidate);
    if (!result.success) return false;

    if (packageType === "country" && formData.coverage_countries.length === 0) {
      return false;
    }
    if (packageType === "regional" && formData.coverage_regions.length === 0) {
      return false;
    }

    return true;
  }, [formData, packageType]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }
    setIsSubmitting(true);

    try {
      const validatedData = AddPackageSchema.parse({
        ...formData,
        data_plan_in_mb: Number(formData.data_plan_in_mb),
        validity: {
          amount: Number(formData.validity.amount),
          type: formData.validity.type,
        },
        original_price: {
          USD: Number(formData.original_price.USD) || 0,
        },
        price: {
          USD: Number(formData.price.USD) || 0,
          EUR: Number(formData.price.EUR) || 0,
        },
        vat: {
          amount: Number(formData.vat.amount) || 0,
        },
        discount: {
          amount: Number(formData.discount.amount) || 0,
        },
        keep_go_bundle_type: packageType,
      });

      const response = await addPackage({ data: validatedData }).unwrap();

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

  const tagRender = useCallback(
    (props) => {
      const { label, value, closable, onClose } = props;
      const country = countries.find((c) => c._id === value) || {
        code: "",
        name: label,
      };

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
          <span>{label}</span>
        </Tag>
      );
    },
    [countries]
  );

  const dropdownRender = useCallback(
    (menu) => {
      return (
        <>
          {formData.coverage_countries.length > 0 && (
            <div className="p-2 border-b border-neutral-200">
              <div className="text-xs font-medium text-neutral-500 mb-1">
                Selected Countries
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.coverage_countries.map((countryId) => {
                  const country = countries.find((c) => c._id === countryId);
                  if (!country) return null;
                  return (
                    <Tag
                      key={country._id}
                      closable
                      onClose={(e) => {
                        e.stopPropagation();
                        handleChange(
                          "coverage_countries",
                          formData.coverage_countries.filter(
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
          {menu}
        </>
      );
    },
    [formData.coverage_countries, countries, handleChange]
  );

  return {
    isModalVisible,
    isCountryLoading,
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
    packageType,
    setPackageType,
    selectedRegion,
    setSelectedRegion,
    selectedCountry,
    setSelectedCountry,
    selectedPackage,
    setSelectedPackage,
    availableRegions,
    availableCountries,
    availableRefills,
    isLoading,
    packageCountries,
    availablePackageOptions,
    selectedPackageData,
    setSelectedPackageData,
    availablePackages,
    isRegionLoading,
    regions,
    sortedRegions,
    finalPrice,
    coverageError,
  };
};

export const useUpdatePackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.package);

  // Initial form state
  const initialFormState = useMemo(
    () => ({
      id: "",
      name: "",
      type: "data",
      data_plan_in_mb: 0,
      bonus_data_plan_in_mb: 0,
      validity: { amount: 0, type: "day" },
      status: "active",
      coverage_countries: [],
      coverage_regions: [],
      original_price: { USD: 0, EUR: 0 },
      price: { USD: 0, EUR: 0 },
      vat: { amount: 0 },
      is_auto_renew_available: true,
      discount: { amount: 0 },
      vendor_type: "keep-go",
      note: "",
    }),
    []
  );
  const [coverageValidation, setCoverageValidation] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePackage] = useUpdatePackageMutation();

  // API queries
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

  // Derived state
  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const isRegionLoading = isRegionsLoading || isRegionsFetching;
  const regions = regionsResponse?.data || [];

  // Final price calculation
  const finalPrice = useMemo(() => {
    const baseEUR = parseFloat(formData.price.EUR || 0);
    const baseUSD = parseFloat(formData.price.USD || 0);
    const vat = parseFloat(formData.vat.amount || 0);
    const discount = parseFloat(formData.discount.amount || 0);

    const priceAfterDiscountUSD = baseUSD - (baseUSD * discount) / 100;
    const finalUSD =
      priceAfterDiscountUSD + (priceAfterDiscountUSD * vat) / 100;

    const priceAfterDiscountEUR = baseEUR - (baseEUR * discount) / 100;
    const finalEUR =
      priceAfterDiscountEUR + (priceAfterDiscountEUR * vat) / 100;

    return {
      finalUSD: finalUSD.toFixed(2),
      finalEUR: finalEUR.toFixed(2),
    };
  }, [
    formData.price.EUR,
    formData.price.USD,
    formData.vat.amount,
    formData.discount.amount,
  ]);

  // Sorted countries and regions
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

  // Combined effect for form validation and data initialization
  useEffect(() => {
    // Form validation
    const result = UpdatePackageSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }

    // Initialize form data when selectedData changes
    if (selectedData) {
      setFormData({
        id: selectedData._id || selectedData.id || "",
        name: selectedData.name || "",
        type: selectedData.type || "data",
        data_plan_in_mb: selectedData.data_plan_in_mb?.toString() || "",
        bonus_data_plan_in_mb:
          selectedData.bonus_data_plan_in_mb?.toString() || "",
        validity: {
          amount: selectedData.validity?.amount?.toString() || "",
          type: selectedData.validity?.type || "day",
        },
        status: selectedData.status || "active",
        coverage_countries:
          selectedData.coverage_countries?.map((country) =>
            typeof country === "object" ? country._id : country
          ) || [],
        coverage_regions:
          selectedData.coverage_regions?.map((region) =>
            typeof region === "object" ? region._id : region
          ) || [],
        original_price: {
          USD: selectedData.original_price?.USD?.toString() || "",
          EUR: selectedData.original_price?.EUR?.toString() || "",
        },
        price: {
          USD: selectedData.price?.USD?.toString() || "",
          EUR: selectedData.price?.EUR?.toString() || "",
        },
        vat: {
          amount: selectedData.vat?.amount?.toString() || "",
        },
        is_auto_renew_available: selectedData.is_auto_renew_available ?? true,
        discount: {
          amount: selectedData.discount?.amount?.toString() || "",
        },
        vendor_type: selectedData.vendor_type || "telnyx",
        note: selectedData.note || "",
      });
    }
  }, [selectedData]);
  // Form change handler
  const handleChange = useCallback(
    (name, value) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  // Form validation
  const validateForm = useCallback(() => {
    const numericData = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === "" ? "" : Number(formData.data_plan_in_mb),
      bonus_data_plan_in_mb: Number(formData.bonus_data_plan_in_mb) || 0,
      validity: {
        amount:
          formData.validity.amount === ""
            ? ""
            : Number(formData.validity.amount),
        type: formData.validity.type,
      },
      original_price: {
        USD:
          formData.original_price.USD === ""
            ? ""
            : Number(formData.original_price.USD),
        EUR:
          formData.original_price.EUR === ""
            ? ""
            : Number(formData.original_price.EUR),
      },
      price: {
        USD: formData.price.USD === "" ? "" : Number(formData.price.USD),
        EUR: formData.price.EUR === "" ? "" : Number(formData.price.EUR),
      },
      vat: {
        amount: Number(formData.vat.amount) || 0,
      },
      discount: {
        amount: Number(formData.discount.amount) || 0,
      },
    };

    const result = UpdatePackageSchema.safeParse(numericData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  // Form validity check
  const isFormValid = useMemo(() => {
    if (!formData.id) return false;

    const numericData = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === "" ? "" : Number(formData.data_plan_in_mb),
      bonus_data_plan_in_mb: Number(formData.bonus_data_plan_in_mb) || 0,
      validity: {
        amount:
          formData.validity.amount === ""
            ? ""
            : Number(formData.validity.amount),
        type: formData.validity.type,
      },
      original_price: {
        USD:
          formData.original_price.USD === ""
            ? ""
            : Number(formData.original_price.USD),
        EUR:
          formData.original_price.EUR === ""
            ? ""
            : Number(formData.original_price.EUR),
      },
      price: {
        USD: formData.price.USD === "" ? "" : Number(formData.price.USD),
        EUR: formData.price.EUR === "" ? "" : Number(formData.price.EUR),
      },
      vat: {
        amount: Number(formData.vat.amount) || 0,
      },
      discount: {
        amount: Number(formData.discount.amount) || 0,
      },
    };

    const result = UpdatePackageSchema.safeParse(numericData);

    // Check coverage based on bundle type
    let coverageValid = false;
    if (selectedData?.keep_go_bundle_type === "regional") {
      coverageValid = formData.coverage_regions.length > 0;
    } else if (selectedData?.keep_go_bundle_type === "country") {
      coverageValid = formData.coverage_countries.length > 0;
    }

    return result.success && coverageValid;
  }, [formData, selectedData?.keep_go_bundle_type]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const validatedData = UpdatePackageSchema.parse({
        ...formData,
        data_plan_in_mb: Number(formData.data_plan_in_mb),
        bonus_data_plan_in_mb: Number(formData.bonus_data_plan_in_mb) || 0,
        validity: {
          amount: Number(formData.validity.amount),
          type: formData.validity.type,
        },
        original_price: {
          USD: Number(formData.original_price.USD),
          EUR: Number(formData.original_price.EUR),
        },
        price: {
          USD: Number(formData.price.USD),
          EUR: Number(formData.price.EUR),
        },
        vat: {
          amount: Number(formData.vat.amount) || 0,
        },
        discount: {
          amount: Number(formData.discount.amount) || 0,
        },
      });

      const response = await updatePackage({
        id: formData.id,
        data: validatedData,
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

  const tagRender = useCallback((props) => {
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
  }, []);

  const dropdownRender = useCallback(
    (menu) => {
      return (
        <>
          {formData.coverage_countries.length > 0 && (
            <div className="p-2 border-b border-neutral-200">
              <div className="text-xs font-medium text-neutral-500 mb-1">
                Selected Countries
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.coverage_countries.map((countryId) => {
                  const country = countries.find((c) => c._id === countryId);
                  if (!country) return null;
                  return (
                    <Tag
                      key={country._id}
                      closable
                      onClose={(e) => {
                        e.stopPropagation();
                        handleChange(
                          "coverage_countries",
                          formData.coverage_countries.filter(
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
          {menu}
        </>
      );
    },
    [formData.coverage_countries, countries, handleChange]
  );

  return {
    isModalVisible,
    isCountryLoading,
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
  };
};
