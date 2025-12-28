"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";

// Fix marker icon issue in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

const markerIcon2x = "/react-leaflet-images/marker-icon-2x.png";
const markerIcon = "/react-leaflet-images/marker-icon.png";
const markerShadow = "/react-leaflet-images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [12, -41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

interface ViewMapDialogProps {
  lat: number | null;
  lng: number | null;
  accuracy?: number | null;
  altitude?: number | null;
  speed_accuracy?: number | null;
}

const ViewMapButtonDialog: React.FC<ViewMapDialogProps> = ({
  lat,
  lng,
  accuracy,
  altitude,
  speed_accuracy,
}) => {
  const [visible, setVisible] = useState(false);
  const { BaseLayer } = LayersControl;

  // use numbers directly
  const latitude = lat ?? NaN;
  const longitude = lng ?? NaN;

  // proper validation
  const isValidLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
  const isValidLng = !isNaN(longitude) && longitude >= -180 && longitude <= 180;
  const isValidLatLng = isValidLat && isValidLng;

  // store map ref
  const [map, setMap] = useState<Map | null>(null);

  const flyToLocation = () => {
    if (map && isValidLatLng) {
      map.flyTo([latitude, longitude], 15);
    }
  };

  useEffect(() => {
    if (visible && map) {
      flyToLocation();
    }
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
          <MapContainer
            ref={setMap}
            center={[latitude, longitude]}
            zoom={12}
            scrollWheelZoom
            attributionControl={false}
            style={{ minHeight: "80vh", width: "100%" }}
          >
            <LayersControl>
              <BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

            <Marker position={[latitude, longitude]}>
              <Popup>
                <div>
                  <p><strong>Latitude:</strong> {latitude}</p>
                  <p><strong>Longitude:</strong> {longitude}</p>
                  <p><strong>Accuracy:</strong> {accuracy ?? "N/A"}</p>
                  <p><strong>Altitude:</strong> {altitude ?? "N/A"}</p>
                  <p><strong>Speed Accuracy:</strong> {speed_accuracy ?? "N/A"}</p>
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    // href={https://maps.app.goo.gl/hJrRJFRh8R6coAzs8}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 inline-block"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center justify-center p-4 text-red-500 font-bold text-lg bg-red-100 rounded">
              ⚠️ Invalid or missing location data.
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ViewMapButtonDialog;
