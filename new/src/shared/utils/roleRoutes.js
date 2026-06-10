export const getRoleBasePath = (role) => {
  switch (role) {
    case "patient":
      return "/patient";
    case "nursing":
      return "/nursing";
    case "pharmacy":
      return "/pharmacy";
    case "admin":
      return "/admin";
    case "shipping_company":
      return "/shipping-company";
    default:
      return "/doctor";
  }
};

export const getRoleRoute = (role, path = "") => {
  const basePath = getRoleBasePath(role);
  if (!path) return basePath;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
};
