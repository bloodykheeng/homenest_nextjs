"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map } from "leaflet";

// Fix marker icon issue in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

const markerIcon2x = "/react-leaflet-images/marker-icon-2x.png";
const markerIcon = "/react-leaflet-images/marker-icon.png";
const markerShadow = "/react-leaflet-images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,

  iconAnchor: [12, 41], // the point of the icon which will correspond to marker's location (tip of pin)
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [12, -41], // center the tooltip above the tip of the marker
  shadowSize: [41, 41], // size of the shadow
  shadowAnchor: [12, 41], // anchor point of the shadow (align with marker tip)
});

interface ViewMapDialogProps {
  lat: any;
  lng: any;
}

const ViewMapButtonDialog: React.FC<ViewMapDialogProps> = ({ lat, lng }) => {
  const [visible, setVisible] = useState(false);

  const { BaseLayer } = LayersControl;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const isValiddCoordinate = (value: any) =>
    !isNaN(value) && value >= -90 && value <= 90;

  const isValidLatLng =
    isValiddCoordinate(latitude) && isValiddCoordinate(longitude);

  //======================= fly to location =======================

  const [map, setMap] = useState<Map | null>(null); // Typed state for map instance

  // Helper function to validate latitude and longitude
  const isValidCoordinate = (lat: any, lng: any): boolean => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    return (
      !isNaN(latNum) &&
      !isNaN(lngNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lngNum >= -180 &&
      lngNum <= 180
    );
  };

  // Helper function to convert coordinates to float
  const convertToFloat = (
    lat: any,
    lng: any
  ): { lat: number; lng: number } | null => {
    if (!isValidCoordinate(lat, lng)) {
      return null;
    }

    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  };

  // Reusable helper function for getting the user's location
  const flyAndZoomToDefaultLocation = (coordinates: {
    lat: number;
    lng: number;
  }) => {
    if (map) {
      // map.flyTo(coordinates, map.getZoom());
      map.flyTo(coordinates, 15);
    }
  };

  // Main function to determine and fly to appropriate location
  // Main function to determine and fly to appropriate location
  const flyToLocation = () => {
    // Check if location has valid coordinates
    if (lat && lng) {
      const validCoords = convertToFloat(lat, lng);

      if (validCoords) {
        flyAndZoomToDefaultLocation(validCoords);
        return;
      }
    }

    // Don't fly anywhere if no valid coordinates are available
    console.log("No valid coordinates available for map navigation");
  };

  // Updated useEffect
  useEffect(() => {
    if (!visible || !map) return;

    flyToLocation();
  }, [visible, map, lat, lng]);

  return (
    <>
      <Button
        type="button"
        icon="pi pi-map"
        label="View Map"
        className="p-button-secondary"
        onClick={() => setVisible(true)}
        severity="info"
      />

      <Dialog
        header="Location Preview"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ minWidth: "50vw" }}
        maximizable
        maximized
      >
        {isValidLatLng ? (
          <>
            <MapContainer
              ref={setMap}
              center={[latitude as number, longitude as number]}
              zoom={12}
              scrollWheelZoom={true}
              attributionControl={false}
              style={{ minHeight: "80vh", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              <LayersControl>
                <BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </BaseLayer>
                <BaseLayer name="Terrain View">
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                    maxZoom={20}
                    subdomains={["mt1", "mt2", "mt3"]}
                  />
                </BaseLayer>
                <BaseLayer name="Satellite View">
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    maxZoom={20}
                    subdomains={["mt1", "mt2", "mt3"]}
                  />
                </BaseLayer>
                <BaseLayer name="Hybrid View">
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
                    maxZoom={20}
                    subdomains={["mt1", "mt2", "mt3"]}
                  />
                </BaseLayer>
              </LayersControl>

              <Marker position={[latitude, longitude]} />
            </MapContainer>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center justify-center p-4 text-red-500 font-bold text-lg bg-red-100 rounded">
                <span>⚠️ Invalid or missing location data.</span>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ViewMapButtonDialog;
