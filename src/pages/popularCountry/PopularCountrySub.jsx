import { useParams } from "react-router-dom";
import FormInput from "../../shared/forms/FormInput";
import { DeleteIcon, EditIcon, SearchSvg } from "../../utils/svgs";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import CustomTableDragable from "../../shared/custom/CustomTableDragable";
import React, { useState, useEffect, useMemo } from "react";
import { useGetPopularCountrys } from "../../hooks/features/usePopularCountries";

const PopularCountrySub = () => {
  const { Id } = useParams();
  const popularCountryId = Id;

  const {
    dataList,
    handleDelete,
    setCountryId,
    handleNavigate,
    handleReorderCountries,
    isLoading,
    isError,
    handleSaveOrder,
    setPopularCountryId,
    setDeleteCountryId,
  } = useGetPopularCountrys();

  const [searchKeyword, setSearchKeyword] = useState("");
  const selectedCountry = dataList.find(
    (country) => country._id === popularCountryId
  );
  const [featureCountries, setFeatureCountries] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      const countries = [...selectedCountry.feature_countries];
      setFeatureCountries(countries);
      setOriginalOrder(countries.map((country) => country._id));
    }
  }, [selectedCountry]);

  const filteredFeatureCountries = featureCountries.filter((country) =>
    country.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Calculate hasChanges by comparing current order with original order
  const hasChanges = useMemo(() => {
    if (featureCountries.length !== originalOrder.length) return true;
    return !featureCountries.every(
      (country, index) => country._id === originalOrder[index]
    );
  }, [featureCountries, originalOrder]);

  const handleDragEnd = (reorderedData) => {
    setFeatureCountries(reorderedData);
  };

  const handleSave = async () => {
    const featureCountryIds = featureCountries.map((country) => country._id);
    const success = await handleSaveOrder(popularCountryId, featureCountryIds);
    if (success) {
      setOriginalOrder(featureCountryIds);
    }
  };

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">
              {selectedCountry?.country_id?.name}
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search Country"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>
            </div>
          </div>

          <CustomTableDragable
            isLoading={isLoading}
            isError={isError}
            columns={["Sl ID", "Flag", "Popular Country", "Action"]}
            data={filteredFeatureCountries}
            dataLength={filteredFeatureCountries.length}
            onDragEnd={handleDragEnd}
            onSave={handleSave}
            hasChanges={hasChanges}
          >
            {filteredFeatureCountries.map((country, index) => (
              <React.Fragment key={country._id}>
                <td>{index + 1}</td>
                <td>
                  {country?.flag && (
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                  )}
                </td>
                <td>{country?.name}</td>
                <th className="py-3 w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    {/* <button
                      type="button"
                      onClick={() => handleNavigate(selectedCountry)}
                    >
                      <EditIcon />
                    </button> */}
                    <label
                      htmlFor="confirmationPopup"
                      className="cursor-pointer"
                      onClick={() => {
                        setDeleteCountryId(country._id);
                        setPopularCountryId(popularCountryId);
                      }}
                    >
                      <DeleteIcon />
                    </label>
                  </div>
                </th>
              </React.Fragment>
            ))}
          </CustomTableDragable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="country" />
      <NotifyContainer />
    </>
  );
};

export default PopularCountrySub;
