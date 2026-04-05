/**
 * Logic for handling browser geolocation
 */

export const getCurrentLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      resolve({ latitude: 0, longitude: 0, error: "Not supported" });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMsg = "Unknown error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Position unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "Fetch timeout";
            break;
        }
        console.error("Geolocation Error:", errorMsg);
        resolve({ latitude: 0, longitude: 0, error: errorMsg });
      },
      options,
    );
  });
};

export const startLocationTracking = (onUpdate) => {
  if (!navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => console.error(error),
    { enableHighAccuracy: true },
  );
};

export const stopLocationTracking = (watchId) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};
