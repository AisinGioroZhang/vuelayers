import GeometryType from 'ol/geom/GeometryType'
import { isArray, isPlainObject } from '../utils'
import { COORD_PRECISION } from './coord'
import { createGeoJsonFmt } from './format'
import { EPSG_3857, EPSG_4326 } from './proj'
import { createStyle, dumpStyle } from './style'

let geoJsonFmt

export function getGeoJsonFmt () {
  if (geoJsonFmt) {
    return geoJsonFmt
  }
  return createGeoJsonFmt({
    decimals: COORD_PRECISION,
    styleReader: createStyle,
    styleWriter: dumpStyle,
  })
}

/**
 * @param {Feature} feature
 * @param {ProjectionLike|undefined} [featureProjection=EPSG:3857]
 * @param {ProjectionLike|undefined} [dataProjection=EPSG:4326]
 * @param {number} [decimals=COORD_PRECISION]
 * @return {Object}
 */
export function writeGeoJsonFeature (
  feature,
  featureProjection = EPSG_3857,
  dataProjection = EPSG_4326,
  decimals = COORD_PRECISION,
) {
  if (!feature) return

  return getGeoJsonFmt().writeFeatureObject(feature, {
    featureProjection,
    dataProjection,
    decimals,
  })
}

/**
 * @param {Object} geoJsonFeature
 * @param {ProjectionLike|undefined} [featureProjection=EPSG:3857]
 * @param {ProjectionLike|undefined} [dataProjection=EPSG:4326]
 * @param {number} [decimals=COORD_PRECISION]
 * @return {Feature}
 */
export function readGeoJsonFeature (
  geoJsonFeature,
  featureProjection = EPSG_3857,
  dataProjection = EPSG_4326,
  decimals = COORD_PRECISION,
) {
  if (!geoJsonFeature) return

  return getGeoJsonFmt().readFeature(geoJsonFeature, {
    featureProjection,
    dataProjection,
    decimals,
  })
}

/**
 * @param {Geometry} geometry
 * @param {ProjectionLike|undefined} [geometryProjection=EPSG:3857]
 * @param {ProjectionLike|undefined} [dataProjection=EPSG:4326]
 * @param {number} [decimals=COORD_PRECISION]
 * @return {Object}
 */
export function writeGeoJsonGeometry (
  geometry,
  geometryProjection = EPSG_3857,
  dataProjection = EPSG_4326,
  decimals = COORD_PRECISION,
) {
  if (!geometry) return

  return getGeoJsonFmt().writeGeometryObject(geometry, {
    featureProjection: geometryProjection,
    dataProjection,
    decimals,
  })
}

/**
 * @param {Object|Object} geoJsonGeometry
 * @param {ProjectionLike|undefined} [geometryProjection=EPSG:3857]
 * @param {ProjectionLike|undefined} [dataProjection=EPSG:4326]
 * @param {number} [decimals=COORD_PRECISION]
 * @return {Geometry}
 */
export function readGeoJsonGeometry (
  geoJsonGeometry,
  geometryProjection = EPSG_3857,
  dataProjection = EPSG_4326,
  decimals = COORD_PRECISION,
) {
  if (!geoJsonGeometry) return

  dataProjection = readProjection(geoJsonGeometry, dataProjection)

  return getGeoJsonFmt().readGeometry(geoJsonGeometry, {
    featureProjection: geometryProjection,
    dataProjection,
    decimals,
  })
}

export function readProjection (geoJsonObj, defaultProjection) {
  return getGeoJsonFmt().readProjection(geoJsonObj) || defaultProjection
}

/**
 * @param {Object} feature
 * @returns {boolean}
 */
export function isGeoJSONFeature (feature) {
  return isPlainObject(feature) && feature.type === 'Feature' &&
    isGeoJSONGeometry(feature.geometry)
}

export function isGeoJSONGeometry (geometry) {
  return isPlainObject(geometry) &&
    Object.values(GeometryType).includes(geometry.type) &&
    isArray(geometry.coordinates)
}
