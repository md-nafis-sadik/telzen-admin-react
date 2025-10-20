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

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setNotificationData: (state, action) => {
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

    addNewNotificationToList: (state, action) => {
      const newNotification = {
        ...action.payload,
        rankingNumber: 1,
        totalPrizeGiven: 0,
        totalRevenue: 0,
        ticketSold: 0,
      };

      const result = prependNewDataToPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newNotification,
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

    updateNotificationInList: (state, action) => {
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

    removeNotificationFromList: (state, action) => {
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

    setNotificationMetaData: (state, action) => {
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

    setSelectedNotificationData: (state, action) => {
      state.selectedData = action.payload;
    },

    clearSelectedNotificationData: (state) => {
      state.selectedData = null;
    },

    setNotificationConfirmationModal: (state, action) => {
      state.isConfirmModalOpen = action.payload;
    },
  },
});

export const {
  setNotificationDataList,
  setNotificationData,
  addNewNotificationToList,
  updateNotificationInList,
  removeNotificationFromList,
  setNotificationMetaData,

  setSelectedNotificationData,
  clearSelectedNotificationData,
  setNotificationConfirmationModal,
} = notificationSlice.actions;
export default notificationSlice.reducer;
