import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import {
  removeUserFromList,
  setSelectedUserData,
  setUserMetaData,
  updateUserInList,
} from "../../features/users/userSlice";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../features/users/userApi";
import { useNavigate } from "react-router-dom";

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

// ** User List **
export const useGetUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataList, meta, selectedData } = useSelector((state) => state.user);
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
    ...(filterKey !== undefined && { filter: filterKey || null }),
    forceRefetch: forceRefetchTrigger,
  };

  const { isLoading, isFetching, isError, error } = useGetAllUsersQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip:
        isInitialRender.current &&
        dataList.length > 0 &&
        debouncedSearch === "",
    }
  );

  const [userId, setUserId] = useState(null);
  const [updatingUsers, setUpdatingUsers] = useState({});
  const [updatePackageUser] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const updatePageMeta = (value) => dispatch(setUserMetaData(value));
  const handleSetSelectedUser = (data) => dispatch(setSelectedUserData(data));

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
    if (!userId) {
      errorNotify("User ID is required.");
      return false;
    }
    try {
      const response = await deleteUser({ id: userId }).unwrap();
      if (response?.success) {
        dispatch(removeUserFromList({ _id: userId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete user");
      return false;
    }
  };

  const handleNavigate = (item) => {
    dispatch(setSelectedUserData(item));
    navigate(`/users/${item._id}`);
  };

  const handleOpenAddUserModal = () => {
    navigate("/package-user-add", { state: { type: "add" } });
  };

  const handleStatusChange = async (userId, newStatus) => {
    const apiStatus = newStatus === "Active" ? "active" : "inactive";
    setUpdatingUsers((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await updatePackageUser({
        id: userId,
        data: { status: apiStatus },
      }).unwrap();
      if (result?.success) {
        dispatch(updateUserInList({ ...result?.data, _id: result?.data._id }));
      } else {
        errorNotify(result?.message || "Failed to update user status");
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    setUpdatingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      const result = await updatePackageUser({
        id: userId,
        data: { is_blocked: !isBlocked },
      }).unwrap();

      if (result?.success) {
        dispatch(updateUserInList({ ...result?.data, _id: result?.data._id }));
        successNotify(result?.message || "User status updated successfully");
      } else {
        errorNotify(result?.message || "Failed to update user status");
      }
    } catch (error) {
      errorNotify(error?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
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
    selectedData,
    handleSetSelectedUser,
    setUserId,
    handleNavigate,
    handleOpenAddUserModal,
    handleStatusChange,
    handleBlockToggle,
    updatingUsers,
    dispatch,
    navigate,
  };
};
