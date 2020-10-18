import { isEqual, makeWatchers, pick } from '../utils'
import sequential from '../utils/sequential'
import urlTileSource from './url-tile-source'

/**
 * Base tile image source mixin.
 */
export default {
  mixins: [
    urlTileSource,
  ],
  props: {
    // ol/source/TileImage
    /**
     * @type {string|undefined}
     */
    crossOrigin: String,
    /**
     * @type {number|undefined}
     */
    reprojectionErrorThreshold: Number,
    /**
     * @type {string|undefined}
     */
    tileClass: String,
  },
  watch: {
    .../*#__PURE__*/makeWatchers([
      'crossOrigin',
      'reprojectionErrorThreshold',
      'tileClass',
    ], prop => /*#__PURE__*/sequential(async function (val, prev) {
      if (isEqual(val, prev)) return

      if (process.env.VUELAYERS_DEBUG) {
        this.$logger.log(`${prop} changed, scheduling recreate...`)
      }

      await this.scheduleRecreate()
    })),
  },
  methods: {
    .../*#__PURE__*/pick(urlTileSource.methods, [
      'beforeInit',
      'init',
      'deinit',
      'beforeMount',
      'mount',
      'unmount',
      'refresh',
      'scheduleRefresh',
      'remount',
      'scheduleRemount',
      'recreate',
      'scheduleRecreate',
      'getServices',
      'subscribeAll',
      'resolveSource',
      'resolveOlObject',
    ]),
  },
}
