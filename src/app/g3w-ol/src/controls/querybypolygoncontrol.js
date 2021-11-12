import {SPATIALMETHODS} from '../constants';
const {merge} = require('../utils');
const InteractionControl = require('./interactioncontrol');
const PickCoordinatesInteraction = require('../interactions/pickcoordinatesinteraction');
const {getAllPolygonGeometryTypes} = require('core/geometry/geometry');
const VALIDGEOMETRIES = getAllPolygonGeometryTypes();

const QueryByPolygonControl = function(options={}) {
  const {spatialMethod=SPATIALMETHODS[0]} = options;
  this.layers = options.layers || [];
  this.unwatches = [];
  this.listenPolygonLayersChange();
  options.visible = this.checkVisibile(this.layers);
  this.selectedLayer = null;
  const _options = {
    offline: false,
    name: "querybypolygon",
    tipLabel: "sdk.mapcontrols.querybypolygon.tooltip",
    label: options.label || "\ue903",
    // function to get selection layer
    onSelectlayer(selectedLayer){
      const selected = selectedLayer.isSelected();
      const geometryType = selectedLayer.getGeometryType();
      const querable = selectedLayer.isQueryable();
      let enabled = false;
      if (selected){
        if (this.getGeometryTypes().indexOf(geometryType) !== -1) {
          enabled = querable ? selectedLayer.isVisible(): querable;
          this.setEnable(enabled);
        } else this.setEnable(false, false);
      } else this.setEnable(false, false);
      this.selectedLayer = selected && enabled ? selectedLayer : null;
    },
    clickmap: true, // set ClickMap
    interactionClass: PickCoordinatesInteraction,
    spatialMethod,
    toggledTool:{
      type: 'spatialMethod',
      how: 'toggled' // or hover
    },
    onhover: true
  };
  options = merge(options,_options);
  options.geometryTypes = VALIDGEOMETRIES;
  InteractionControl.call(this, options);
  //starting disabled
  this.setEnable(false);
};

ol.inherits(QueryByPolygonControl, InteractionControl);

const proto = QueryByPolygonControl.prototype;

proto.listenPolygonLayersChange = function(){
  this.unwatches.forEach(unwatch => unwatch());
  this.unwatches.splice(0);
  const polygonLayers = this.layers.filter(layer => VALIDGEOMETRIES.indexOf(layer.getGeometryType()) !== -1);
  polygonLayers.forEach(layer => {
    const {state} = layer;
    this.unwatches.push(Vue.watch(() =>  state.visible, visible => {
      // need to be visible or selected
      this.setEnable(visible && state.selected);
    }));
  });
};

proto.change = function(layers=[]){
  this.layers = layers;
  const visible = this.checkVisibile(layers);
  this.setVisible(visible);
  this.setEnable(false);
  this.listenPolygonLayersChange();
};

proto.checkVisibile = function(layers) {
  let visible;
  // if no layer or just one
  if (!layers.length || layers.length === 1) visible = false;
  else {
    // geometries to check
    // get all layers that haven't the geometries above filterable
    const filterableLayers = layers.filter(layer => layer.isFilterable());
    // gell all layer that have the valid geometries
    const querableLayers = layers.filter(layer => VALIDGEOMETRIES.indexOf(layer.getGeometryType()) !== -1);
    const filterableLength = filterableLayers.length;
    const querableLength = querableLayers.length;
    visible = querableLength > 0 && filterableLength > 0;
  }
  return visible;
};

proto.setMap = function(map) {
  InteractionControl.prototype.setMap.call(this, map);
  this._interaction.on('picked', evt => {
    this.dispatchEvent({
      type: 'picked',
      coordinates: evt.coordinate
    });
    this._autountoggle && this.toggle();
  });
  this.setEnable(false);
};

module.exports = QueryByPolygonControl;
