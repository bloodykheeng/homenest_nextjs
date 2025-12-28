"use client";

import React, { useState, useEffect, useMemo } from "react";
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

import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import { Tooltip } from "primereact/tooltip";

delete (L.Icon.Default.prototype as any)._getIconUrl;

const markerIcon2x = "/react-leaflet-images/marker-icon-2x.png";
const markerIcon = "/react-leaflet-images/marker-icon.png";
const markerShadow = "/react-leaflet-images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  // iconAnchor: [12, 41],
  // popupAnchor: [1, -34],
  // tooltipAnchor: [12, -41],
  // shadowSize: [41, 41],
  // shadowAnchor: [12, 41],
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface LocationDataType {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  speed_accuracy: number | null;
}

interface LatLngType {
  lat: number;
  lng: number;
}

interface MapLocationPickerProps {
  setLocationPickerMapSelectedLatLng: (LocationData: LocationDataType | null) => void;
  locationPickerMapSelectedLatLng?: LocationDataType | null;
  zoomDefaultCordinates?: LatLngType | null;
}

const parseSafeFloat = (value: any): number | "" => {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? "" : parsedValue;
};

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  setLocationPickerMapSelectedLatLng,
  locationPickerMapSelectedLatLng,
  zoomDefaultCordinates,
}) => {
  const primeReactToast = usePrimeReactToast();
  const { BaseLayer } = LayersControl;

  const [visible, setVisible] = useState<boolean>(false);
  const [localLatLng, setLocalLatLng] = useState<LocationDataType | null>(
    locationPickerMapSelectedLatLng ?? null
  );
  const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [confirmClearDialogVisible, setConfirmClearDialogVisible] = useState(false);

  const memoLocationPickerMapSelectedLatLng = useMemo(
    () => locationPickerMapSelectedLatLng,
    [locationPickerMapSelectedLatLng]
  );

  useEffect(() => {
    if (locationPickerMapSelectedLatLng !== undefined) {
      setLocalLatLng(locationPickerMapSelectedLatLng ?? null);
    }
  }, [memoLocationPickerMapSelectedLatLng, visible]);

  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click(e: any) {
        setLocalLatLng({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          accuracy: null,
          altitude: null,
          speed_accuracy: null,
        });
        setWarningMessage("");
      },
    });

    return localLatLng ? (
      <Marker
        position={{
          lat: parseSafeFloat(localLatLng?.latitude) as number,
          lng: parseSafeFloat(localLatLng?.longitude) as number,
        }}
      />
    ) : null;
  };

  const handleSetLocation = (e: any) => {
    e.preventDefault();
    if (!localLatLng) {
      const warning = "No location selected. Please select a location on the map.";
      setWarningMessage(warning);
      primeReactToast.warn("warning", warning);
      return;
    }
    setConfirmDialogVisible(true);
  };

  const confirmSetLocation = (e: any) => {
    e.preventDefault();
    if (localLatLng) {
      setLocationPickerMapSelectedLatLng(localLatLng);
      setConfirmDialogVisible(false);
      setVisible(false);
      setWarningMessage("");
      primeReactToast.success("success", "Location successfully set!");
    }
  };

  // 🔁 Get full user location data
  const getUserLocation = (setFormCordinates: boolean = false) => {
    setWarningMessage("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
          altitude,
          speed,
        } = position.coords;

        const locationData: LocationDataType = {
          latitude,
          longitude,
          accuracy: accuracy ?? null,
          altitude: altitude ?? null,
          speed_accuracy: speed ?? null,
        };

        setLocalLatLng(locationData);

        if (setFormCordinates) {
          setLocationPickerMapSelectedLatLng(locationData);
        }

        primeReactToast.success("found your current location");

        if (map) {
          map.flyTo({ lat: latitude, lng: longitude }, 15);
        }
      },
      (error) => {
        let errorMessage = "Failed to access your location.";
        if (error.code === 1) errorMessage = "Location permission denied, please enable it";
        primeReactToast.warn("Warning", errorMessage);
      }
    );
  };

  const [map, setMap] = useState<Map | null>(null);
  useEffect(() => {
    if (!visible || !map) return;

    const locateMeButton = L.easyButton("pi pi-map-marker", () => {
      getUserLocation();
    }).addTo(map);

    const provider = new OpenStreetMapProvider({
      params: { countrycodes: "ug", limit: 5 },
    });

    const searchControl = GeoSearchControl({
      provider,
      style: "default",
      showMarker: false,
      showPopup: false,
      marker: {
        icon: L.icon({
          iconUrl: markerIcon,
          iconRetinaUrl: markerIcon2x,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        }),
        draggable: false,
      },
      popupFormat: ({ result }: { result: { label: string } }) => `${result.label}`,
      maxMarkers: 1,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: "Search for places...",
      keepResult: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (event: any) => {
      const { location } = event;
      if (location && location.y && location.x) {
        const searchLocation: LocationDataType = {
          latitude: location.y,
          longitude: location.x,
          accuracy: null,
          altitude: null,
          speed_accuracy: null,
        };
        setLocalLatLng(searchLocation);
        setWarningMessage("");
        primeReactToast.success("Location found", `Selected: ${location.label || "Search result"}`);
      }
    });

    return () => {
      locateMeButton.remove();
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [visible, localLatLng, map, primeReactToast]);

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

  const convertToFloat = (lat: any, lng: any): { lat: number; lng: number } | null => {
    if (!isValidCoordinate(lat, lng)) return null;
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  };

  const flyAndZoomToDefaultLocation = (coordinates: { lat: number; lng: number }) => {
    if (map) map.flyTo(coordinates, 15);
  };

  const flyToLocation = () => {
    if (locationPickerMapSelectedLatLng?.latitude && locationPickerMapSelectedLatLng?.longitude) {
      const validCoords = convertToFloat(
        locationPickerMapSelectedLatLng.latitude,
        locationPickerMapSelectedLatLng.longitude
      );
      if (validCoords) {
        flyAndZoomToDefaultLocation(validCoords);
        return;
      }
    }

    if (zoomDefaultCordinates?.lat && zoomDefaultCordinates?.lng) {
      const validCoords = convertToFloat(zoomDefaultCordinates.lat, zoomDefaultCordinates.lng);
      if (validCoords) {
        flyAndZoomToDefaultLocation(validCoords);
        return;
      }
    }

    console.log("No valid coordinates available for map navigation");
  };

  useEffect(() => {
    if (!visible || !map) return;
    flyToLocation();
  }, [visible, map, locationPickerMapSelectedLatLng, zoomDefaultCordinates]);

  return (
    <>
      {warningMessage && (
        <div style={{ color: "red", marginBottom: "1rem", fontWeight: "bold" }}>
          {warningMessage}
        </div>
      )}

      <Tooltip target=".location-button" />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          type="button"
          icon="pi pi-map-marker"
          label="Use My Location"
          className="p-button-success location-button"
          onClick={() => getUserLocation(true)}
          data-pr-tooltip="Automatically set your location"
          style={{ fontSize: "100%", whiteSpace: "nowrap" }}
        />

        <Button
          type="button"
          icon="pi pi-map"
          label="Open Map"
          className="p-button-secondary location-button"
          onClick={() => setVisible(true)}
          severity="info"
          data-pr-tooltip="Open the map to select a location"
          style={{ fontSize: "100%", whiteSpace: "nowrap" }}
        />
      </div>

      <Dialog
        header="Select Location"
        visible={visible}
        onHide={() => {
          setLocalLatLng(null);
          setVisible(false);
        }}
        style={{ minWidth: "85vw", paddingLeft: "1rem", paddingRight: "1rem" }}
        maximizable
        maximized
      >
        <MapContainer
          ref={setMap}
          center={[
            parseSafeFloat(localLatLng?.latitude) || -6.369028,
            parseSafeFloat(localLatLng?.longitude) || 34.888822,
          ]}
          zoom={6}
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
          <MapClickHandler />
          {localLatLng && (
            <Marker
              position={[
                parseSafeFloat(localLatLng.latitude) as number,
                parseSafeFloat(localLatLng.longitude) as number,
              ]}
              draggable={true}
              eventHandlers={{
                dragend: (event) => {
                  const latlng = event.target.getLatLng();
                  setLocalLatLng({
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    accuracy: null,
                    altitude: null,
                    speed_accuracy: null,
                  });
                },
              }}
            />
          )}
        </MapContainer>

        <div className="flex flex-wrap gap-4 items-center justify-center m-2">


          {/* Buttons */}

          <Button
            type="button"
            label="Clear"
            icon="pi pi-times"
            className="p-button p-button-danger"
            onClick={() => {
              setConfirmClearDialogVisible(true);
            }}
          />
          {/* Live Info Box */}
          {localLatLng && (
            <div className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm">
              <strong>Lat:</strong> {localLatLng.latitude.toFixed(6)}{" "}
              <strong>Lng:</strong> {localLatLng.longitude.toFixed(6)}{" "}
              <strong>Acc:</strong> {localLatLng.accuracy ?? "N/A"} m{" "}
              <strong>Alt:</strong> {localLatLng.altitude ?? "N/A"} m{" "}
              <strong>Speed:</strong> {localLatLng.speed_accuracy ?? "N/A"}
            </div>
          )}
          <Button type="button" label="Set Location" onClick={handleSetLocation} />

        </div>

      </Dialog>

      <Dialog
        header="Confirmation"
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        maximizable
        footer={
          <>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-danger"
              onClick={(e: any) => {
                e.preventDefault();
                setLocalLatLng(locationPickerMapSelectedLatLng ?? null);
                setConfirmDialogVisible(false);
              }}
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              className="p-button-success"
              onClick={confirmSetLocation}
            />
          </>
        }
      >
        Are you sure you want to set the selected coordinates as the location of the incident?
      </Dialog>

      <Dialog
        header="Confirmation"
        visible={confirmClearDialogVisible}
        onHide={() => setConfirmClearDialogVisible(false)}
        maximizable
        footer={
          <>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-secondary"
              onClick={() => setConfirmClearDialogVisible(false)}
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => {
                setLocalLatLng(null);
                setLocationPickerMapSelectedLatLng(null);
                primeReactToast.success("Cleared selected coordinates");
                setConfirmClearDialogVisible(false);
              }}
            />
          </>
        }
      >
        Are you sure you want to clear the selected coordinates?
      </Dialog>
    </>
  );
};

export default MapLocationPicker;
