// *prepend new data to paginated list (add at the beginning)
export const prependNewDataToPaginatedList = ({
  newItem,
  meta,
  data,
  dataList,
}) => {
  const { page_size, total_pages, current_page } = meta;
  let updatedData = { ...data };
  let updatedMeta = { ...meta };
  let updatedDataList = dataList;

  // Flatten all pages into a single array
  let items = [];
  for (let i = 1; i <= total_pages; i++) {
    const pageKey = `page${i}`;
    if (data[pageKey]) {
      items = items.concat(data[pageKey]);
    }
  }

  // Add new item at the beginning
  items = [newItem, ...items];

  // Calculate new pagination
  const newTotalItems = items.length;
  const newTotalPages = Math.ceil(newTotalItems / page_size);

  // Rebuild paginated data
  updatedData = {};
  for (let i = 0; i < newTotalPages; i++) {
    const pageKey = `page${i + 1}`;
    updatedData[pageKey] = items.slice(i * page_size, (i + 1) * page_size);
  }

  // Update meta
  updatedMeta = {
    ...meta,
    total_items: newTotalItems,
    total_pages: newTotalPages,
  };

  // Update dataList (current page list)
  const current_pageKey = `page${current_page}`;
  updatedDataList = updatedData[current_pageKey] || [];

  return {
    meta: updatedMeta,
    data: updatedData,
    dataList: updatedDataList,
  };
};

// *append new data to paginated list (add at the end)
export const appendNewDataToPaginatedList = ({
  newItem,
  meta,
  data,
  dataList,
}) => {
  const { page_size, total_pages, current_page } = meta;
  const lastPageKey = `page${total_pages}`;
  const lastPageData = data[lastPageKey] || [];

  const updatedData = { ...data };
  let updatedMeta = { ...meta };
  let updatedDataList = dataList;

  if (lastPageData.length < page_size) {
    updatedData[lastPageKey] = [...lastPageData, newItem];
  } else {
    const newPageKey = `page${total_pages + 1}`;
    updatedData[newPageKey] = [newItem];
    updatedMeta.total_pages += 1;
  }

  updatedMeta.total_items += 1;

  if (updatedMeta.total_pages === current_page) {
    const current_pageKey = `page${current_page}`;
    updatedDataList = updatedData[current_pageKey];
  }

  return {
    meta: updatedMeta,
    data: updatedData,
    dataList: updatedDataList,
  };
};

// *Set Paginated Data From API
export const setPaginatedDataFromApi = ({
  incomingData,
  incomingMeta,
  existingData,
  existingMeta,
}) => {
  if (incomingMeta?.total_pages === 0) {
    return {
      meta: existingMeta,
      data: existingData,
      dataList: [],
    };
  }

  const updatedData = { ...existingData };
  const updatedMeta = { ...existingMeta, ...incomingMeta };
  let updatedDataList = [];

  if (incomingMeta.current_page <= incomingMeta.total_pages) {
    const pageKey = `page${incomingMeta.current_page}`;
    updatedData[pageKey] = incomingData;
    updatedDataList = incomingData;
  } else {
    const fallbackPageKey = `page${existingMeta.current_page}`;
    const fallbackData = existingData[fallbackPageKey] || [];
    const slicedData = fallbackData.slice(0, incomingMeta.page_size);

    const diff = incomingMeta.current_page - incomingMeta.total_pages;
    const newCurrentPage = incomingMeta.current_page - diff;

    updatedMeta.current_page = newCurrentPage;
    updatedMeta.total_pages = incomingMeta.total_pages;
    updatedDataList = slicedData;
  }

  return {
    meta: updatedMeta,
    data: updatedData,
    dataList: updatedDataList,
  };
};

// *remove data from paginated list
export const removeDataFromPaginatedList = ({ idToRemove, meta, data }) => {
  const { page_size, total_pages, current_page } = meta;
  const updatedData = {};
  let updatedDataList = [];
  let items = [];

  // Flatten all pages into a single array
  for (let i = 1; i <= total_pages; i++) {
    const pageKey = `page${i}`;
    if (data[pageKey]) {
      items = items.concat(data[pageKey]);
    }
  }

  // Remove the item
  items = items.filter((item) => item._id !== idToRemove);

  // Rebuild paginated data
  const newTotalItems = items.length;
  const newTotalPages = Math.max(1, Math.ceil(newTotalItems / page_size));

  for (let i = 0; i < newTotalPages; i++) {
    const pageKey = `page${i + 1}`;
    updatedData[pageKey] = items.slice(i * page_size, (i + 1) * page_size);
  }

  // Update meta
  const updatedMeta = {
    ...meta,
    total_items: newTotalItems,
    total_pages: newTotalPages,
    current_page: Math.min(current_page, newTotalPages), // Ensure current_page doesn't exceed total_pages
  };

  // Update dataList (current page list)
  const current_pageKey = `page${updatedMeta.current_page}`;
  updatedDataList = updatedData[current_pageKey] || [];

  return {
    meta: updatedMeta,
    data: updatedData,
    dataList: updatedDataList,
  };
};

// *update data only in dataList
export const updateDataInDataList = ({ updatedItem, dataList }) => {
  return dataList.map((item) =>
    item._id === updatedItem._id ? { ...item, ...updatedItem } : item
  );
};

// *update item in all pages of paginated data
export const updateDataInPaginatedPages = ({ updatedItem, data, meta }) => {
  const { total_pages } = meta;
  const updatedData = {};

  for (let i = 1; i <= total_pages; i++) {
    const pageKey = `page${i}`;
    if (data[pageKey]) {
      updatedData[pageKey] = data[pageKey].map((item) =>
        item._id === updatedItem._id ? { ...item, ...updatedItem } : item
      );
    }
  }

  return updatedData;
};
