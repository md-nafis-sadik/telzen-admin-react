import { Select } from "antd";
import NotifyContainer, { errorNotify } from "../../utils/getNotify";
import SuccessModal from "../../components/modals/SuccessModal";
import { NotificationDeleteIcon } from "../../utils/svgs";
import { useAddNotification } from "../../hooks/features/useNotifications";

function NotificationForm() {
  const {
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
  } = useAddNotification();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <span className="text-blackHigh">Title</span>
          <input
            type="text"
            placeholder="Title here"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`w-full border placeholder:text-disabled ${
              errors.title ? "border-red-500" : "border-natural-400"
            } text-blackLow rounded-lg outline-none py-3 px-4`}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title}</span>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <span className="text-blackHigh">Message</span>
          <input
            type="text"
            placeholder="Message body here"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className={`w-full border placeholder:text-disabled ${
              errors.message ? "border-red-500" : "border-natural-400"
            } text-blackLow rounded-lg outline-none py-3 px-4`}
          />
          {errors.message && (
            <span className="text-red-500 text-sm">{errors.message}</span>
          )}
        </div>

        {/* Recipient Type */}
        <div className="flex flex-col gap-1">
          <span className="text-blackHigh">Recipient Type</span>
          <Select
            className={`w-full border rounded-lg
                [&_.ant-select-selector]:!h-12
                [&_.ant-select-selector]:!px-4
                [&_.ant-select-selector]:!flex
                [&_.ant-select-selector]:!items-center
                [&_.ant-select-selector]:!leading-[3.5rem]`}
            value={formData.recipientType}
            onChange={(value) => handleChange("recipientType", value)}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1">
          <span className="text-blackHigh">Image</span>
          <div>
            <div className="w-full relative">
              <input
                type="file"
                id="imageId"
                className="absolute opacity-0"
                ref={fileInputRef}
                onChange={(e) => {
                  e.stopPropagation();
                  handleChange("file", e.target.files[0]);
                }}
              />
              <label
                htmlFor="imageId"
                className={`flex items-center gap-2 py-1.5 px-1.5 border ${
                  errors.file ? "border-red-500" : "border-slateLow"
                } rounded-lg cursor-pointer`}
              >
                {!imagePreview && (
                  <span className="inline-block px-4 py-2 bg-fadeColor text-white text-sm rounded-lg">
                    Choose File
                  </span>
                )}
                {!imagePreview ? (
                  <span className="text-xs text-blackSemi">Upload Image</span>
                ) : (
                  <span className="flex justify-between w-full items-center">
                    <span className="flex items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-9 h-9 rounded-sm bg-center object-cover"
                      />
                      <p className="text-blackSemi text-base whitespace-nowrap overflow-hidden text-ellipsis">
                        {formData.file?.name?.substring(0, 25)}
                      </p>
                    </span>
                    <button
                      type="button"
                      className="flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete();
                      }}
                    >
                      <NotificationDeleteIcon />
                    </button>
                  </span>
                )}
              </label>
            </div>
            {typeError && (
              <p className="text-xs text-errorColor mt-1 font-medium">
                Only JPG, JPEG or PNG file are supported
              </p>
            )}
            {errors.file && (
              <span className="text-red-500 text-sm">{errors.file}</span>
            )}
          </div>
        </div>

        {/* User Selection (only shown when custom is selected) */}
        {formData.recipientType === "custom" && (
          <div className="flex flex-col gap-1">
            <span className="text-blackHigh">Select Users</span>
            {isUsersLoading ? (
              <div className="w-full h-12 bg-neutral-100 rounded-lg animate-pulse" />
            ) : (
              <Select
                mode="multiple"
                className={`w-full border ${
                  errors.recipients ? "!border-red-500" : "border-natural-400"
                } rounded-lg
                    [&_.ant-select-selector]:!h-12
                    [&_.ant-select-selector]:!pr-4
                    [&_.ant-select-selector]:!pl-1
                    [&_.ant-select-selector]:!flex
                    [&_.ant-select-selector]:!items-center
                    [&_.ant-select-selector]:!leading-[3.5rem]`}
                placeholder="Select users"
                value={formData.recipients}
                onChange={(value) => handleChange("recipients", value)}
                loading={isUsersLoading}
                tagRender={tagRender}
                dropdownRender={dropdownRender}
                optionFilterProp="label"
                maxTagCount={2}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sortedUsers.map((user) => (
                  <Select.Option
                    key={user._id}
                    value={user._id}
                    label={user.name}
                  >
                    {user.name} ( {user.email} )
                  </Select.Option>
                ))}
              </Select>
            )}
            {errors.recipients && (
              <span className="text-red-500 text-sm">{errors.recipients}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`btn w-24 h-13 bg-black text-white hover:bg-black-900 hover:text-white uppercase ${
            isLoading || !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      <NotifyContainer />
      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Notification Sent Successfully!"
      />
    </form>
  );
}

export default NotificationForm;
