/**
 * Utility to resolve image paths from backend responses.
 * Handles absolute URLs, relative paths to uploads, and base64 strings.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE_URL = API_URL.replace("/api", "");

export const resolveImgPath = (path, fallback = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png") => {
    if (!path) return fallback;

    // If it's already a full URL or base64 data
    if (path.startsWith("http") || path.startsWith("data:")) {
        return path;
    }

    // Clean the path (remove leading slashes)
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Standard pattern: prepend BASE_URL/ (not /api)
    // Most backends serve static files from the root context
    return `${BASE_URL}/${cleanPath}`;
};

export const getAvatar = (user) => {
    return resolveImgPath(user?.avatar || user?.photo || user?.image);
};
