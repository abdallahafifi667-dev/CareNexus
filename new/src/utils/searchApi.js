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
    // Search analytics tracking disabled in production
    // return axiosInstance.post("/analytics/search", { query, filters });
  }
};

export default searchApi;
