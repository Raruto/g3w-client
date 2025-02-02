const utils = require('core/utils/ol');
const AreaIteraction = require('g3w-ol/interactions/areainteraction');
const MeasureControl = require('g3w-ol/controls/measurecontrol');

const AreaControl = function(options={}) {
  const _options = {
    tipLabel: "sdk.mapcontrols.measures.area.tooltip",
    label: "\ue909",
    clickmap: true, // set ClickMap
    interactionClass: AreaIteraction
  };
  options = utils.merge(options, _options);
  MeasureControl.call(this, options);
};

ol.inherits(AreaControl, MeasureControl);

module.exports = AreaControl;
