var inherit = require('core/utils/utils').inherit;
var base = require('core/utils/utils').base;
var GUI = require('gui/gui');
var G3WObject = require('core/g3wobject');
var ComponentsRegistry = require('gui/componentsregistry');
var ProjectsRegistry = require('core/project/projectsregistry');

function QueryResultsService(){
  var self = this;
  this._actions = {
    'zoomto': QueryResultsService.zoomToElement,
    'gotogeometry': QueryResultsService.goToGeometry
  };
  
  this.init = function(options) {
    this.clearState();
  };
  
  this.state = {
    layers: [],
    query: {},
    querytitle: "",
    loading: true
  };
  
  this.setters = {
    setQueryResponse: function(queryResponse) {
      this.state.layers = [];
      this.state.query = queryResponse.query;
      this._digestFeaturesForLayers(queryResponse.data);
      this.state.loading = false;
    }
  };
  
  this.clearState = function() {
    this.state = {
      layers: [],
      query: {},
      querytitle: "",
      loading: true
    };
  };
  
  this.setTitle = function(querytitle) {
    this.state.querytitle = querytitle || "";
  };
  
  this.reset = function() {
    this.clearState();
  };
  // funzione che serve a far digerire i risultati delle features
  this._digestFeaturesForLayers = function(featuresForLayers) {
    var self = this;
    _.forEach(featuresForLayers, function(featuresForLayer){
      var layer = featuresForLayer.layer;
      if (featuresForLayer.features.length) {
        var layerObj = {
          title: layer.state.title,
          id: layer.state.id,
          // prendo solo gli attributi effettivamente ritornati dal WMS (usando la prima feature disponibile)
          attributes: self._parseAttributes(layer.getAttributes(), featuresForLayer.features[0].getProperties()),
          features: []
        };
        _.forEach(featuresForLayer.features, function(feature){
          //console.log(feature.getProperties()); //g3w_relations
          var featureObj = {
            id: feature.getId(),
            attributes: feature.getProperties(),
            geometry: feature.getGeometry()
            // aggiungo le relazioni
          };
          layerObj.features.push(featureObj);
        });
        self.state.layers.push(layerObj);
      }
    })
  };
  
  this._parseAttributes = function(layerAttributes, featureAttributes) {
    var featureAttributesNames = _.keys(featureAttributes);
    if (layerAttributes.length) {
      var featureAttributesNames = _.keys(featureAttributes);
      return _.filter(layerAttributes,function(attribute){
        return featureAttributesNames.indexOf(attribute.name) > -1;
      })
    }
    // se layer.attributes è vuoto
    // (es. quando l'interrogazione è verso un layer esterno di cui non so i campi)
    // costruisco la struttura "fittizia" usando l'attributo sia ocme name che come label
    else {
      return _.map(featureAttributesNames, function(featureAttributesName){
        return {
          name: featureAttributesName,
          label: featureAttributesName
        }
      })
    }
  };
  
  this.trigger = function(action,layer,feature) {
    var actionMethod = this._actions[action];
    if (actionMethod) {
      actionMethod(layer,feature);
    }
  };
  
  base(this);
}
QueryResultsService.zoomToElement = function(layer,feature) {
  console.log(feature.geometry);
};

QueryResultsService.goToGeometry = function(layer,feature) {
  if (feature.geometry) {
    GUI.hideQueryResults();
    var mapService = ComponentsRegistry.getComponent('map').getService();
    mapService.highlightGeometry(feature.geometry);
  }
};

// Make the public service en Event Emitter
inherit(QueryResultsService, G3WObject);

module.exports = QueryResultsService;
