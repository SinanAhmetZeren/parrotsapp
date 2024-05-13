/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { WaypointComponent } from "./WaypointComponent";

export const WaypointListComponent = ({ waypoints }) => {
  return (
    <>
      {waypoints.map((waypoint, index) => {
        // let pinColor = "#cfc200";
        let pinColor = "orange";
        if (index === 0) {
          pinColor = "#115500";
        } else if (index === waypoints.length - 1) {
          pinColor = "#610101";
        }

        return (
          <WaypointComponent
            key={waypoint.id}
            description={waypoint.description}
            latitude={waypoint.latitude}
            longitude={waypoint.longitude}
            profileImage={waypoint.profileImage}
            title={waypoint.title}
            pinColor={pinColor}
          />
        );
      })}
    </>
  );
};
