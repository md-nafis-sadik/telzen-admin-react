import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../utils/notify";
import { z } from "zod";
import {
  removeNotificationFromList,
  setSelectedNotificationData,
  setNotificationMetaData,
  addNewNotificationToList,
} from "../../features/notifications";
import {
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useAddNotificationMutation,
} from "../../features/notifications";
import { useNavigate } from "react-router-dom";
import { useGetAllActiveUsersQuery } from "../../features/users";
import { Select, Tag } from "antd";
import { AddNotificationSchema } from "../../utils/validations/notificationSchemas";

// ** Notification List **
export const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { dataList, meta, selectedData } = useSelector(
    (state) => state.notification
  );
  const { current_page, page_size } = meta || {};
  const apiParams = {
    page: current_page,
    limit: page_size,
  };
  const isInitialRender = useRef(true);
  const { isLoading, isFetching, isError, error } = useGetAllNotificationsQuery(
    apiParams,
    {
      refetchOnMountOrArgChange: false,
      skip: isInitialRender.current && dataList.length > 0,
    }
  );
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // dispatch(setNotificationMetaData({ ...meta, current_page: 1 }));
  }, []);
  const [notificationId, setNotificationId] = useState(null);
  const updatePageMeta = (value) => dispatch(setNotificationMetaData(value));
  const handleSetSelectedNotification = (data) =>
    dispatch(setSelectedNotificationData(data));
  const [deleteNotification, { isLoading: deleteLoading }] =
    useDeleteNotificationMutation();

  const { Option } = Select;

  // handle delete notification
  const handleDelete = async () => {
    if (!notificationId) {
      errorNotify("Notification ID is required.");
      return false;
    }

    try {
      const response = await deleteNotification({
        id: notificationId,
      }).unwrap();
      if (response?.success) {
        dispatch(removeNotificationFromList({ _id: notificationId }));
        successNotify(response?.message);
        return true;
      }
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to delete notification");
      return false;
    }
  };

  return {
    dataList,
    meta,
    isLoading: isLoading || isFetching,
    isError,
    updatePageMeta,
    handleDelete,
    selectedData,
    handleSetSelectedNotification,
    setNotificationId,
    Option,
    Select,
  };
};

export const useAddNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "all", // 'all' or 'custom'
    userIds: [],
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addNotification, { isLoading }] = useAddNotificationMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [typeError, setTypeError] = useState(false);
  useSelector((state) => state.user);

  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetAllActiveUsersQuery();
  const users = usersResponse?.data || [];
  const [sortedUsers, setSortedUsers] = useState([]);

  useEffect(() => {
    if (formData.recipientType === "all" && users.length > 0) {
      setFormData((prev) => ({
        ...prev,
        userIds: users.map((user) => user._id),
      }));
    } else if (formData.recipientType === "custom") {
      setFormData((prev) => ({
        ...prev,
        userIds: [],
      }));
    }
  }, [formData.recipientType, users]);

  useEffect(() => {
    if (users.length > 0) {
      const sorted = [...users].sort((a, b) => {
        const aSelected = formData.userIds.includes(a._id);
        const bSelected = formData.userIds.includes(b._id);
        return bSelected - aSelected;
      });
      setSortedUsers(sorted);
    }
  }, [users, formData.userIds]);

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const user = users.find((u) => u._id === value);

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
        <span>{user?.full_name || label}</span>
      </Tag>
    );
  };

  const dropdownRender = (menu) => (
    <>
      {formData.userIds.length > 0 && (
        <div className="p-2 border-b border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 mb-1">
            Selected Users
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.userIds.map((userId) => {
              const user = users.find((u) => u._id === userId);
              if (!user) return null;
              return (
                <Tag
                  key={user._id}
                  closable
                  label={user.full_name}
                  onClose={(e) => {
                    e.stopPropagation();
                    handleChange(
                      "userIds",
                      formData.userIds.filter((id) => id !== user._id)
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
                  <span>{user.full_name}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      )}
      {menu}
    </>
  );

  useEffect(() => {
    const result = AddNotificationSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
    }
  }, [formData]);

  const handleChange = (name, value) => {
    if (name === "file") {
      const file = value;
      if (file) {
        setFormData((prev) => ({ ...prev, file }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, file: null }));
      }
    } else if (name === "recipientType") {
      setFormData((prev) => {
        const newUserIds =
          value === "all" && users.length > 0
            ? users.map((user) => user._id)
            : [];
        return {
          ...prev,
          recipientType: value,
          userIds: newUserIds,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    try {
      const validationData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        recipient_type: formData.recipientType,
        userIds: formData.userIds,
        file: formData.file,
      };

      const result = AddNotificationSchema.safeParse(validationData);

      if (!result.success) {
        const newErrors = Object.fromEntries(
          result.error.errors.map((err) => {
            const fieldName =
              err.path[0] === "recipient_type" ? "recipientType" : err.path[0];
            return [fieldName, err.message];
          })
        );
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof z.ZodError) {
        const newErrors = Object.fromEntries(
          error.errors.map((err) => {
            const fieldName =
              err.path[0] === "recipient_type" ? "recipientType" : err.path[0];
            return [fieldName, err.message];
          })
        );
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorNotify("Please fix the errors in the form");
      return;
    }

    try {
      const userIds =
        formData.recipientType === "all"
          ? users.map((user) => user._id)
          : formData.userIds;

      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        JSON.stringify({
          title: formData.title,
          message: formData.message,
          recipient_type: formData.recipientType,
          userIds: userIds,
        })
      );

      if (formData.file) {
        formDataToSend.append("single", formData.file);
      }

      const response = await addNotification(formDataToSend).unwrap();
      setIsModalVisible(true);
      dispatch(addNewNotificationToList(response.data));

      setFormData({
        title: "",
        message: "",
        recipientType: "all",
        userIds: users.map((user) => user._id),
        file: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Full error details:", {
        status: error.status,
        data: error.data,
        originalError: error,
      });

      if (error.data?.errorMessages) {
        const apiErrors = Object.fromEntries(
          error.data.errorMessages.map((err) => [
            err.path.split(".")[0],
            err.message,
          ])
        );
        setErrors(apiErrors);
        error.data.errorMessages.forEach((err) => {
          errorNotify(`${err.path}: ${err.message}`);
        });
      } else {
        errorNotify(error.data?.message || "Failed to send notification");
      }
    }
  };

  const handleModalOk = async () => {
    setIsModalVisible(false);
    try {
      navigate("/notification");
    } catch (error) {
      console.error("Error refetching notifications:", error);
      navigate("/notification");
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

  const isFormValid =
    formData.title.trim() &&
    formData.message.trim() &&
    formData.recipientType &&
    (formData.recipientType === "all" ||
      (formData.recipientType === "custom" && formData.userIds.length > 0)) &&
    formData.file !== null;

  return {
    isModalVisible,
    isLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    handleFileDelete,
    isFormValid,
    errors,
    formData,
    imagePreview,
    typeError,
    isUsersLoading,
    sortedUsers,
    tagRender,
    dropdownRender,
    fileInputRef,
  };
};
