import { errorNotify } from "./notify";

/**
 * Handles validation using Zod schema and sets errors
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} formData - Data to validate
 * @param {Function} setErrors - Function to set errors
 * @returns {Object|null} - Returns validated data if successful, null if validation fails
 */
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

/**
 * Creates a form validation memoized function
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} formData - Form data to validate
 * @param {any} additionalCondition - Additional condition to check (optional)
 * @returns {boolean} - Whether the form is valid
 */
export const createFormValidator = (
  schema,
  formData,
  additionalCondition = true
) => {
  if (!additionalCondition) return false;
  const result = schema.safeParse(formData);
  return result.success;
};

/**
 * Generic error handler for clearing field errors
 * @param {string} name - Field name
 * @param {Object} errors - Current errors object
 * @param {Function} setErrors - Function to set errors
 */
export const clearFieldError = (name, errors, setErrors) => {
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }
};

/**
 * Clears nested field errors (e.g., "parent.child")
 * @param {string} name - Field name (can be nested with dots)
 * @param {Function} setErrors - Function to set errors
 */
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

/**
 * Creates a discount type toggle handler
 * @param {Object} formData - Current form data
 * @param {Function} updateFormData - Function to update form data (dispatch action)
 * @returns {Function} - Toggle handler function
 */
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
