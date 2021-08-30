import { BING_API_KEY } from 'config/keys';
import ApplicationState from 'core/applicationstate'
const {inherits} = require('core/utils/utils');
const BaseLayer = require('core/layers/baselayers/baselayer');
const BasesLayers = require('g3w-ol/src/layers/bases');

function BingLayer(config={}, options={}){
  BingLayer.base(this, 'constructor', config, options);
}

inherits(BingLayer, BaseLayer);

const proto = BingLayer.prototype;

proto._makeOlLayer = function(){
  let olLayer;
  const key = ApplicationState.keys.vendorkeys.bing || BING_API_KEY;
  const subtype = this.config.source ? this.config.source.subtype : null;
  switch(subtype) {
    case 'streets':
      olLayer = BasesLayers.BING.get({
        imagerySet: 'Road',
        key
      });
      break;
    case 'aerial':
      olLayer = BasesLayers.BING.get({
        imagerySet: 'Aerial',
        key
      });
      break;
    case 'aerialwithlabels':
      olLayer = BasesLayers.BING.get({
        imagerySet: 'AerialWithLabels',
        key
      });
      break;
    default:
      olLayer = BasesLayers.BING.get({
        imagerySet: 'Aerial',
        key
      });
  }
  return olLayer
};

module.exports = BingLayer;
