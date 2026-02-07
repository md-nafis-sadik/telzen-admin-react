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
  availablePackages: [],
  cachedPackages: {
    country: [],
    region: [],
  },
  isConfirmModalOpen: false,
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
      selling_price: { USD: "", BDT: "" },
      is_auto_renew_available: false,
      discount_on_selling_price: { amount: "", is_type_percentage: true },
      on_purchase_reward_point: "",
      package_code: "",
      coverage_type: "country",
      slug: "",
    },
  },
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
    selling_price: { USD: "", BDT: "" },
    discount_on_selling_price: { amount: "", is_type_percentage: true },
    on_purchase_reward_point: "",
    is_auto_renew_available: true,
    // note: "",
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
        rankingNumber: 1,
        totalPrizeGiven: 0,
        totalRevenue: 0,
        ticketSold: 0,
      };

      const result = prependNewDataToPaginatedList({
        meta: state.meta,
        data: state.data,
        dataList: state.dataList,
        newItem: newPackage,
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

    setPackageMetaData: (state, action) => {
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

    setSelectedPackageData: (state, action) => {
      state.selectedData = action.payload;
    },
    clearSelectedPackageData: (state) => {
      state.selectedData = null;
    },
    setPackageConfirmationModal: (state, action) => {
      state.isConfirmModalOpen = action.payload;
    },
    setAvailablePackages: (state, action) => {
      state.availablePackages = action.payload;
    },
    setCachedPackages: (state, action) => {
      const { coverageType, packages } = action.payload;
      state.cachedPackages[coverageType] = packages;
      if (state.addFormState.packageType === coverageType) {
        state.availablePackages = packages;
      }
    },
    setAddFormPackageType: (state, action) => {
      state.addFormState.packageType = action.payload;
      state.addFormState.selectedPackageCode = null;
      state.addFormState.selectedPackageData = null;
      const cachedPackages = state.cachedPackages[action.payload] || [];
      state.availablePackages = cachedPackages;
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
        selling_price: { USD: "", BDT: "" },
        is_auto_renew_available: false,
        discount_on_selling_price: { amount: "", is_type_percentage: true },
        package_code: "",
        coverage_type: action.payload,
        on_purchase_reward_point: "",
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
          retail_price: { 
            USD: packageData.retail_price?.USD || packageData.retail_price || "",
          },
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
          selling_price: { USD: "", BDT: "" },
          is_auto_renew_available: false,
          discount_on_selling_price: { amount: "", is_type_percentage: true },
          on_purchase_reward_point: "",
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
        selling_price: { USD: "", BDT: "" },
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
