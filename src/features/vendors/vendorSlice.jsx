import { createSlice } from "@reduxjs/toolkit";
import { setPaginatedDataFromApi } from "../../redux-rtk/utils/reduxHelper";

const initialState = {
  activeVendors: {
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
  pendingVendors: {
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
  selectedVendor: null,
  isConfirmModalOpen: false,
  confirmModalType: null,
  activeTab: "active",
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setActiveVendorData: (state, action) => {
      const { data, meta } = action.payload;
      const result = setPaginatedDataFromApi({
        incomingData: data,
        incomingMeta: meta,
        existingData: state.activeVendors.data,
        existingMeta: state.activeVendors.meta,
      });

      state.activeVendors.meta = result.meta;
      state.activeVendors.data = result.data;
      state.activeVendors.dataList = result.dataList;
    },

    setPendingVendorData: (state, action) => {
      const { data, meta } = action.payload;
      const result = setPaginatedDataFromApi({
        incomingData: data,
        incomingMeta: meta,
        existingData: state.pendingVendors.data,
        existingMeta: state.pendingVendors.meta,
      });

      state.pendingVendors.meta = result.meta;
      state.pendingVendors.data = result.data;
      state.pendingVendors.dataList = result.dataList;
    },

    approveVendor: (state, action) => {
      const vendorId = action.payload;

      // Find the vendor in pending list
      const vendorToApprove = state.pendingVendors.dataList.find(
        (v) => v._id === vendorId,
      );

      if (vendorToApprove) {
        // Update status to active
        const approvedVendor = {
          ...vendorToApprove,
          status: "active",
        };

        // Remove from pending
        state.pendingVendors.dataList =
          state.pendingVendors.dataList.filter((v) => v._id !== vendorId);
        state.pendingVendors.meta.total_items -= 1;

        // Add to active
        state.activeVendors.dataList.unshift(approvedVendor);
        state.activeVendors.meta.total_items += 1;

        // Update data objects
        Object.keys(state.pendingVendors.data).forEach((page) => {
          state.pendingVendors.data[page] = state.pendingVendors.data[
            page
          ].filter((v) => v._id !== vendorId);
        });

        if (state.activeVendors.data["1"]) {
          state.activeVendors.data["1"].unshift(approvedVendor);
        } else {
          state.activeVendors.data["1"] = [approvedVendor];
        }
      }
    },

    deleteVendor: (state, action) => {
      const vendorId = action.payload;

      // Remove from pending list
      state.pendingVendors.dataList =
        state.pendingVendors.dataList.filter((v) => v._id !== vendorId);
      state.pendingVendors.meta.total_items -= 1;

      // Update data objects
      Object.keys(state.pendingVendors.data).forEach((page) => {
        state.pendingVendors.data[page] = state.pendingVendors.data[
          page
        ].filter((v) => v._id !== vendorId);
      });
    },

    setSelectedVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },

    openConfirmModal: (state, action) => {
      state.isConfirmModalOpen = true;
      state.selectedVendor = action.payload.vendor;
      state.confirmModalType = action.payload.type; // 'approve' or 'delete'
    },

    closeConfirmModal: (state) => {
      state.isConfirmModalOpen = false;
      state.selectedVendor = null;
      state.confirmModalType = null;
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export default vendorSlice.reducer;
export const {
  setActiveVendorData,
  setPendingVendorData,
  approveVendor,
  deleteVendor,
  setSelectedVendor,
  openConfirmModal,
  closeConfirmModal,
  setActiveTab,
} = vendorSlice.actions;
