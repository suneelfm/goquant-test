"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const apiToken = "Xg9v_tmZsWFI9O641Z-LxY7HlEBJYIyKvxs_QcIy";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VuZWVsZm0iLCJhIjoiY21ob291emNtMDlpeDJqczQ5aDYxNnJoayJ9.0G4AmBvJJh94kWQNITG19A";
// Cloud servers https://developers.cloudflare.com/api/resources/magic_cloud_networking/subresources/catalog_syncs/methods/refresh/

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "",
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center: [-119.99959421984575, 38.619551620333496],
      zoom: 14,
      pitch: 60,
      testMode: true,
    });

    map.current.on("load", () => {
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 16,
      });
      map.current.addLayer({
        id: "terrain-data",
        type: "raster",
        source: "mapbox-dem",
        paint: {
          "raster-dem-elevation": ["*", ["get", "elevation"], 1],
        },
      });
      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      map.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapComponent;
