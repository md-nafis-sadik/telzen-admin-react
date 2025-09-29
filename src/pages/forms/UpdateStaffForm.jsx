import { Select, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import PhoneInput from "react-phone-input-2";
import { useUpdateStaff } from "../../hooks/features/useStaffs";
import NotifyContainer from "../../utils/notify";

function UpdateStaffForm() {
  const {
    isModalVisible,
    isLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    setErrors,
    setFormData,
  } = useUpdateStaff();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/staffs" title="Update Staff"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Staff Name</span>
              <input
                type="text"
                placeholder="Enter name here"
                className={`w-full border placeholder:text-disabled ${
                  errors.name ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.name}
                onChange={(e) => handleChange(e)}
                name="name"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* ID */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">Staff Id</span>
              <input
                type="text"
                placeholder="Enter name here"
                className={`w-full border placeholder:text-disabled ${errors.admin_id ? "border-red-500" : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.admin_id}
                onChange={(e) => handleChange(e)}
                name="admin_id"
              />
              {errors.admin_id && (
                <span className="text-red-500 text-sm">{errors.admin_id}</span>
              )}
            </div> */}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Email</span>
              <input
                type="email"
                placeholder="Enter email here"
                className={`w-full border placeholder:text-disabled cursor-not-allowed ${
                  errors.email ? "border-red-500" : "border-natural-400"
                } text-black rounded-lg outline-none py-3 px-4`}
                value={formData.email}
                onChange={(e) => handleChange(e)}
                name="email"
                disabled={!!formData.email}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Phone</span>
              <PhoneInput
                country={"us"} // Default to Bangladesh
                value={formData.phone}
                onChange={(phone, country) => {
                  const formattedPhone = phone.startsWith("+")
                    ? phone
                    : `+${phone}`;

                  setFormData((prev) => ({
                    ...prev,
                    phone: formattedPhone,
                    country: {
                      code: country.countryCode.toUpperCase(),
                      name: country.name,
                      dial_code: `+${country.dialCode}`,
                    },
                  }));

                  if (errors.phone) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.phone;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Enter phone number"
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  paddingLeft: "48px",
                  borderRadius: "8px",
                  borderColor: errors.phone ? "#ef4444" : "#BDBDBD",
                  fontSize: "15px",
                  color: "#4f4f4f",
                }}
                buttonStyle={{
                  border: "none",
                  background: "transparent",
                  borderRadius: "50%",
                  marginLeft: "10px",
                  boxShadow: "none",
                  padding: "0px 0px 0px 0px",
                }}
                containerStyle={{ width: "100%" }}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Role</span>
              <Select
                className={`w-full border ${
                  errors.role ? "!border-red-500" : "border-natural-400"
                } rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                placeholder="Select role"
                value={formData.role}
                onChange={(value) =>
                  handleChange({
                    target: {
                      name: "role",
                      value: value,
                    },
                  })
                }
                status={errors.role ? "error" : ""}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer-manager">
                  Customer Manager
                </Select.Option>
                <Select.Option value="sales-manager">
                  Sales Manager
                </Select.Option>
              </Select>
              {errors.role && (
                <span className="text-red-500 text-sm">{errors.role}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/staffs")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-black-700 hover:bg-neutral-100 hover:text-primaryColor hover:border-black"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 py-2 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Staff Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdateStaffForm;
