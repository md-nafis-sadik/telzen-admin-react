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
      retail_price: { USD: "" },
      selling_price: { USD: "" },
      vat_on_selling_price: { amount: "", is_type_percentage: true },
      is_auto_renew_available: false,
      discount_on_selling_price: { amount: "", is_type_percentage: true },
      note: "",
      package_code: "",
      coverage_type: "country",
      slug: "",
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addPackage] = useAddPackageMutation();
  const [packageType, setPackageType] = useState("country");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageCountries, setPackageCountries] = useState([]);
  const [packageRegions, setPackageRegions] = useState([]);
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

  const finalPrice = useMemo(() => {
    const baseUSD = parseFloat(formData.selling_price.USD || 0);
    const vatAmount = parseFloat(formData.vat_on_selling_price.amount || 0);
    const discountAmount = parseFloat(
      formData.discount_on_selling_price.amount || 0
    );

    let priceAfterDiscountUSD = baseUSD;
    let finalUSD = baseUSD;

    if (formData.discount_on_selling_price.is_type_percentage) {
      priceAfterDiscountUSD = baseUSD - (baseUSD * discountAmount) / 100;
    } else {
      const maxDiscount = Math.min(discountAmount, baseUSD);
      priceAfterDiscountUSD = baseUSD - maxDiscount;
    }

    if (formData.vat_on_selling_price.is_type_percentage) {
      finalUSD =
        priceAfterDiscountUSD + (priceAfterDiscountUSD * vatAmount) / 100;
    } else {
      finalUSD = priceAfterDiscountUSD + vatAmount;
    }

    return {
      finalUSD: Math.max(0, finalUSD).toFixed(2),
      priceAfterDiscountUSD: Math.max(0, priceAfterDiscountUSD).toFixed(2),
    };
  }, [
    formData.selling_price.USD,
    formData.vat_on_selling_price.amount,
    formData.vat_on_selling_price.is_type_percentage,
    formData.discount_on_selling_price.amount,
    formData.discount_on_selling_price.is_type_percentage,
  ]);

  const availablePackageOptions = useMemo(() => {
    return availablePackages.map((pkg) => ({
      value: pkg.package_code,
      label: `${pkg.name} (${pkg.data_plan_in_mb}MB - ${pkg.validity.amount} days)`,
      data: pkg,
    }));
  }, [availablePackages]);

  useEffect(() => {
    const result = AddPackageSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }

    if (!packageType) return;

    const fetchPackagesForType = async () => {
      setFormData((prev) => ({
        ...initialFormState,
        coverage_type: packageType,
      }));
      setSelectedPackage(null);
      setSelectedPackageData(null);
      setPackageCountries([]);

      setIsLoading(true);
      try {
        const response = await fetchPackages({
          coverage_type: packageType,
        }).unwrap();
        setAvailablePackages(response.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setAvailablePackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackagesForType();
  }, [packageType, fetchPackages, initialFormState]);

  useEffect(() => {
    if (!selectedPackage || !selectedPackageData) return;

    const countryCodes = selectedPackageData.country_code
      .split(",")
      .map((code) => code.trim());

    setPackageCountries(countryCodes);

    setFormData((prev) => ({
      ...prev,
      name: selectedPackageData.name,
      data_plan_in_mb: selectedPackageData.data_plan_in_mb,
      validity: {
        amount: selectedPackageData.validity?.amount || 0,
        type: selectedPackageData.validity?.type || "day",
      },
      retail_price: { USD: selectedPackageData.retail_price || 0 },
      package_code: selectedPackageData.package_code,
      slug: selectedPackageData.slug,
    }));
  }, [selectedPackage, selectedPackageData]);

  const handleCountrySelection = useCallback(
    (selectedCountryIds) => {
      setFormData((prev) => {
        const previousCountries = prev.coverage_countries || [];
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
          ...new Set([...prev.coverage_regions, ...newCountryRegions]),
        ];

        return {
          ...prev,
          coverage_countries: selectedCountryIds,
          coverage_regions: allRegions,
        };
      });
    },
    [countries]
  );

  const handleChange = useCallback(
    (name, value) => {
      if (name === "coverage_countries") {
        handleCountrySelection(value);
        console.log(value);
      } else if (name.includes(".")) {
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

      if (name === "coverage_countries" || name === "coverage_regions") {
        setCoverageError(null);
      }
    },
    [errors, handleCountrySelection]
  );

  const handleVatTypeToggle = useCallback((isFixed) => {
    setFormData((prev) => ({
      ...prev,
      vat_on_selling_price: {
        ...prev.vat_on_selling_price,
        is_type_percentage: !isFixed,
        amount: "",
      },
    }));
  }, []);

  const handleDiscountTypeToggle = useCallback((isFixed) => {
    setFormData((prev) => ({
      ...prev,
      discount_on_selling_price: {
        ...prev.discount_on_selling_price,
        is_type_percentage: !isFixed,
        amount: "",
      },
    }));
  }, []);

  const validateForm = useCallback(() => {
    const dataToValidate = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === ""
          ? NaN
          : Number(formData.data_plan_in_mb),
      retail_price: {
        USD:
          formData.retail_price.USD === ""
            ? NaN
            : Number(formData.retail_price.USD),
      },
      selling_price: {
        USD:
          formData.selling_price.USD === ""
            ? NaN
            : Number(formData.selling_price.USD),
      },
      validity: {
        amount:
          formData.validity.amount === ""
            ? NaN
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
      },
      vat_on_selling_price: {
        amount: formData.vat_on_selling_price.amount
          ? Number(formData.vat_on_selling_price.amount)
          : 0,
        is_type_percentage: formData.vat_on_selling_price.is_type_percentage,
      },
      discount_on_selling_price: {
        amount: formData.discount_on_selling_price.amount
          ? Number(formData.discount_on_selling_price.amount)
          : 0,
        is_type_percentage:
          formData.discount_on_selling_price.is_type_percentage,
      },
      package_code: formData.package_code,
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

    const sellingPrice = parseFloat(formData.selling_price.USD || 0);

    if (!formData.vat_on_selling_price.is_type_percentage) {
      const vatAmount = parseFloat(formData.vat_on_selling_price.amount || 0);
      if (vatAmount > sellingPrice) {
        setErrors((prev) => ({
          ...prev,
          vat_on_selling_price: "VAT amount cannot exceed selling price",
        }));
        return false;
      }
    }

    if (!formData.discount_on_selling_price.is_type_percentage) {
      const discountAmount = parseFloat(
        formData.discount_on_selling_price.amount || 0
      );
      if (discountAmount > sellingPrice) {
        setErrors((prev) => ({
          ...prev,
          discount_on_selling_price:
            "Discount amount cannot exceed selling price",
        }));
        return false;
      }
    }

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

  // Update isFormValid
  const isFormValid = useMemo(() => {
    const dataToValidate = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === ""
          ? NaN
          : Number(formData.data_plan_in_mb),
      retail_price: {
        USD:
          formData.retail_price.USD === ""
            ? NaN
            : Number(formData.retail_price.USD),
      },
      selling_price: {
        USD:
          formData.selling_price.USD === ""
            ? NaN
            : Number(formData.selling_price.USD),
      },
      validity: {
        amount:
          formData.validity.amount === ""
            ? NaN
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
      },
      vat_on_selling_price: {
        amount: formData.vat_on_selling_price.amount
          ? Number(formData.vat_on_selling_price.amount)
          : 0,
        is_type_percentage: formData.vat_on_selling_price.is_type_percentage,
      },
      discount_on_selling_price: {
        amount: formData.discount_on_selling_price.amount
          ? Number(formData.discount_on_selling_price.amount)
          : 0,
        is_type_percentage:
          formData.discount_on_selling_price.is_type_percentage,
      },
      package_code: formData.package_code,
      slug: formData.slug,
    };

    const result = AddPackageSchema.safeParse(dataToValidate);
    if (!result.success) return false;

    const sellingPrice = parseFloat(formData.selling_price.USD || 0);

    if (!formData.vat_on_selling_price.is_type_percentage) {
      const vatAmount = parseFloat(formData.vat_on_selling_price.amount || 0);
      if (vatAmount > sellingPrice) return false;
    }

    if (!formData.discount_on_selling_price.is_type_percentage) {
      const discountAmount = parseFloat(
        formData.discount_on_selling_price.amount || 0
      );
      if (discountAmount > sellingPrice) return false;
    }

    if (packageType === "country" && formData.coverage_countries.length === 0) {
      return false;
    }
    if (packageType === "regional" && formData.coverage_regions.length === 0) {
      return false;
    }

    return true;
  }, [formData, packageType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }
    setIsSubmitting(true);

    try {
      let validatedData = AddPackageSchema.parse({
        ...formData,
        data_plan_in_mb: Number(formData.data_plan_in_mb),
        validity: {
          amount: Number(formData.validity.amount),
          type: formData.validity.type,
        },
        retail_price: {
          USD: Number(formData.retail_price.USD) || 0,
        },
        selling_price: {
          USD: Number(formData.selling_price.USD) || 0,
        },
        vat_on_selling_price: {
          amount: Number(formData.vat_on_selling_price.amount) || 0,
          is_type_percentage: formData.vat_on_selling_price.is_type_percentage,
        },
        discount_on_selling_price: {
          amount: Number(formData.discount_on_selling_price.amount) || 0,
          is_type_percentage:
            formData.discount_on_selling_price.is_type_percentage,
        },
        coverage_type: packageType,
        slug: formData.slug,
      });

      if (formData.coverage_type === "regional") {
        const { coverage_countries, ...rest } = validatedData;
        validatedData = rest;
      }

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
    selectedPackage,
    setSelectedPackage,
    isLoading,
    packageCountries,
    availablePackageOptions,
    selectedPackageData,
    setSelectedPackageData,
    availablePackages,
    isRegionLoading,
    sortedRegions,
    finalPrice,
    coverageError,
    handleVatTypeToggle,
    handleDiscountTypeToggle,
  };
};
export const useUpdatePackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.package);

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
      retail_price: { USD: "" },
      selling_price: { USD: "" },
      vat_on_selling_price: { amount: "", is_type_percentage: true },
      discount_on_selling_price: { amount: "", is_type_percentage: true },
      is_auto_renew_available: true,
      note: "",
      slug: "",
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Renamed to avoid conflict with hook name
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

  const finalPrice = useMemo(() => {
    const baseUSD = parseFloat(formData.selling_price.USD || 0);
    const vatAmount = parseFloat(formData.vat_on_selling_price.amount || 0);
    const discountAmount = parseFloat(
      formData.discount_on_selling_price.amount || 0
    );

    let priceAfterDiscountUSD = baseUSD;
    let finalUSD = baseUSD;

    if (formData.discount_on_selling_price.is_type_percentage) {
      priceAfterDiscountUSD = baseUSD - (baseUSD * discountAmount) / 100;
    } else {
      const maxDiscount = Math.min(discountAmount, baseUSD);
      priceAfterDiscountUSD = baseUSD - maxDiscount;
    }

    if (formData.vat_on_selling_price.is_type_percentage) {
      finalUSD =
        priceAfterDiscountUSD + (priceAfterDiscountUSD * vatAmount) / 100;
    } else {
      finalUSD = priceAfterDiscountUSD + vatAmount;
    }

    return {
      finalUSD: Math.max(0, finalUSD).toFixed(2),
      priceAfterDiscountUSD: Math.max(0, priceAfterDiscountUSD).toFixed(2),
    };
  }, [
    formData.selling_price.USD,
    formData.vat_on_selling_price.amount,
    formData.vat_on_selling_price.is_type_percentage,
    formData.discount_on_selling_price.amount,
    formData.discount_on_selling_price.is_type_percentage,
  ]);

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

  const getRegionsFromCountries = useCallback(
    (countryIds) => {
      if (!countryIds.length || !countries.length) return [];

      const regionIds = countryIds
        .map((countryId) => {
          const country = countries.find((c) => c._id === countryId);
          return country?.region?._id;
        })
        .filter((regionId) => regionId && regionId !== "");

      return [...new Set(regionIds)]; // Remove duplicates
    },
    [countries]
  );

  const handleCountrySelection = useCallback(
    (selectedCountryIds) => {
      setFormData((prev) => {
        const regionsFromCountries =
          getRegionsFromCountries(selectedCountryIds);

        return {
          ...prev,
          coverage_countries: selectedCountryIds,
          coverage_regions: regionsFromCountries,
        };
      });
    },
    [getRegionsFromCountries]
  );

  useEffect(() => {
    if (selectedData && countries.length > 0) {
      const coverageCountries =
        selectedData.coverage_countries?.map((country) =>
          typeof country === "object" ? country._id : country
        ) || [];

      // Calculate regions from the selected countries
      let regionsFromCountries = [];
      if (selectedData.coverge_type === "country") {
        regionsFromCountries = getRegionsFromCountries(coverageCountries);
      } else {
        regionsFromCountries =
          selectedData.coverage_regions?.map((region) =>
            typeof region === "object" ? region._id : region
          ) || [];
      }

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
        coverage_countries: coverageCountries,
        coverage_regions: regionsFromCountries,
        retail_price: {
          USD: selectedData.retail_price?.USD?.toString() || "",
        },
        selling_price: {
          USD: selectedData.selling_price?.USD?.toString() || "",
        },
        vat_on_selling_price: {
          amount: selectedData.vat_on_selling_price?.amount?.toString() || "",
          is_type_percentage:
            selectedData.vat_on_selling_price?.is_type_percentage ?? true,
        },
        discount_on_selling_price: {
          amount:
            selectedData.discount_on_selling_price?.amount?.toString() || "",
          is_type_percentage:
            selectedData.discount_on_selling_price?.is_type_percentage ?? true,
        },
        is_auto_renew_available: selectedData.is_auto_renew_available ?? true,
        note: selectedData.note || "",
        slug: selectedData.slug || "",
      });
    }
  }, [selectedData, countries, getRegionsFromCountries]);

  const handleChange = useCallback(
    (name, value) => {
      if (name === "coverage_countries") {
        handleCountrySelection(value);
      } else if (name.includes(".")) {
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
    [errors, handleCountrySelection]
  );

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
      retail_price: {
        USD:
          formData.retail_price.USD === ""
            ? ""
            : Number(formData.retail_price.USD),
      },
      selling_price: {
        USD:
          formData.selling_price.USD === ""
            ? ""
            : Number(formData.selling_price.USD),
      },
      vat_on_selling_price: {
        amount: Number(formData.vat_on_selling_price.amount) || 0,
        is_type_percentage:
          formData.vat_on_selling_price?.is_type_percentage ?? true,
      },
      discount_on_selling_price: {
        amount: Number(formData.discount_on_selling_price.amount) || 0,
        is_type_percentage:
          formData.discount_on_selling_price?.is_type_percentage ?? true,
      },
      slug: formData.slug || "",
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
      retail_price: {
        USD:
          formData.retail_price.USD === ""
            ? ""
            : Number(formData.retail_price.USD),
      },
      selling_price: {
        USD:
          formData.selling_price.USD === ""
            ? ""
            : Number(formData.selling_price.USD),
      },
      vat_on_selling_price: {
        amount: Number(formData.vat_on_selling_price.amount) || 0,
        is_type_percentage:
          formData.vat_on_selling_price?.is_type_percentage ?? true,
      },
      discount_on_selling_price: {
        amount: Number(formData.discount_on_selling_price.amount) || 0,
        is_type_percentage:
          formData.discount_on_selling_price?.is_type_percentage ?? true,
      },
      slug: formData.slug || "",
    };

    const result = UpdatePackageSchema.safeParse(numericData);

    let coverageValid = false;
    if (selectedData?.coverage_type === "regional") {
      coverageValid = formData.coverage_regions.length > 0;
    } else if (selectedData?.coverage_type === "country") {
      coverageValid = formData.coverage_countries.length > 0;
    }

    return result.success && coverageValid;
  }, [formData, selectedData?.coverage_type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      let validatedData = UpdatePackageSchema.parse({
        ...formData,
        data_plan_in_mb: Number(formData.data_plan_in_mb),
        bonus_data_plan_in_mb: Number(formData.bonus_data_plan_in_mb) || 0,
        validity: {
          amount: Number(formData.validity.amount),
          type: formData.validity.type,
        },
        retail_price: {
          USD:
            formData.retail_price.USD === ""
              ? ""
              : Number(formData.retail_price.USD),
        },
        selling_price: {
          USD:
            formData.selling_price.USD === ""
              ? ""
              : Number(formData.selling_price.USD),
        },
        vat_on_selling_price: {
          amount: Number(formData.vat_on_selling_price.amount) || 0,
          is_type_percentage:
            formData.vat_on_selling_price?.is_type_percentage ?? true,
        },
        discount_on_selling_price: {
          amount: Number(formData.discount_on_selling_price.amount) || 0,
          is_type_percentage:
            formData.discount_on_selling_price?.is_type_percentage ?? true,
        },
        slug: formData.slug || "",
      });

      if (selectedData.coverage_type === "regional") {
        const { coverage_countries, ...rest } = validatedData;
        validatedData = rest;
      }

      const response = await updatePackageMutation({
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
