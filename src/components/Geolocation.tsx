import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IGeolocationEntry } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function Geolocation() {
  const [coordinates, setCoordinates] = useState<IGeolocationEntry[]>([]);

  useEffect(() => {
    watch(StorageKey.GEOLOCATION_HISTORY, ({ newValue = [] }) => {
      setCoordinates(newValue);
    });
  }, []);

  function getSrc(): string {
    if (coordinates.length === 0) {
      return "";
    }

    const { latitude, longitude } = coordinates[0];

    const params = new URLSearchParams({
      bbox: `${longitude + 0.01},${latitude - 0.01},${longitude - 0.01},${
        latitude + 0.01
      }`,
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
        <h1
          id="geolocation"
          className="border-b border-gray-500 font-semibold text-gray-700 text-2xl"
        >
          Geolocation
        </h1>
        <hr />

        {coordinates[0] && (
          <>
            <iframe
              width="425"
              height="350"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={getSrc()}
            ></iframe>

            <div className="text-lg py-8">{`Current location: ${coordinates[0].latitude},${coordinates[0].longitude}`}</div>

            <div
              className="grid grid-cols-2 gap-2"
              style={{ gridTemplateColumns: "auto 1fr" }}
            >
              {coordinates.map((x) => (
                <React.Fragment key={x.uuid}>
                  <div>[{x.timestamp}]</div>
                  <div>
                    {x.latitude}, {x.longitude}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
