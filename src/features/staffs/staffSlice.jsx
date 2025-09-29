import { createSlice } from "@reduxjs/toolkit";
import {
  prependNewDataToPaginatedList, // Changed from appendNewDataToPaginatedList
  removeDataFromPaginatedList,
  setPaginatedDataFromApi,
  updateDataInDataList,
  updateDataInPaginatedPages,
} from "../../redux-rtk/utils/reduxHelper";

const initialState = {
  dataList: [],
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

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setStaffData: (state, action) => {
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

    addNewStaffToList: (state, action) => {
      const newStaff = {
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
        newItem: newStaff,
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

    updateStaffInList: (state, action) => {
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

    removeStaffFromList: (state, action) => {
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

    setStaffMetaData: (state, action) => {
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
    /* ============ End data setup ============ */

    setSelectedStaffData: (state, action) => {
      state.selectedData = action.payload;
    },
    // Reset selectedData when needed
    clearSelectedStaffData: (state) => {
      state.selectedData = null;
    },
    // Add the missing confirmation modal action
    setStaffConfirmationModal: (state, action) => {
      state.isConfirmModalOpen = action.payload;
    },
  },
});

export const {
  setStaffDataList,
  setStaffData,
  addNewStaffToList,
  updateStaffInList,
  removeStaffFromList,
  setStaffMetaData,

  setSelectedStaffData,
  clearSelectedStaffData,
  setStaffConfirmationModal,
} = staffSlice.actions;
export default staffSlice.reducer;
