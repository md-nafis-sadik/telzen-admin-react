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
  data: {},
  selectedData: null,
  isConfirmModalOpen: false,
  editFormData: {
    id: "",
    code: "",
    name: "",
    region: "",
    image: "",
  },
  meta: {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    page_size: 10,
    has_next_page: false,
    has_previous_page: false,
  },
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountryDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setCountryData: (state, action) => {
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

    addNewCountryToList: (state, action) => {
      const newCountry = {
        ...action.payload,
        rankingNumber: 1,
      };

      const result = prependNewDataToPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newCountry,
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
      state.dataList = updatedData[`page${state.meta.current_page}`] || [];
    },

    updateCountryInList: (state, action) => {
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

    removeCountryFromList: (state, action) => {
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
      state.dataList = updatedData[`page${state.meta.current_page}`] || [];
    },

    setCountryMetaData: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
      const updateKey = Object.keys(action.payload)[0];

      if (updateKey === "current_page") {
        state.dataList = state.data[`page${action.payload.current_page}`] || [];
      }

      if (updateKey === "page_size") {
        const newPageSize = action.payload.page_size;
        let allItems = [];
        for (let i = 1; i <= state.meta.total_pages; i++) {
          const pageKey = `page${i}`;
          if (state.data[pageKey])
            allItems = allItems.concat(state.data[pageKey]);
        }

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
        state.dataList = updatedData[`page${state.meta.current_page}`] || [];
      }
    },

    setSelectedCountryData: (state, action) => {
      state.selectedData = action.payload;
    },
    clearSelectedCountryData: (state) => {
      state.selectedData = null;
    },
    reorderCountries: (state, action) => {
      state.dataList = action.payload;
    },

    setEditFormData: (state, action) => {
      state.editFormData = action.payload;
    },

    resetEditFormData: (state) => {
      state.editFormData = {
        id: "",
        code: "",
        name: "",
        region: "",
        image: "",
      };
    },
  },
});

export const {
  setCountryDataList,
  setCountryData,
  addNewCountryToList,
  updateCountryInList,
  removeCountryFromList,
  setCountryMetaData,
  setSelectedCountryData,
  clearSelectedCountryData,
  reorderCountries,
  setEditFormData,
  resetEditFormData,
} = countrySlice.actions;
export default countrySlice.reducer;
