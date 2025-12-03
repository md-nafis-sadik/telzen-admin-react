import FormInput from "../../shared/forms/FormInput";
import { EyeSvgIcon, SearchSvg } from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import { useGetPopularCountrys } from "../../hooks/features/usePopularCountries";

const PopularCountry = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    searchKeyword,
    setSearchKeyword,
    updatePageMeta,
    handleDelete,
    setCountryId,
    handleNavigateSub,
    handleOpenAddPopularCountryModal,
    navigate,
  } = useGetPopularCountrys();

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">
              Popular Country
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
              <SecondaryButton
                text="Add Popular COUNTRY"
                width="w-max"
                onClick={() => handleOpenAddPopularCountryModal()}
              />
            </div>
          </div>

          <CustomTable
            isLoading={isLoading}
            isError={isError}
            status={status}
            current_page={meta?.current_page || 1}
            page_size={meta?.page_size || 1}
            total_pages={meta?.total_pages || 1}
            total_items={meta?.total_items || 0}
            updatePageMeta={updatePageMeta}
            columns={[
              "Sl",
              "Flag",
              "User’s Country",
              "Region Name",
              "Popular Countries",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((country, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={country._id}
              >
                <td>{country?.popular_country_id}</td>
                <td>
                  {country?.country_id?.flag && (
                    <img
                      src={country.country_id?.flag}
                      alt={country.country_id?.name}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                  )}
                </td>
                <td>{country?.country_id?.name}</td>
                <td>{country?.country_id?.region?.name || "-"}</td>
                <td>{country?.total_feature_countries || 0}</td>

                <th className="py-3  w-[120px] border-l border-natural-100">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/popular-country/${country._id}`)
                      }
                    >
                      <EyeSvgIcon />
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="country" />
      <NotifyContainer />
    </>
  );
};

export default PopularCountry;
