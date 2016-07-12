var g3w = g3w || {};

g3w.core = {
   G3WObject: require('core/g3wobject'),
   utils: require('core/utils/utils'),
   ApplicationService: require('core/applicationservice'),
   ApiService: require('core/apiservice'),
   Router: require('core/router'),
   ProjectsRegistry: require('core/project/projectsregistry'),
   ProjectService: require('core/project/projectservice'),
   MapService: require('core/map/mapservice'),
   MapQueryService: require('core/map/mapqueryservice'),
   MapLayer: require('core/map/maplayer'),
   LayerState: require('core/layer/layerstate'),
   VectorLayer: require('core/layer/vectorlayer'),
   WmsLayer: require('core/layer/wmslayer'),
   Geometry: require('core/geometry/geometry'),
   geom: require('core/geometry/geom'),
   PickCoordinatesInteraction: require('core/interactions/pickcoordinatesinteraction'),
   PickFeatureInteraction: require('core/interactions/pickfeatureinteraction'),
   i18n: require('core/i18n/i18n.service'),
   Plugin: require('core/plugin/plugin'),
   PluginsRegistry: require('core/plugin/pluginsregistry'),
   PluginsService: require('core/plugin/pluginsservice'),
   ToolsService: require('core/plugin/toolsservice')
};

g3w.gui = {
  vue: {
    GeocodingComponent: require('gui/vue/geocoding/geocoding'),
    SearchComponent: require('gui/vue/search/search'),
    CatalogComponent: require('gui/vue/catalog/catalog'),
    MapComponent: require('gui/vue/map/map')
  }
};

module.exports = {
  core: g3w.core,
  gui: g3w.gui
};
