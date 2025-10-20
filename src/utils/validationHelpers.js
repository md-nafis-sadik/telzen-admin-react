import { errorNotify } from "./notify";

export const validateWithSchema = (schema, formData, setErrors) => {
  const result = schema.safeParse(formData);

  if (!result.success) {
    const newErrors = {};

    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      newErrors[path] = issue.message;
    });

    console.log("All errors:", newErrors);
    setErrors(newErrors);

    const firstError =
      result.error.issues[0]?.message || "Please fix the errors in the form";
    errorNotify(firstError);

    return null;
  }

  setErrors({});
  return result.data;
};

export const createFormValidator = (
  schema,
  formData,
  additionalCondition = true
) => {
  if (!additionalCondition) return false;
  const result = schema.safeParse(formData);
  return result.success;
};

export const clearFieldError = (name, errors, setErrors) => {
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }
};


export const clearNestedErrors = (name, setErrors) => {
  setErrors((prev) => {
    const newErrors = { ...prev };

    if (newErrors[name]) {
      delete newErrors[name];
    }

    if (name.includes(".")) {
      const parent = name.split(".")[0];

      if (newErrors[parent]) {
        delete newErrors[parent];
      }
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(parent + ".")) {
          delete newErrors[key];
        }
      });
    }

    return newErrors;
  });
};


export const createDiscountToggleHandler = (formData, updateFormData) => {
  return (isFixed) => {
    const updatedFormData = {
      ...formData,
      discount_on_selling_price: {
        ...formData.discount_on_selling_price,
        is_type_percentage: !isFixed,
        amount: "",
      },
    };
    updateFormData(updatedFormData);
  };
};
