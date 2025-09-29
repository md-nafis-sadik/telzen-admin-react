import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removePackageFromList,
  setSelectedPackageData,
  setPackageMetaData,
  updatePackageInList,
  addNewPackageToList,
  clearSelectedPackageData,
} from "../../features/packages/package/packageSlice";
import {
  useGetAllPackagesQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useAddPackageMutation,
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

  const apiParams = {
    page: current_page,
    limit: page_size,
    search: debouncedSearch,
    ...(filterKey !== undefined && { status: filterKey || null }),
    ...(regionFilter !== undefined && { region: regionFilter || null }),
  };
  const isInitialRender = useRef(true);
  const { isLoading, isFetching, isError, error } = useGetAllPackagesQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: true,
      skip: isInitialRender.current && dataList.length > 0,
    }
  );
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    dispatch(setPackageMetaData({ ...meta, current_page: 1 }));
  }, [debouncedSearch, filterKey]);
  const [packageId, setPackageId] = useState(null);
  const updatePageMeta = (value) => dispatch(setPackageMetaData(value));
  const handleSetSelectedPackage = (data) =>
    dispatch(setSelectedPackageData(data));
  const [deletePackage, { isLoading: deleteLoading }] =
    useDeletePackageMutation();
  const [updatingPackages, setUpdatingPackages] = useState({});
  const [updatePackagePackage] = useUpdatePackageMutation();

  const { Option } = Select;

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
      errorNotify(err?.data?.message || "Failed to delete package");
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
  const [formData, setFormData] = useState({
    name: "",
    type: "data",
    data_plan_in_mb: "",
    bonus_data_plan_in_mb: "",
    validity: {
      amount: "",
      type: "day",
    },
    status: "active",
    coverage_countries: [],
    original_price: {
      USD: "",
      EUR: "",
    },
    price: {
      USD: "",
      EUR: "",
    },
    vat: {
      amount: "",
    },
    is_auto_renew_available: true,
    discount: {
      amount: "",
    },
    vendor_type: "telnyx",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addPackage] = useAddPackageMutation();
  // Fetch countries
  const {
    data: countriesResponse,
    isLoading: isCountrysLoading,
    isFetching: isCountrysFetching,
  } = useGetAllActiveCountrysQuery();
  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const [sortedCountries, setSortedCountries] = useState([]);

  useEffect(() => {
    if (countries.length > 0) {
      // Sort countries so selected ones appear first
      const sorted = [...countries].sort((a, b) => {
        const aSelected = formData.coverage_countries.includes(a._id);
        const bSelected = formData.coverage_countries.includes(b._id);
        return bSelected - aSelected; // Selected items come first
      });
      setSortedCountries(sorted);
    }
  }, [countries, formData.coverage_countries]);

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

  // In both useAddPackage and useUpdatePackage hooks
  const validateForm = () => {
    const validationData = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === "" ? "" : Number(formData.data_plan_in_mb),
      bonus_data_plan_in_mb: formData.bonus_data_plan_in_mb
        ? Number(formData.bonus_data_plan_in_mb)
        : 0,
      validity: {
        amount:
          formData.validity.amount === ""
            ? ""
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
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
        amount: formData.vat.amount ? Number(formData.vat.amount) : 0,
      },
      discount: {
        amount: formData.discount.amount ? Number(formData.discount.amount) : 0,
      },
    };

    const result = AddPackageSchema.safeParse(validationData);

    if (!result.success) {
      console.log("Validation errors:", result.error.issues); // Detailed error logging
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
        console.log(`Error at ${path}:`, issue.message); // Per-error logging
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  useEffect(() => {
    const result = UpdatePackageSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }
  }, [formData]);

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

      const response = await addPackage({ data: validatedData }).unwrap();

      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewPackageToList(response.data));
      }
    } catch (error) {
      console.error("Error creating package:", error);

      // Handle Zod validation errors
      if (error.errors) {
        setErrors(
          error.errors.reduce(
            (acc, err) => ({
              ...acc,
              [err.path.join(".")]: err.message,
            }),
            {}
          )
        );
        return;
      }

      // Handle API errors
      if (error.data?.errorMessages) {
        const apiErrors = error.data.errorMessages.reduce(
          (acc, err) => ({
            ...acc,
            [err.path.split(".")[0]]: err.message,
          }),
          {}
        );

        setErrors(apiErrors);
        error.data.errorMessages.forEach((err) =>
          errorNotify(`${err.path}: ${err.message}`)
        );
        return;
      }

      // Fallback for other errors
      errorNotify(error.data?.message || "Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = (() => {
    const validationData = {
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
    const result = AddPackageSchema.safeParse(validationData);
    return result.success;
  })();

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/packages");
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
          countryCode={label} // Use the label directly
          svg
          style={{ width: "16px", height: "12px" }}
        />
        <span>{label}</span>
      </Tag>
    );
  };

  // Custom dropdown render function
  const dropdownRender = (menu) => (
    <>
      {/* Selected countries section */}
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
      {/* Regular dropdown menu */}
      {menu}
    </>
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
  };
};

