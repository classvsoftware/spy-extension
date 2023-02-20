import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IGeolocationEntry } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function Geolocation() {
  const [coordinate, setCoordinate] = useState<IGeolocationEntry | null>(null);

  useEffect(() => {
    watch(
      StorageKey.GEOLOCATION_HISTORY,
      ({ newValue = [] }) => {
        if (newValue.length > 0) {
          setCoordinate(newValue[0]);
        } else {
          setCoordinate(null);
        }
      },
      { initialCheck: true }
    );
  }, []);

  function getSrc(): string {
    if (!coordinate) {
      return "";
    }

    const { latitude, longitude } = coordinate;

    const params = new URLSearchParams({
      bbox: `${coordinate.longitude + 0.01},${latitude - 0.01},${
        longitude - 0.01
      },${latitude + 0.01}`,
      layer: "mapnik",
      marker: `${latitude},${longitude}`,
    });

    return new URL(
      `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
    ).toString();
  }

  return (
    <>
      <div>
        <h1 className="border-b border-gray-500 font-semibold text-gray-700 text-2xl">
          Geolocation
        </h1>
        <hr />

        {coordinate && (
          <>
            <div className="text-lg py-12">
              Coordinates: {coordinate.latitude}, {coordinate.longitude}
            </div>
            <iframe
              width="425"
              height="350"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={getSrc()}
            ></iframe>
          </>
        )}
      </div>
    </>
  );
}
