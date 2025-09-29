import { createSlice } from "@reduxjs/toolkit";
import {
  appendNewDataToPaginatedList,
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

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetailsDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setUserDetailsData: (state, action) => {
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

    addNewUserDetailsToList: (state, action) => {
      const newSeller = {
        ...action.payload,
        rankingNumber: state.meta.total_items + 1,
        totalPrizeGiven: 0,
        totalRevenue: 0,
        ticketSold: 0,
      };
      const result = appendNewDataToPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newSeller,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;
    },

    updateUserDetailsInList: (state, action) => {
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

    removeUserDetailsFromList: (state, action) => {
      const result = removeDataFromPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        idToRemove: action.payload._id,
      });

      state.meta = result.meta;
      state.data = result.data;
      state.dataList = result.dataList;
    },

    setUserDetailsMetaData: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
      const updateKey = Object.keys(action.payload)[0];
      if (updateKey === "current_page") {
        state.dataList = state.data[`page${action.payload.current_page}`] || [];
      }

      if (updateKey === "page_size")
        state.meta = { ...state.meta, page_size: action.payload.page_size };
    },
    /* ============ End data setup ============ */

    setSelectedUserDetailsData: (state, action) => {
      state.selectedData = action.payload;
    },
    // Reset selectedData when needed
    clearSelectedUserDetailsData: (state) => {
      state.selectedData = null;
    },
  },
});

export const {
  setUserDetailsDataList,
  setUserDetailsData,
  addNewUserDetailsToList,
  updateUserDetailsInList,
  removeUserDetailsFromList,
  setUserDetailsMetaData,

  setSelectedUserDetailsData,
  clearSelectedUserDetailsData,
  setUserDetailsConfirmationModal,
} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
