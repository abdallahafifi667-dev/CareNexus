/**
 * Patient Module Permissions
 */

export const ROLES = {
  PATIENT: "patient",
};

const permissions = {
  [ROLES.PATIENT]: {
    dashboard: true,
    orders: true,
    profile: true,
    settings: true,
    chat: true,
    medical_ai: true,
    knowledge_ai: true,
    feed: true,
  },
};

/**
 * Check if a role has access to a specific feature
 */
export const canAccess = (role, feature) => {
  // If it's a patient and the feature is allowed
  if (role === ROLES.PATIENT) {
    return !!permissions[ROLES.PATIENT][feature];
  }
  // Fallback or handle other roles if needed, but this is patient-specific utils
  return true;
};

/**
 * Filter an array of navigation items based on the user's role
 */
export const filterNavItems = (navItems, role) => {
  return navItems.filter((item) => {
    if (!item.feature) return true;
    return canAccess(role, item.feature);
  });
};
