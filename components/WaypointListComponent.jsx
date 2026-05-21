/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { WaypointComponent } from "./WaypointComponent";

export const WaypointListComponent = ({ waypoints }) => {
  return (
    <>
      {waypoints.map((waypoint, index) => {
        let pinColor = "#06B6D4";
        if (index === 0) {
          pinColor = "green";
        } else if (index === waypoints.length - 1) {
          pinColor = "red";
        }


        return (
          <WaypointComponent
            key={waypoint.id}
            index={index}
            id={waypoint.id}
            latitude={waypoint.latitude}
            longitude={waypoint.longitude}
            title={waypoint.title}
            pinColor={pinColor}
          />
        );
      })}
    </>
  );
};
