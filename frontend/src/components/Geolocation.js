import React, { useEffect } from 'react';

const Geolocation = () => {
  // Function to calculate the distance between two points using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  }

  // Function to convert degrees to radians
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Function to check if the user is within the specified radius from the point
  function isWithinRadius(userLat, userLon, pointLat, pointLon, radius) {
    const distance = calculateDistance(userLat, userLon, pointLat, pointLon);
    return distance <= radius;
  }

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        console.log(userLat, userLon);
        const pointLat = 25; // Latitude of the point
        const pointLon = 75; // Longitude of the point
        const radius = 5; // Radius in meters

        const withinRadius = isWithinRadius(
          userLat,
          userLon,
          pointLat,
          pointLon,
          radius
        );

        if (withinRadius) {
          alert('You can mark your attendance now.');
          // Perform other actions when the user is within the radius
        } else {
          console.log('User is outside the radius.');
          // Perform actions if the user is outside the radius
        }
      },
      function (error) {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  return <div></div>;
};

export default Geolocation;
