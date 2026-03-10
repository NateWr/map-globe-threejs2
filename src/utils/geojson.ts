import * as THREE from 'three'

const EARTH_RADIUS = 100
const DEPTH_SCALE_FACTOR = 10
const REAL_EARTH_RADIUS_KM = 6371

/**
 * Converts Geodetic coordinates to Cartesian 3D coordinates.
 *
 * Logic:
 * 1. Convert Lat/Lon to Radians.
 * 2. Calculate the visual radius.
 *    - Real depth is subtracted from real radius.
 *    - We apply the Scale Factor to the depth before subtracting to exaggerate it visually.
 * 3. Convert Spherical to Cartesian.
 */
export const getPositionFromLatLonDepth = (lat: number, lon: number, depthKm: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Calculate the normalized radius (0 to 1 scale relative to Earth radius)
  // We want to visualize depth.
  // Visual Depth = (Actual Depth * Scale Factor)
  // Visual Radius = Earth Radius - Visual Depth
  // We then normalize this to our 3D scene units.

  const exaggeratedDepth = depthKm * DEPTH_SCALE_FACTOR;
  const radiusKm = REAL_EARTH_RADIUS_KM - exaggeratedDepth;

  // Normalize to scene units
  const sceneRadius = (radiusKm / REAL_EARTH_RADIUS_KM) * EARTH_RADIUS;

  const x = -(sceneRadius * Math.sin(phi) * Math.cos(theta));
  const z = (sceneRadius * Math.sin(phi) * Math.sin(theta));
  const y = (sceneRadius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};