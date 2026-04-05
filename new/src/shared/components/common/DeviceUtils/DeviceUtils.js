import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getCurrentLocation } from "./LocationService";

/**
 * Utility functions for device-related data fetching and secure fingerprinting
 */

export const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "0.0.0.0";
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "0.0.0.0";
  }
};

let fpPromise = null;
const getFp = () => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
};

/**
 * Generates a secure SHA-256 hash of device metadata
 * @param {string} data - The string data to hash
 * @returns {Promise<string>} - Hexadecimal hash string
 */
async function generateSecureHash(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const getDeviceFingerprint = async () => {
  try {
    const fp = await getFp();
    const result = await fp.get();
    const visitorId = result.visitorId;
    const ip = await getIPAddress();

    // Collect additional entropy as requested
    const entropy = {
      fp: visitorId,
      ip: ip,
      ua: navigator.userAgent,
      res: `${window.screen.width}x${window.screen.height}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      lang: navigator.language,
    };

    // Combine all data into a single string for hashing
    const combinedData = JSON.stringify(entropy);

    // Generate a secure SHA-256 hash
    return await generateSecureHash(combinedData);
  } catch (error) {
    console.error("Fingerprint generation error:", error);
    return "secure-fallback-" + Date.now().toString(16);
  }
};

export const getDeviceMetadata = async () => {
  const ip = await getIPAddress();
  const coords = await getCurrentLocation();
  const deviceId = await getDeviceFingerprint();

  return {
    IpPhone: ip,
    latitude: coords.latitude,
    longitude: coords.longitude,
    deviceId: deviceId,
  };
};
