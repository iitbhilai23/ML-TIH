import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import L from "leaflet";
import { CircularProgress, Backdrop } from "@mui/material";
import "./Common.module.css";

const red3DPin = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const isValidGeometry = (feat) => {
  try {
    return !!feat?.geometry?.coordinates?.length;
  } catch {
    return false;
  }
};

export default function ChhattisgarhMap({
  center = [21.25, 81.63],
  zoom = 7,
  height = 600,
  width = "100%"
}) {
  const [districts, setDistricts] = useState(null);
  const [allBlocks, setAllBlocks] = useState(null);
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const canvasRenderer = useRef(L.canvas({ padding: 0.5 }));
  const outlineLayerRef = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:4001/files/Map/topojsons/states/District_geo.json")
    // fetch("http://127.0.0.1:4001/files/District_geo.json")
    // fetch("http://127.0.0.1:4001/files/chhattisgarh_topojson.json")


      .then((r) => r.json())
      .then((d) => setDistricts(d))
      .catch((e) => console.error("district load err", e));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:4001/files/block_.json")
      .then((r) => r.json())
      .then((d) => setAllBlocks(d))
      .catch((e) => console.error("blocks load err", e));
  }, []);

  // useEffect(() => {
  //   fetch("http://localhost:4000/api/trainings/getAllCities")
  //     .then((r) => r.json())
  //     .then((json) => {
  //       const formatted = (json.data || [])
  //         .map((c) => ({ id: c.id, name: c.city_name, lat: Number(c.latitude), lng: Number(c.longitude) }))
  //         .filter((c) => !Number.isNaN(c.lat) && !Number.isNaN(c.lng));
  //       setCities(formatted);
  //     })
  //     .catch(() => setCities([]));
  // }, []);

  const districtStyle = { color: "#263238", weight: 1, fillColor: "#bbdefb", fillOpacity: 0.6 };
  const districtHighlight = { color: "#1976d2", weight: 3, fillColor: "#90caf9", fillOpacity: 0.9 };
  const blockStyle = { color: "#1b5e20", weight: 1, fillColor: "#a5d6a7", fillOpacity: 0.75 };
  const blockHighlight = { color: "#2e7d32", weight: 2.5, fillColor: "#81c784", fillOpacity: 0.95 };

  const removeBlockLayer = (map) => {
    if (!map) return;
    try {
      if (map._blockCanvasLayer) {
        map.removeLayer(map._blockCanvasLayer);
        map._blockCanvasLayer = null;
      }
    } catch { }
    try {
      if (outlineLayerRef.current && map.hasLayer(outlineLayerRef.current)) {
        map.removeLayer(outlineLayerRef.current);
        outlineLayerRef.current = null;
      }
    } catch { }
  };

  const addBlockCanvasLayer = (map, fc) => {
    removeBlockLayer(map);
    if (!fc || !Array.isArray(fc.features) || fc.features.length === 0) return;

    const layer = L.geoJSON(fc, {
      renderer: canvasRenderer.current,
      style: blockStyle,
      interactive: true,
      onEachFeature: (feat, lyr) => {
        const name = feat.properties?.block || feat.properties?.Block || "Block";
        lyr.on("mouseover", (e) => {
          lyr.setStyle(blockHighlight);
          const t = L.tooltip({ permanent: false, sticky: true, direction: "top", className: "block-tooltip" })
            .setLatLng(e.latlng)
            .setContent(name);
          lyr._tooltip = t;
          t.addTo(lyr._map);
        });
        lyr.on("mouseout", () => {
          lyr.setStyle(blockStyle);
          if (lyr._tooltip) lyr._map.removeLayer(lyr._tooltip);
        });
        lyr.on("click", (e) => {
          lyr.bindPopup(`<b>${name}</b>`).openPopup(e.latlng);
        });
      }
    }).addTo(map);

    map._blockCanvasLayer = layer;

    const outlines = L.geoJSON(fc, { style: { color: "#2e7d32", weight: 2, fillOpacity: 0 }, interactive: false }).addTo(map);
    outlineLayerRef.current = outlines;
  };

  const getDistrictFeatureByPoint = (lngLat) => {
    if (!districts || !districts.features) return null;
    const pt = turf.point([lngLat.lng, lngLat.lat]);
    for (const f of districts.features) {
      try {
        if (turf.booleanPointInPolygon(pt, f)) return f;
      } catch { }
    }
    return null;
  };

  const onEachDistrict = (feature, layer) => {
    const name = feature.properties?.District_N || feature.properties?.District || feature.properties?.DISTRICT || "District";
    layer.on("mouseover", (e) => {
      layer.setStyle(districtHighlight);
      const t = L.tooltip({ permanent: false, sticky: true, direction: "top", className: "district-tooltip" })
        .setLatLng(e.latlng)
        .setContent(name);
      layer._tooltip = t;
      t.addTo(layer._map);
    });
    layer.on("mouseout", () => {
      layer.setStyle(districtStyle);
      if (layer._tooltip) layer._map.removeLayer(layer._tooltip);
    });
    layer.on("click", (e) => {
      const map = mapRef.current;
      console.log("Click Debug:", { map: !!map, allBlocks: !!allBlocks, latlng: e.latlng });
      if (!map) { console.error("Map ref missing"); return; }
      if (!allBlocks) { console.warn("AllBlocks data missing - fetch failed?"); return; }

      const clickedFeature = getDistrictFeatureByPoint(e.latlng) || feature;
      console.log("Clicked Feature:", clickedFeature);
      if (!clickedFeature) return;

      setLoading(true);

      setTimeout(() => {
        const districtName = clickedFeature.properties?.District_N || clickedFeature.properties?.District || "District";
        let spatial = (allBlocks.features || []).filter((blk) => {
          try {
            return turf.booleanIntersects(blk, clickedFeature);
          } catch {
            return false;
          }
        });

        spatial = spatial.filter(isValidGeometry);
        const fc = { type: "FeatureCollection", features: spatial };
        addBlockCanvasLayer(map, fc);

        const bounds = spatial.length > 0 ? L.geoJSON(fc).getBounds() : L.geoJSON(clickedFeature).getBounds();
        map.flyToBounds(bounds, { maxZoom: 12, duration: 1.4, easeLinearity: 0.25, padding: [30, 30] });

        setLoading(false);
      }, 100);
    });
  };

  useEffect(() => {
    if (!query.trim() || !districts) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const results = [];
    (districts.features || []).forEach((f) => {
      const name = (f.properties?.District_N || f.properties?.District || "").toString();
      if (name.toLowerCase().includes(q)) results.push({ type: "district", name, feature: f });
    });
    (allBlocks?.features || []).forEach((f) => {
      const name = (f.properties?.block || f.properties?.Block || "").toString();
      if (name.toLowerCase().includes(q)) results.push({ type: "block", name, feature: f });
    });
    (cities || []).forEach((c) => {
      if ((c.name || "").toLowerCase().includes(q)) results.push({ type: "city", name: c.name, city: c });
    });
    setSuggestions(results.slice(0, 20));
  }, [query, districts, allBlocks, cities]);

  const selectSuggestion = (s) => {
    const map = mapRef.current;
    setQuery("");
    setSuggestions([]);
    setSearchFocused(false);
    if (!map) return;
    if (s.type === "district") {
      const df = s.feature;
      const matched = (allBlocks.features || []).filter((blk) => {
        try { return turf.booleanIntersects(blk, df); } catch { return false; }
      }).filter(isValidGeometry);
      const fc = { type: "FeatureCollection", features: matched };
      addBlockCanvasLayer(map, fc);
      const bounds = matched.length ? L.geoJSON(fc).getBounds() : L.geoJSON(df).getBounds();
      map.flyToBounds(bounds, { maxZoom: 12, duration: 1.2, padding: [30, 30] });
    } else if (s.type === "block") {
      const fc = { type: "FeatureCollection", features: [s.feature] };
      addBlockCanvasLayer(map, fc);
      map.flyToBounds(L.geoJSON(s.feature).getBounds(), { maxZoom: 14, duration: 1.2, padding: [20, 20] });
    } else if (s.type === "city") {
      removeBlockLayer(map);
      map.flyTo([s.city.lat, s.city.lng], 12);
      L.popup().setLatLng([s.city.lat, s.city.lng]).setContent(`<b>${s.city.name}</b>`).openOn(map);
    }
  };

  return (
    <div className="cg-map-root" style={{ width, maxWidth: "100%" }}>
      <div style={{ position: "relative", height }}>

        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
            borderRadius: 3
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <MapContainer
          center={center}
          zoom={zoom}
          ref={mapRef}
          style={{ height: "100%", width: "100%", borderRadius: 12 }}
          whenReady={(e) => {
            mapRef.current = e.target;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {districts && <GeoJSON data={districts} style={districtStyle} onEachFeature={onEachDistrict} />}
          {cities.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={red3DPin}>
              <Popup>
                <strong>{c.name}</strong><br />Lat: {c.lat}<br />Lng: {c.lng}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        .cg-map-root .leaflet-container .leaflet-interactive {
          transition: stroke 180ms ease, stroke-width 180ms ease, fill-opacity 180ms ease;
        }
      `}</style>
    </div>
  );
}
