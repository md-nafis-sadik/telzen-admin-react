import { Select, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import PhoneInput from "react-phone-input-2";

function UpdateSellerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Seller Name is required";
    if (!formData.email) newErrors.email = "Seller Email is required";
    if (!formData.phone) newErrors.phone = "Seller Phone is required";
    if (!formData.role) newErrors.role = "Seller Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.role &&
    !isNaN(formData.phone) &&
    Object.keys(errors).length === 0 &&
    !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      message.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically call your API to create the package
      // await createPackage(formData);

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error adding seller:", error);
      message.error("Failed to add seller. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/sellers");
  };

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/sellers" title="Add Seller"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Plan */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Seller Name</span>
              <input
                type="text"
                placeholder="Enter data limit"
                className={`w-full border placeholder:text-disabled ${
                  errors.name ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Plan */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Email</span>
              <input
                type="email"
                placeholder="Enter email"
                className={`w-full border placeholder:text-disabled ${
                  errors.email ? "border-red-500" : "border-natural-400"
                } text-black rounded-lg outline-none py-3 px-4`}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Phone</span>
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={(phone) => handleChange("phone", phone)}
                inputProps={{
                  name: "phone",
                  required: true,
                  className: `!w-full !h-12 !rounded-lg !border ${
                    errors.phone ? "!border-red-500" : "border-natural-400"
                  } !text-black !rounded-lg !outline-none !py-3 !px-4 !pl-12`,
                }}
                inputStyle={{
                  width: "100%",
                  height: "3rem",
                  borderRadius: "0.5rem",
                  borderColor: errors.phone ? "#f87171" : "#d1d5db",
                }}
                containerStyle={{ width: "100%" }}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Package Type */}
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
                value={formData.role || null}
                onChange={(value) => handleChange("role", value)}
                status={errors.role ? "error" : ""}
              >
                <Select.Option value="data">Manager</Select.Option>
                <Select.Option value="voice">Customer Manager</Select.Option>
                <Select.Option value="combo">Sales Manager</Select.Option>
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
              onClick={() => navigate("/sellers")}
              className=" btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-black-700 hover:bg-neutral-100 hover:text-primaryColor hover:border-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={!isFormValid}
              // disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Seller Update Successfully!"
      />
    </section>
  );
}

export default UpdateSellerForm;
