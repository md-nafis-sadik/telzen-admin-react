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
  // Edit form data for update region
  editFormData: {
    id: "",
    name: "",
    status: "active",
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

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setRegionDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setRegionData: (state, action) => {
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

    addNewRegionToList: (state, action) => {
      const newRegion = {
        ...action.payload,
        rankingNumber: 1, // top of the list
      };

      const result = prependNewDataToPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newRegion,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;

      // Update ranking numbers across all pages
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

    updateRegionInList: (state, action) => {
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

    removeRegionFromList: (state, action) => {
      const result = removeDataFromPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        idToRemove: action.payload._id,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;

      // Update ranking numbers
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

    setRegionMetaData: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
      const updateKey = Object.keys(action.payload)[0];

      if (updateKey === "current_page") {
        state.dataList = state.data[`page${action.payload.current_page}`] || [];
      }

      if (updateKey === "page_size") {
        const newPageSize = action.payload.page_size;
        state.meta.page_size = newPageSize;

        // Flatten all items and reorganize pagination
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
        const current_pageKey = `page${state.meta.current_page}`;
        state.dataList = updatedData[current_pageKey] || [];
      }
    },

    setSelectedRegionData: (state, action) => {
      state.selectedData = action.payload;
    },

    clearSelectedRegionData: (state) => {
      state.selectedData = null;
    },

    // Set edit form data
    setEditFormData: (state, action) => {
      state.editFormData = action.payload;
    },

    // Reset edit form data
    resetEditFormData: (state) => {
      state.editFormData = {
        id: "",
        name: "",
        status: "active",
        image: "",
      };
    },
  },
});

export const {
  setRegionDataList,
  setRegionData,
  addNewRegionToList,
  updateRegionInList,
  removeRegionFromList,
  setRegionMetaData,
  setSelectedRegionData,
  clearSelectedRegionData,
  setEditFormData,
  resetEditFormData,
} = regionSlice.actions;
export default regionSlice.reducer;
