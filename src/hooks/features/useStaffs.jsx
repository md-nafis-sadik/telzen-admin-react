import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removeStaffFromList,
  setSelectedStaffData,
  setStaffMetaData,
  updateStaffInList,
  addNewStaffToList,
  clearSelectedStaffData,
  setEditFormData,
  resetEditFormData,
} from "../../features/staffs/staffSlice";
import {
  useGetAllStaffsQuery,
  useDeleteStaffMutation,
  useUpdateStaffMutation,
  useAddStaffMutation,
  useLazyGetSingleStaffQuery,
} from "../../features/staffs/staffApi";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { AddStaffSchema, UpdateStaffSchema } from "../../utils/validations";

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

// ** Staff List **
export const useGetStaffs = () => {
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector((state) => state.staff);
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

  const { isLoading, isFetching, isError, error } = useGetAllStaffsQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [staffId, setStaffId] = useState(null);
  const updatePageMeta = (value) => dispatch(setStaffMetaData(value));
  const handleSetSelectedStaff = (data) => dispatch(setSelectedStaffData(data));
  const [deleteStaff, { isLoading: deleteLoading }] = useDeleteStaffMutation();
  const [updatingStaffs, setUpdatingStaffs] = useState({});
  const [updatePackageStaff] = useUpdateStaffMutation();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSearchRef.current = debouncedSearch;
      return;
    }
    setForceRefetchTrigger((prev) => prev + 1);
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
    if (!staffId) {
      errorNotify("Staff ID is required.");
      return false;
    }

    try {
      const response = await deleteStaff({ id: staffId }).unwrap();
      if (response?.success) {
        dispatch(removeStaffFromList({ _id: staffId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete staff");
      return false;
    }
  };

  const handleNavigate = (item) => {
    navigate(`/staff-edit/${item._id}`);
  };

  const handleOpenAddStaffModal = () => {
    navigate("/staff-add", {
      state: {
        type: "add",
      },
    });
  };

  const handleBlockToggle = async (staffId, isBlocked) => {
    setUpdatingStaffs((prev) => ({ ...prev, [staffId]: true }));

    try {
      const result = await updatePackageStaff({
        id: staffId,
        data: { is_blocked: !isBlocked },
      }).unwrap();

      if (result?.success) {
        dispatch(updateStaffInList({ ...result?.data, _id: result?.data._id }));
        successNotify(
          `Staff ${!isBlocked ? "blocked" : "unblocked"} successfully`
        );
      } else {
        errorNotify(result?.message || "Failed to update staff status");
      }
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to update staff status");
    } finally {
      setUpdatingStaffs((prev) => {
        const newState = { ...prev };
        delete newState[staffId];
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
    handleSetSelectedStaff,
    setStaffId,
    handleNavigate,
    handleOpenAddStaffModal,
    handleBlockToggle,
    updatingStaffs,
    Option: Select.Option,
    Select,
    ADMIN_EMAIL,
  };
};

// ** Add Staff **
export const useAddStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+1",
    country: {
      code: "US",
      name: "United States",
      dial_code: "+1",
    },
    role: "admin",
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addStaff, { isLoading }] = useAddStaffMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: typeof value === "string" ? value : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const result = AddStaffSchema.safeParse(formData);
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
      errorNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addStaff({ data: formData }).unwrap();
      if (response?.success) {
        setIsModalVisible(true);
        dispatch(addNewStaffToList(response.data));
        setIsSubmitting(false);
      } else {
        errorNotify(response?.message || "Failed to create staff");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating staff:", error);
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
        error.data?.message || "Failed to create staff. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/staffs");
  };

  const isFormValid = AddStaffSchema.safeParse(formData).success;

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
    setFormData,
    setErrors,
    isSubmitting
  };
};

// ** Update Staff **
export const useUpdateStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedData, editFormData } = useSelector((state) => state.staff);

  const [
    getSingleStaff,
    { isLoading: isSingleStaffLoading, isError: isSingleStaffError },
  ] = useLazyGetSingleStaffQuery();

  const formData = editFormData;
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateStaff] = useUpdateStaffMutation();

  useEffect(() => {
    if (id) {
      dispatch(resetEditFormData());
      getSingleStaff({ staff_id: id });
    }
  }, [dispatch, id, getSingleStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData;
    if (name === "country") {
      updatedFormData = {
        ...formData,
        country: value,
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: typeof value === "string" ? value.trim() : value,
      };
    }

    dispatch(setEditFormData(updatedFormData));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const result = UpdateStaffSchema.safeParse(formData);
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
      const result = await updateStaff({
        id: formData.id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        },
      }).unwrap();

      if (result.success) {
        setIsModalVisible(true);
        dispatch(updateStaffInList(result.data));
      } else {
        errorNotify(result.message || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
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
        error.data?.message || "An error occurred while updating the staff"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/staffs");
  };

  const isFormValid = UpdateStaffSchema.safeParse(formData).success;

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleModalOk,
    isModalVisible,
    isLoading: isSingleStaffLoading,
    isSubmitting,
    isFormValid,
    navigate,
    editFormData,
  };
};
