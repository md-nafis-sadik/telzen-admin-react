import { Tag } from "antd";
import { useCallback, useMemo } from "react";
import ReactCountryFlag from "react-country-flag";

export const finalPriceFn = ({ formData }) =>
  useMemo(() => {
    const baseUSD = parseFloat(formData.selling_price.USD || 0);
    const discountAmount = parseFloat(
      formData.discount_on_selling_price.amount || 0
    );

    let priceAfterDiscountUSD = baseUSD;
    let finalUSD = baseUSD;

    if (formData.discount_on_selling_price.is_type_percentage) {
      priceAfterDiscountUSD = baseUSD - (baseUSD * discountAmount) / 100;
    } else {
      const maxDiscount = Math.min(discountAmount, baseUSD);
      priceAfterDiscountUSD = baseUSD - maxDiscount;
    }

    finalUSD = priceAfterDiscountUSD;

    return {
      finalUSD: Math.max(0, finalUSD).toFixed(2),
      priceAfterDiscountUSD: Math.max(0, priceAfterDiscountUSD).toFixed(2),
    };
  }, [
    formData.selling_price.USD,
    formData.discount_on_selling_price.amount,
    formData.discount_on_selling_price.is_type_percentage,
  ]);

export const tagRenderFn = ({ countries }) =>
  useCallback(
    (props) => {
      const { label, value, closable, onClose } = props;
      const country = countries.find((c) => c._id === value) || {
        code: "",
        name: label,
      };

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
          <span>{label}</span>
        </Tag>
      );
    },
    [countries]
  );

export const dropdownRenderFn = ({ formData, countries, handleChange }) =>
  useCallback(
    (menu) => {
      return (
        <>
          {formData.coverage_countries.length > 0 && (
            <div className="p-2 border-b border-neutral-200">
              <div className="text-xs font-medium text-neutral-500 mb-1">
                Selected Countries
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.coverage_countries.map((countryId) => {
                  const country = countries.find((c) => c._id === countryId);
                  if (!country) return null;
                  return (
                    <Tag
                      key={country._id}
                      closable
                      onClose={(e) => {
                        e.stopPropagation();
                        handleChange(
                          "coverage_countries",
                          formData.coverage_countries.filter(
                            (id) => id !== country._id
                          )
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
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{ width: "16px", height: "12px" }}
                      />
                      <span>{country.name}</span>
                    </Tag>
                  );
                })}
              </div>
            </div>
          )}
          {menu}
        </>
      );
    },
    [formData.coverage_countries, countries, handleChange]
  );
