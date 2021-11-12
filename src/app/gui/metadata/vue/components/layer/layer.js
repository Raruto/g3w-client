const {inherit, base} = require('core/utils/utils');
const Component = require('gui/vue/component');
import Layer from './layer.vue'

function LayerComponent({state = {}, service} = {}) {
  base(this);
  const vueComponent = Vue.defineComponent(Layer);
  this.setService(service);
  this.internalComponent = new vueComponent({
    state
  });
  this.layout = function() {};
}

inherit(LayerComponent, Component);

module.exports = LayerComponent;
