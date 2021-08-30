const {inherits} = require('core/utils/utils');
const WMSLAYER = require('./wmslayer');
const RasterLayers = require('g3w-ol/src/layers/rasters');

function ARCGISMAPSERVERLayer(options={}, extraParams={}) {
  ARCGISMAPSERVERLayer.base(this, 'constructor', options, extraParams);
}

inherits(ARCGISMAPSERVERLayer, WMSLAYER);

const proto = ARCGISMAPSERVERLayer.prototype;

proto._makeOlLayer = function() {
  const config = {
    url: this.config.url,
    id: this.config.id,
    projection: this.config.projection,
    format: this.config.format
  };
  const olLayer = new RasterLayers.TiledArgisMapServer(config);
  olLayer.getSource().on('imageloadstart', () => this.emit("loadstart"));
  olLayer.getSource().on('imageloadend', () => this.emit("loadend"));
  olLayer.getSource().on('imageloaderror', ()=> this.emit("loaderror"));
  return olLayer
};


module.exports = ARCGISMAPSERVERLayer;