export const useUpdatePackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData } = useSelector((state) => state.package);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "data",
    data_plan_in_mb: 0,
    bonus_data_plan_in_mb: 0,
    validity: {
      amount: 0,
      type: "day",
    },
    status: "active",
    coverage_countries: [],
    original_price: {
      USD: 0,
      EUR: 0,
    },
    price: {
      USD: 0,
      EUR: 0,
    },
    vat: {
      amount: 0,
    },
    is_auto_renew_available: true,
    discount: {
      amount: 0,
    },
    vendor_type: "telnyx",
    note: "",
  });

  useEffect(() => {
    const result = UpdatePackageSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }
  }, [formData]);

  useEffect(() => {
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

  useEffect(() => {
    return () => {
      dispatch(clearSelectedPackageData());
    };
  }, [dispatch]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePackage] = useUpdatePackageMutation();
  // Fetch countries
  const {
    data: countriesResponse,
    isLoading: isCountrysLoading,
    isFetching: isCountrysFetching,
  } = useGetAllActiveCountrysQuery();
  const isCountryLoading = isCountrysLoading || isCountrysFetching;
  const countries = countriesResponse?.data || [];
  const [sortedCountries, setSortedCountries] = useState([]);

  useEffect(() => {
    if (countries.length > 0) {
      const sorted = [...countries].sort((a, b) => {
        const aSelected = formData.coverage_countries.includes(a._id);
        const bSelected = formData.coverage_countries.includes(b._id);
        return bSelected - aSelected; // Selected items come first
      });
      setSortedCountries(sorted);
    }
  }, [countries, formData.coverage_countries]);

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

  const validateForm = () => {
    const numericData = {
      ...formData,
      data_plan_in_mb:
        formData.data_plan_in_mb === "" ? "" : Number(formData.data_plan_in_mb),
      bonus_data_plan_in_mb: formData.bonus_data_plan_in_mb
        ? Number(formData.bonus_data_plan_in_mb)
        : 0,
      validity: {
        amount:
          formData.validity.amount === ""
            ? ""
            : Number(formData.validity.amount),
        type: formData.validity.type || "day",
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
        amount: formData.vat.amount ? Number(formData.vat.amount) : 0,
      },
      discount: {
        amount: formData.discount.amount ? Number(formData.discount.amount) : 0,
      },
    };

    const result = UpdatePackageSchema.safeParse(numericData);

    if (!result.success) {
      console.log("Validation errors:", result.error.issues); // Debug log
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
  };

  const isFormValid = (() => {
    // Skip validation if form hasn't been initialized yet
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
    return result.success;
  })();

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
          updatePackageInList({ ...response?.data, _id: response?.data._id })
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

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/packages");
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
          countryCode={label} // Use the label directly
          svg
          style={{ width: "16px", height: "12px" }}
        />
        <span>{label}</span>
      </Tag>
    );
  };
  const dropdownRender = (menu) => (
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
  };
};
