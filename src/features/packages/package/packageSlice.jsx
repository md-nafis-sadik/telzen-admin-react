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
  data: {},
  selectedData: null,
  availablePackages: [],
  // Cache packages by coverage type
  cachedPackages: {
    country: [],
    region: [],
  },
  isConfirmModalOpen: false,
  // Add form state
  addFormState: {
    packageType: "country",
    selectedPackageCode: null,
    selectedPackageData: null,
    formData: {
      name: "",
      type: "data",
      data_plan_in_mb: "",
      bonus_data_plan_in_mb: "",
      validity: { amount: "", type: "day" },
      status: "active",
      coverage_countries: [],
      coverage_regions: [],
      retail_price: { USD: "" },
      selling_price: { USD: "" },
      is_auto_renew_available: false,
      discount_on_selling_price: { amount: "", is_type_percentage: true },
      package_code: "",
      coverage_type: "country",
      slug: "",
    },
  },
  // Add form data for edit package
  editFormData: {
    id: "",
    name: "",
    type: "data",
    data_plan_in_mb: "",
    bonus_data_plan_in_mb: "",
    validity: { amount: "", type: "day" },
    status: "active",
    coverage_countries: [],
    coverage_regions: [],
    retail_price: { USD: "" },
    selling_price: { USD: "" },
    // vat_on_selling_price: { amount: "", is_type_percentage: true },
    discount_on_selling_price: { amount: "", is_type_percentage: true },
    is_auto_renew_available: true,
    note: "",
    slug: "",
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

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackageDataList: (state, action) => {
      state.dataList = action.payload.data;
    },

    setPackageData: (state, action) => {
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

    addNewPackageToList: (state, action) => {
      const newPackage = {
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
        newItem: newPackage,
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

    updatePackageInList: (state, action) => {
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

    removePackageFromList: (state, action) => {
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

    setPackageMetaData: (state, action) => {
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

    setSelectedPackageData: (state, action) => {
      state.selectedData = action.payload;
    },
    // Reset selectedData when needed
    clearSelectedPackageData: (state) => {
      state.selectedData = null;
    },
    // Add the missing confirmation modal action
    setPackageConfirmationModal: (state, action) => {
      state.isConfirmModalOpen = action.payload;
    },
    // Set available packages for add package form
    setAvailablePackages: (state, action) => {
      state.availablePackages = action.payload;
    },
    // Set cached packages for specific coverage type
    setCachedPackages: (state, action) => {
      const { coverageType, packages } = action.payload;
      state.cachedPackages[coverageType] = packages;
      // Also update availablePackages if this is the current package type
      if (state.addFormState.packageType === coverageType) {
        state.availablePackages = packages;
      }
    },
    // Add form state management
    setAddFormPackageType: (state, action) => {
      state.addFormState.packageType = action.payload;
      // Reset selection when package type changes
      state.addFormState.selectedPackageCode = null;
      state.addFormState.selectedPackageData = null;
      // Use cached packages if available, otherwise clear
      const cachedPackages = state.cachedPackages[action.payload] || [];
      state.availablePackages = cachedPackages;
      // Reset form data to initial state with new coverage type
      state.addFormState.formData = {
        name: "",
        type: "data",
        data_plan_in_mb: "",
        bonus_data_plan_in_mb: "",
        validity: { amount: "", type: "day" },
        status: "active",
        coverage_countries: [],
        coverage_regions: [],
        retail_price: { USD: "" },
        selling_price: { USD: "" },
        is_auto_renew_available: false,
        discount_on_selling_price: { amount: "", is_type_percentage: true },
        package_code: "",
        coverage_type: action.payload,
        slug: "",
      };
    },
    setAddFormSelectedPackage: (state, action) => {
      const { packageCode, packageData } = action.payload;
      state.addFormState.selectedPackageCode = packageCode;
      state.addFormState.selectedPackageData = packageData;

      if (packageData) {
        // Auto-populate form data from selected package
        state.addFormState.formData = {
          ...state.addFormState.formData,
          name: packageData.name || "",
          data_plan_in_mb: packageData.data_plan_in_mb || "",
          validity: {
            amount: packageData.validity?.amount || "",
            type: packageData.validity?.type || "day",
          },
          retail_price: { USD: packageData.retail_price || "" },
          package_code: packageData.package_code || "",
          slug: packageData.slug || "",
        };
      }
    },
    setAddFormData: (state, action) => {
      state.addFormState.formData = {
        ...state.addFormState.formData,
        ...action.payload,
      };
    },
    resetAddFormState: (state) => {
      state.addFormState = {
        packageType: "country",
        selectedPackageCode: null,
        selectedPackageData: null,
        formData: {
          name: "",
          type: "data",
          data_plan_in_mb: "",
          bonus_data_plan_in_mb: "",
          validity: { amount: "", type: "day" },
          status: "active",
          coverage_countries: [],
          coverage_regions: [],
          retail_price: { USD: "" },
          selling_price: { USD: "" },
          is_auto_renew_available: false,
          discount_on_selling_price: { amount: "", is_type_percentage: true },
          package_code: "",
          coverage_type: "country",
          slug: "",
        },
      };
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
        type: "data",
        data_plan_in_mb: "",
        bonus_data_plan_in_mb: "",
        validity: { amount: "", type: "day" },
        status: "active",
        coverage_countries: [],
        coverage_regions: [],
        retail_price: { USD: "" },
        selling_price: { USD: "" },
        // vat_on_selling_price: { amount: "", is_type_percentage: true },
        discount_on_selling_price: { amount: "", is_type_percentage: true },
        is_auto_renew_available: true,
        note: "",
        slug: "",
      };
    },
  },
});

export const {
  setPackageDataList,
  setPackageData,
  addNewPackageToList,
  updatePackageInList,
  removePackageFromList,
  setPackageMetaData,

  setSelectedPackageData,
  clearSelectedPackageData,
  setPackageConfirmationModal,
  setAvailablePackages,
  setCachedPackages,
  setEditFormData,
  resetEditFormData,
  setAddFormPackageType,
  setAddFormSelectedPackage,
  setAddFormData,
  resetAddFormState,
} = packageSlice.actions;
export default packageSlice.reducer;
