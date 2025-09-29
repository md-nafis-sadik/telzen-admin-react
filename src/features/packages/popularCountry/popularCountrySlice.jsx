import { createSlice } from "@reduxjs/toolkit";
import {
  prependNewDataToPaginatedList, // Changed from appendNewDataToPaginatedList
  removeDataFromPaginatedList,
  setPaginatedDataFromApi,
  updateDataInDataList,
  updateDataInPaginatedPages,
} from "../../../redux-rtk/utils/reduxHelper";

const initialState = {
  dataList: [],
  selectedFeatureCountries: [],
  data: {},
  selectedData: null,
  isConfirmModalOpen: false,

  meta: {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    page_size: 10,
    has_next_page: false,
    has_previous_page: false,
  },
};

const popularCountrySlice = createSlice({
  name: "popularCountry",
  initialState,
  reducers: {
    setPopularCountryDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setPopularCountryData: (state, action) => {
      const { data, meta } = action.payload;
      const result = setPaginatedDataFromApi({
        incomingData: data,
        incomingMeta: meta,
        existingData: state.data,
        existingMeta: state.meta,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;
    },

    addNewPopularCountryToList: (state, action) => {
      const newPopularCountry = {
        ...action.payload,
        rankingNumber: 1, // Since it's being added at the top, it gets rank 1
        totalPrizeGiven: 0,
        totalRevenue: 0,
        ticketSold: 0,
      };

      const result = prependNewDataToPaginatedList({
        // Changed to prepend
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newPopularCountry,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;

      // Update ranking numbers for all items after adding new one at the top
      const updatedData = {};
      for (let i = 1; i <= result.meta.total_pages; i++) {
        const pageKey = `page${i}`;
        if (result.data[pageKey]) {
          updatedData[pageKey] = result.data[pageKey].map((item, index) => ({
            ...item,
            rankingNumber: (i - 1) * state.meta.page_size + index + 1,
          }));
        }
      }

      state.data = updatedData;
      // Update current page data with new ranking numbers
      const current_pageKey = `page${state.meta.current_page}`;
      state.dataList = updatedData[current_pageKey] || [];
    },

    updatePopularCountryInList: (state, action) => {
      state.dataList = updateDataInDataList({
        dataList: state.dataList,
        updatedItem: action.payload,
      });

      state.data = updateDataInPaginatedPages({
        data: state.data,
        meta: state.meta,
        updatedItem: action.payload,
      });
    },

    removePopularCountryFromList: (state, action) => {
      const result = removeDataFromPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        idToRemove: action.payload._id,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;

      // Update ranking numbers for all remaining items
      const updatedData = {};
      for (let i = 1; i <= result.meta.total_pages; i++) {
        const pageKey = `page${i}`;
        if (result.data[pageKey]) {
          updatedData[pageKey] = result.data[pageKey].map((item, index) => ({
            ...item,
            rankingNumber: (i - 1) * state.meta.page_size + index + 1,
          }));
        }
      }

      state.data = updatedData;
      // Update current page data with new ranking numbers
      const current_pageKey = `page${state.meta.current_page}`;
      state.dataList = updatedData[current_pageKey] || [];
    },

    removeCountryFromFeatureList: (state, action) => {
      const { popularCountryId, countryId } = action.payload;

      // Find the popular country in dataList
      const updatedDataList = state.dataList.map((popularCountry) => {
        if (popularCountry._id === popularCountryId) {
          return {
            ...popularCountry,
            feature_countries: popularCountry.feature_countries.filter(
              (country) => country._id !== countryId
            ),
            total_feature_countries:
              popularCountry.feature_countries.length - 1,
          };
        }
        return popularCountry;
      });

      // Update the paginated data
      const updatedData = {};
      Object.keys(state.data).forEach((page) => {
        updatedData[page] = state.data[page].map((popularCountry) => {
          if (popularCountry._id === popularCountryId) {
            return {
              ...popularCountry,
              feature_countries: popularCountry.feature_countries.filter(
                (country) => country._id !== countryId
              ),
              total_feature_countries:
                popularCountry.feature_countries.length - 1,
            };
          }
          return popularCountry;
        });
      });

      state.dataList = updatedDataList;
      state.data = updatedData;
    },

    setPopularCountryMetaData: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
      const updateKey = Object.keys(action.payload)[0];

      if (updateKey === "current_page") {
        state.dataList = state.data[`page${action.payload.current_page}`] || [];
      }

      if (updateKey === "page_size") {
        state.meta = { ...state.meta, page_size: action.payload.page_size };

        // When page size changes, we need to reorganize all data
        let allItems = [];
        for (let i = 1; i <= state.meta.total_pages; i++) {
          const pageKey = `page${i}`;
          if (state.data[pageKey]) {
            allItems = allItems.concat(state.data[pageKey]);
          }
        }

        // Recalculate pagination with new page size
        const newPageSize = action.payload.page_size;
        const newTotalPages = Math.ceil(allItems.length / newPageSize);
        const updatedData = {};

        for (let i = 0; i < newTotalPages; i++) {
          const pageKey = `page${i + 1}`;
          updatedData[pageKey] = allItems.slice(
            i * newPageSize,
            (i + 1) * newPageSize
          );
        }

        state.data = updatedData;
        state.meta.total_pages = newTotalPages;
        state.meta.current_page = Math.min(
          state.meta.current_page,
          newTotalPages
        );

        // Update current page data
        const current_pageKey = `page${state.meta.current_page}`;
        state.dataList = updatedData[current_pageKey] || [];
      }
    },

    setSelectedPopularCountryData: (state, action) => {
      state.selectedData = action.payload;
    },

    clearSelectedPopularCountryData: (state) => {
      state.selectedData = null;
    },

    reorderCountries: (state, action) => {
      const { popularCountryId, orderedCountries } = action.payload;

      state.dataList = state.dataList.map((country) => {
        if (country._id === popularCountryId) {
          return {
            ...country,
            feature_countries: orderedCountries,
          };
        }
        return country;
      });

      for (const page in state.data) {
        state.data[page] = state.data[page].map((country) => {
          if (country._id === popularCountryId) {
            return {
              ...country,
              feature_countries: orderedCountries,
            };
          }
          return country;
        });
      }
    },

    setSelectedFeatureCountries: (state, action) => {
      state.selectedFeatureCountries = action.payload;
    },

    // Add the missing confirmation modal action
    setPopularCountryConfirmationModal: (state, action) => {
      state.isConfirmModalOpen = action.payload;
    },
  },
});

export const {
  setPopularCountryDataList,
  setPopularCountryData,
  addNewPopularCountryToList,
  updatePopularCountryInList,
  removePopularCountryFromList,
  setPopularCountryMetaData,
  setSelectedPopularCountryData,
  setPopularCountryConfirmationModal,
  clearSelectedPopularCountryData,
  reorderCountries,
  setSelectedFeatureCountries,
  removeCountryFromFeatureList,
} = popularCountrySlice.actions;
export default popularCountrySlice.reducer;
