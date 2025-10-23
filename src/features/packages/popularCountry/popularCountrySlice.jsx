import { createSlice } from "@reduxjs/toolkit";
import {
  prependNewDataToPaginatedList,
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
      const incomingData = action.payload;
      
      let existingPageKey = null;
      let existingIndex = -1;
      
      existingIndex = state.dataList.findIndex(
        (item) => item._id === incomingData._id
      );
      
      if (existingIndex === -1) {
        for (const pageKey of Object.keys(state.data)) {
          const pageData = state.data[pageKey];
          const foundIndex = pageData.findIndex((item) => item._id === incomingData._id);
          if (foundIndex !== -1) {
            existingPageKey = pageKey;
            existingIndex = foundIndex;
            break;
          }
        }
      } else {
        existingPageKey = `page${state.meta.current_page}`;
      }

      if (existingIndex !== -1) {
        const updatedData = {};
        Object.keys(state.data).forEach((pageKey) => {
          updatedData[pageKey] = state.data[pageKey].map((item) => {
            if (item._id === incomingData._id) {
              return {
                ...item,
                ...incomingData,
              };
            }
            return item;
          });
        });
        state.data = updatedData;
        
        if (existingPageKey && existingPageKey !== `page${state.meta.current_page}`) {
          const targetPageNumber = parseInt(existingPageKey.replace('page', ''));
          state.meta.current_page = targetPageNumber;
          state.dataList = updatedData[existingPageKey] || [];
        } else {
          const currentPageKey = `page${state.meta.current_page}`;
          state.dataList = updatedData[currentPageKey] || [];
        }
      } else {
        const newPopularCountry = {
          ...incomingData,
          rankingNumber: 1,
          totalPrizeGiven: 0,
          totalRevenue: 0,
          ticketSold: 0,
        };

        const result = prependNewDataToPaginatedList({
          meta: state.meta,
          data: state.data,
          dataList: state.dataList,
          newItem: newPopularCountry,
        });

        state.meta = result.meta;
        state.data = result.data;
        state.dataList = result.dataList;

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
        const current_pageKey = `page${state.meta.current_page}`;
        state.dataList = updatedData[current_pageKey] || [];
      }
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
      const current_pageKey = `page${state.meta.current_page}`;
      state.dataList = updatedData[current_pageKey] || [];
    },

    removeCountryFromFeatureList: (state, action) => {
      const { popularCountryId, countryId } = action.payload;

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
        
        let allItems = [];
        for (let i = 1; i <= state.meta.total_pages; i++) {
          const pageKey = `page${i}`;
          if (state.data[pageKey]) {
            allItems = allItems.concat(state.data[pageKey]);
          }
        }

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
