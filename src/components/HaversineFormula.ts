// Haversine’ formula
// calculate distance from coordinate

interface Coor {
  lat: number;
  lng: number;
}
function getDistanceFromLatLngInMeter(coor1: Coor, coor2: Coor) {
  let { lat: lat1, lng: lng1 } = coor1;
  let { lat: lat2, lng: lng2 } = coor2;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLng = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000; // Distance in meter
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
export { getDistanceFromLatLngInMeter as distance };
