import { createSlice } from "@reduxjs/toolkit";
import { setPaginatedDataFromApi } from "../../redux-rtk/utils/reduxHelper";

const initialState = {
  activeBusinesses: {
    dataList: [],
    data: {},
    meta: {
      total_items: 0,
      total_pages: 1,
      current_page: 1,
      page_size: 10,
      has_next_page: false,
      has_previous_page: false,
    },
  },
  pendingBusinesses: {
    dataList: [],
    data: {},
    meta: {
      total_items: 0,
      total_pages: 1,
      current_page: 1,
      page_size: 10,
      has_next_page: false,
      has_previous_page: false,
    },
  },
  selectedBusiness: null,
  isConfirmModalOpen: false,
  confirmModalType: null,
  activeTab: "active",
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setActiveBusinessData: (state, action) => {
      const { data, meta } = action.payload;
      const result = setPaginatedDataFromApi({
        incomingData: data,
        incomingMeta: meta,
        existingData: state.activeBusinesses.data,
        existingMeta: state.activeBusinesses.meta,
      });

      state.activeBusinesses.meta = result.meta;
      state.activeBusinesses.data = result.data;
      state.activeBusinesses.dataList = result.dataList;
    },

    setPendingBusinessData: (state, action) => {
      const { data, meta } = action.payload;
      const result = setPaginatedDataFromApi({
        incomingData: data,
        incomingMeta: meta,
        existingData: state.pendingBusinesses.data,
        existingMeta: state.pendingBusinesses.meta,
      });

      state.pendingBusinesses.meta = result.meta;
      state.pendingBusinesses.data = result.data;
      state.pendingBusinesses.dataList = result.dataList;
    },

    approveBusiness: (state, action) => {
      const businessId = action.payload;

      // Find the business in pending list
      const businessToApprove = state.pendingBusinesses.dataList.find(
        (b) => b._id === businessId,
      );

      if (businessToApprove) {
        // Update status to active
        const approvedBusiness = {
          ...businessToApprove,
          status: "active",
        };

        // Remove from pending
        state.pendingBusinesses.dataList =
          state.pendingBusinesses.dataList.filter((b) => b._id !== businessId);
        state.pendingBusinesses.meta.total_items -= 1;

        // Add to active
        state.activeBusinesses.dataList.unshift(approvedBusiness);
        state.activeBusinesses.meta.total_items += 1;

        // Update data objects
        Object.keys(state.pendingBusinesses.data).forEach((page) => {
          state.pendingBusinesses.data[page] = state.pendingBusinesses.data[
            page
          ].filter((b) => b._id !== businessId);
        });

        if (state.activeBusinesses.data["1"]) {
          state.activeBusinesses.data["1"].unshift(approvedBusiness);
        } else {
          state.activeBusinesses.data["1"] = [approvedBusiness];
        }
      }
    },

    deleteBusiness: (state, action) => {
      const businessId = action.payload;

      // Remove from pending list
      state.pendingBusinesses.dataList =
        state.pendingBusinesses.dataList.filter((b) => b._id !== businessId);
      state.pendingBusinesses.meta.total_items -= 1;

      // Update data objects
      Object.keys(state.pendingBusinesses.data).forEach((page) => {
        state.pendingBusinesses.data[page] = state.pendingBusinesses.data[
          page
        ].filter((b) => b._id !== businessId);
      });
    },

    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },

    openConfirmModal: (state, action) => {
      state.isConfirmModalOpen = true;
      state.selectedBusiness = action.payload.business;
      state.confirmModalType = action.payload.type; // 'approve' or 'delete'
    },

    closeConfirmModal: (state) => {
      state.isConfirmModalOpen = false;
      state.selectedBusiness = null;
      state.confirmModalType = null;
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export default businessSlice.reducer;
export const {
  setActiveBusinessData,
  setPendingBusinessData,
  approveBusiness,
  deleteBusiness,
  setSelectedBusiness,
  openConfirmModal,
  closeConfirmModal,
  setActiveTab,
} = businessSlice.actions;
