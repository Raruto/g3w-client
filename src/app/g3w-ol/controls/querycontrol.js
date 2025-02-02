const utils = require('core/utils/ol');
const InteractionControl = require('g3w-ol/controls/interactioncontrol');
const PickCoordinatesInteraction = require('g3w-ol/interactions/pickcoordinatesinteraction');

const QueryControl = function(options={}){
  const _options = {
    offline: false,
    name: "querylayer",
    tipLabel: "sdk.mapcontrols.query.tooltip",
    label: options.label || "\uea0f",
    clickmap: true, // set ClickMap
    interactionClass: PickCoordinatesInteraction,
  };
  options = utils.merge(options, _options);
  InteractionControl.call(this, options);
};

ol.inherits(QueryControl, InteractionControl);

const proto = QueryControl.prototype;

proto.setMap = function(map) {
  let eventToggledKey;
  const querySingleClickFnc = event => {
    this.dispatchEvent({
      type: 'picked',
      coordinates: event.coordinate
    });
    this._autountoggle && this.toggle(true);
  };
  if (map) {
    eventToggledKey = this.on('toggled', event => {
      const toggled = event.target.isToggled();
      toggled && map.on('singleclick', querySingleClickFnc) || map.un('singleclick', querySingleClickFnc);
    });
  } else ol.Observable.unByKey(eventToggledKey);
  InteractionControl.prototype.setMap.call(this, map);
};

module.exports = QueryControl;
