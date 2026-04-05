<<<<<<< HEAD
import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
=======
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
>>>>>>> 6e8e5c36c2630416e51b5f9b423abc821a9c8dd9
};

const OrderMap = ({ latitude, longitude, patientName }) => {
  const center = {
    lat: latitude,
<<<<<<< HEAD
    lng: longitude,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
=======
    lng: longitude
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
>>>>>>> 6e8e5c36c2630416e51b5f9b423abc821a9c8dd9
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
<<<<<<< HEAD

    // Adjust zoom if it's too close/far
    const listener = window.google.maps.event.addListener(map, "idle", () => {
      if (map.getZoom() > 16) map.setZoom(16);
      window.google.maps.event.removeListener(listener);
=======
    
    // Adjust zoom if it's too close/far
    const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
>>>>>>> 6e8e5c36c2630416e51b5f9b423abc821a9c8dd9
    });

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="map-loader">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        // Detailed styling similar to Uber/Careem
        styles: [
<<<<<<< HEAD
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#172b4d" }, { weight: "bold" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9ebff" }],
          },
        ],
=======
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#172b4d" }, { "weight": "bold" }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#d59563" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#ffffff" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#c9ebff" }]
            }
        ]
>>>>>>> 6e8e5c36c2630416e51b5f9b423abc821a9c8dd9
      }}
    >
      <Marker
        position={center}
        title={patientName}
        animation={window.google.maps.Animation.DROP}
      />
    </GoogleMap>
  );
};

export default React.memo(OrderMap);
