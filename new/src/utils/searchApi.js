import axiosInstance from "./axiosInstance";

const searchApi = {
  /**
   * Advanced search for users (doctors, patients, etc.)
   * @param {Object} params - Search parameters (q, role, specialization, location, distance, minRating, page, limit, sortBy)
   */
  advancedSearch: (params) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    return axiosInstance.get(`/search/advanced?${queryParams.toString()}`);
  },

  /**
   * Track search analytics (Mock for now)
   */
  trackSearch: (query, filters) => {
    console.log("Search Analytics:", { query, filters, timestamp: new Date() });
    // In a real app, you would send this to a tracking endpoint
    // return axiosInstance.post("/analytics/search", { query, filters });
  }
};

export default searchApi;
