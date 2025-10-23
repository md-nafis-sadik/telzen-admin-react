import PasswordInput from "../../components/shared/ui/PasswordInput";
import SuccessModal from "../../components/modals/SuccessModal";
import NotifyContainer from "../../utils/getNotify";
import { useSettings } from "../../hooks/useSettings";

function SettingsForm() {
  const {
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
    isSubmitting
  } = useSettings();

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <label className="text-blackHigh">Current Password</label>
            <PasswordInput
              isShowPassword={isShowCurrentPassword}
              setIsShowPassword={setIsShowCurrentPassword}
              name="currentPassword"
              value={currentPassword}
              isShowIcon={true}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword}</p>
            )}
          </div>
        </div>
        <hr className="mt-6 mb-4" />
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-blackHigh">New Password</label>
            <PasswordInput
              isShowPassword={isShowNewPassword}
              setIsShowPassword={setIsShowNewPassword}
              name="newPassword"
              value={newPassword}
              isShowIcon={true}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-blackHigh">Confirm New Password</label>
            <PasswordInput
              isShowPassword={isShowConfirmPassword}
              setIsShowPassword={setIsShowConfirmPassword}
              name="confirmPassword"
              value={confirmPassword}
              isShowIcon={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          {errors.apiError && (
            <p className="text-red-500 mt-4 w-full p-4 bg-red-50 rounded-lg mb-4">
              {errors.apiError}
            </p>
          )}
          <button
            type="submit"
            disabled={btnDisabled || isLoading || isSubmitting}
            className="btn w-auto h-12 px-6 py-2 bg-black hover:bg-black-900 uppercase text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Password updated successfully!"
      />
      <NotifyContainer />
    </div>
  );
}

export default SettingsForm;
