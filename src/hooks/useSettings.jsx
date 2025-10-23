import { useEffect, useState } from "react";
import { errorNotify } from "../utils/notify";
import { useUpdateOwnProfileMutation } from "../features/auth/authApi";

export const useSettings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(true);

  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateOwnProfile, { isLoading }] = useUpdateOwnProfileMutation();

  useEffect(() => {
    const isDisabled =
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword;
    setBtnDisabled(isDisabled);
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your new password";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await updateOwnProfile({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();

      if (response.success) {
        setIsModalVisible(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Update failed:", error);

      if (error.status === 401) {
        setErrors({ apiError: "Current password is incorrect" });
        errorNotify("Current password is incorrect");
        return; 
      }

      if (error.data?.message) {
        setErrors({ apiError: error.data.message });
        errorNotify(error.data.message);
      } else {
        setErrors({ apiError: "Failed to update password. Please try again." });
      }
    }
    setIsSubmitting(false);
  };

  const handleModalOk = () => setIsModalVisible(false);

  return {
    isModalVisible,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    btnDisabled,
    isShowCurrentPassword,
    setIsShowCurrentPassword,
    isShowNewPassword,
    setIsShowNewPassword,
    isShowConfirmPassword,
    setIsShowConfirmPassword,
    isLoading,
    handleSubmit,
    handleModalOk,
    isSubmitting,
  };
};
