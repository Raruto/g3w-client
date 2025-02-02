<!--
  @file
  @since v3.7
-->

<template>

  <li
    class="tree-item"
    @contextmenu.prevent.stop="showLayerMenu(layerstree, $event)"
    @click.stop="onTreeItemClick"
    :style="{
      marginLeft: !isGroup ? '5px' : '0'
    }"
    :class="{
      selected: !isGroup || !isTable ? layerstree.selected : false,
      itemmarginbottom: !isGroup,
      disabled: isInGrey, group: isGroup
    }"
  >
    <!-- GROUP LAYER -->
    <span
      v-if="isGroup"
      style="padding-right: 2px;"
      :class="[
        { bold : isGroup },
         g3wtemplate.getFontClass(layerstree.expanded ? 'caret-down' : 'caret-right')
      ]"
      @click="expandCollapse"
      class="root collapse-expande-collapse-icon">
    </span>

    <!-- GROUP LAYER -->
    <span
      v-if="isGroup"
      @click.stop="toggle()"
      style="color: #ffffff"
      :class="[triClass()]">
    </span>

    <!-- TABLE LAYER -->
    <span
      v-else-if="isTable"
      v-show="!layerstree.hidden"
      style="padding-left: 18px"
      :class="[
        parentFolder ? 'child' : 'root',
        g3wtemplate.getFontClass('table')
      ]">
    </span>

    <template v-else>

      <!-- EXTERNAL LAYER (REMOVABLE NODE) -->
      <span
        v-if="layerstree.external && layerstree.removable"
        style="color: red; padding-left: 1px;"
        :class="g3wtemplate.getFontClass('trash')"
        @click="removeExternalLayer(layerstree.name, layerstree._type)"
      ></span>

      <!-- EXTERNAL LAYER (DOWNLOADABLE NODE) -->
      <span
        v-if="layerstree.external && layerstree.download"
        style="color: #ffffff; margin-left: 5px;"
        :class="g3wtemplate.getFontClass('download')"
        @click="downloadExternalLayer(layerstree.download)"
      ></span>

      <!-- HIDDEN NODE (LAYER) -->
      <span
        v-show="!layerstree.hidden"
        class="checkbox-layer"
        :class="parentFolder ? 'child' : 'root'"
      >
        <span
          v-if="'toc' === legendlayerposition || !isGroup && layerstree.categories"
          @click.self.stop="expandCollapse"
          class="collapse-expande-collapse-icon"
          :class="g3wtemplate.getFontClass(layerstree.visible && layerstree.expanded ? 'caret-down' : 'caret-right')"
        ></span>
        <span
          @click.stop="toggle()"
          :style="{
            paddingLeft: ('toc' === legendlayerposition)
              ? '5px'
              : !isGroup && layerstree.categories
                ? '5px'
                : (!layerstree.legend && layerstree.external)
                  ? '1px'
                  : '18px'
          }"
          :class="[
            g3wtemplate.getFontClass(layerstree.checked ? 'check': 'uncheck'),
            { 'toc-added-external-layer': (!layerstree.legend && layerstree.external) }
          ]"></span>
      </span>

    </template>

    <!-- VISIBLE NODE (LAYER or GROUP) -->
    <div
      v-show="!layerstree.hidden || isGroup"
      class="tree-node-title"
      :class="{
        disabled: !layerstree.external && (layerstree.disabled || (layerstree.id && !layerstree.visible)),
        bold: isGroup
      }"
    >

      <!-- VISIBLE NODE TITLE (LAYER or GROUP) -->
      <span
        :class="{
          highlightlayer: isHighLight,
          scalevisibility: showscalevisibilityclass
        }"
        class="skin-tooltip-top g3w-long-text"
        data-placement="top"
        :current-tooltip="showScaleVisibilityToolip ? `minscale:${layerstree.minscale} - maxscale: ${layerstree.maxscale}` : ''"
        v-t-tooltip.text = "showScaleVisibilityToolip ? `minscale:${layerstree.minscale} - maxscale:${layerstree.maxscale}` : ''"
      >
        {{ layerstree.title }}
      </span>

      <!-- VISIBLE NODE SELECTED (LAYER) -->
      <div v-if="(!isGroup && layerstree.selection)">

        <span
          v-if="layerstree.selection.active"
          class="action-button skin-tooltip-left selection-filter-icon"
          data-placement="left"
          data-toggle="tooltip"
          :class="g3wtemplate.getFontClass('success')"
          @click.caputure.prevent.stop="clearSelection"
          v-t-tooltip.create="'layer_selection_filter.tools.clear'"
        ></span>

        <span
          v-if="!layerstree.external && (layerstree.selection.active || layerstree.filter.active)"
          class="action-button skin-tooltip-left selection-filter-icon"
          data-placement="left"
          data-toggle="tooltip"
          :class="[g3wtemplate.getFontClass('filter'), layerstree.filter.active ? 'active' : '']"
          @click.caputure.prevent.stop="toggleFilterLayer"
          v-t-tooltip.create="'layer_selection_filter.tools.filter'"
        ></span>

      </div>

    </div>

    <!-- NODE LEGEND (LAYER) -->
    <layerlegend
      v-if="showLayerTocLegend"
      :legendplace="legendplace"
      :layer="layerstree"
    ></layerlegend>

    <!-- CHILD NODES (GROUP) -->
    <ul
      v-if="isGroup"
      class="tree-content-items group"
      :class="[`g3w-lendplace-${legendplace}`]"
      v-show="layerstree.expanded"
    >
      <span v-for="_layerstree in layerstree.nodes" :key="_layerstree.id || _layerstree.groupId">
        <tristate-tree
          :root="false"
          :legendConfig="legend"
          :legendplace="legendplace"
          :highlightlayers="highlightlayers"
          :parentFolder="isGroup"
          :layerstree="_layerstree"
          :storeid="storeid"
          :parent="layerstree"
          :parent_mutually_exclusive="!!layerstree.mutually_exclusive">
        </tristate-tree>
      </span>
    </ul>

  </li>

</template>

<script>
import LayerLegend from 'components/CatalogLayerLegend.vue';
import CatalogEventHub from 'gui/catalog/vue/catalogeventhub';
import CatalogLayersStoresRegistry from 'store/catalog-layers';
import GUI from 'services/gui';

const { downloadFile } = require('core/utils/utils');

/**
 * Store `click` and `doubleclick` events on a single vue element.
 * 
 * @see https://stackoverflow.com/q/41303982
 */
const CLICK_EVENT = {
  count: 0,                                   // count click events
  timeoutID: null,                            // timeoutID return by setTimeout Function
  handleClick(callback, context) {
    CLICK_EVENT.count += 1;                   // increment click count
    if (!CLICK_EVENT.timeoutID) {             // skip and wait for timeout in order to detect double click
      CLICK_EVENT.timeoutID = setTimeout(() => {
        callback.call(context);
        CLICK_EVENT.reset();
      }, 300);
    }
  },
  reset() {
    CLICK_EVENT.count = 0;
    CLICK_EVENT.timeoutID = null;
  }
};

export default {
  props : [
    'layerstree',
    'storeid',
    'legend',
    'legendplace',
    'highlightlayers',
    'parent_mutually_exclusive',
    'parentFolder',
    'externallayers',
    'root',
    'parent'
  ],
  components: {
    'layerlegend': LayerLegend
  },
  data() {
    return {
      expanded: this.layerstree.expanded,
      isGroupChecked: true,
      controltoggled: false,
      n_childs: null,
      filtered: false
    }
  },
  computed: {
    showLegendLayer() {
      return !this.layerstree.exclude_from_legend;
    },
    showLayerTocLegend() {
      return !this.isGroup && this.showLegendLayer && this.layerstree.geolayer;
    },
    isGroup() {
      return !!this.layerstree.nodes
    },
    legendlayerposition() {
      return (this.showLegendLayer && this.layerstree.legend) ? this.legendplace : 'tab';
    },
    showscalevisibilityclass() {
      return !this.isGroup && this.layerstree.scalebasedvisibility
    },
    showScaleVisibilityToolip() {
      return this.showscalevisibilityclass && this.layerstree.disabled && this.layerstree.checked;
    },
    isTable() {
      return !this.isGroup && !this.layerstree.geolayer && !this.layerstree.external;
    },
    isHidden() {
      return this.layerstree.hidden && (true === this.layerstree.hidden);
    },
    selected() {
      this.layerstree.selected = (this.layerstree.disabled && this.layerstree.selected) ? false : this.layerstree.selected;
    },
    isHighLight() {
      return this.highlightlayers && !this.isGroup && CatalogLayersStoresRegistry.getLayerById(this.layerstree.id).getTocHighlightable() && this.layerstree.visible;
    },
    isInGrey() {
      return (!this.isGroup && !this.isTable && !this.layerstree.external && (!this.layerstree.visible || this.layerstree.disabled));
    }
  },
  watch:{
    'layerstree.disabled'(bool) {},
    'layerstree.checked'(n, o) {
      if (this.isGroup) {
        this.handleGroupChecked(this.layerstree);
      } else {
        this.handleLayerChecked(this.layerstree);
      }
    }
  },
  methods: {

    /**
     * Inizialize layer (disable, visible etc..)
     */
    init() {
      if (this.isGroup && !this.layerstree.checked) {
        this.handleGroupChecked(this.layerstree);
      }
      if (this.isGroup && !this.root) {
        this.layerstree.nodes.forEach(node => {
          if (node.id && this.parent_mutually_exclusive && !this.layerstree.mutually_exclusive) {
            node.uncheckable = true;
          }
        })
      }
    },

    /**
     * Handle change checked property of group
     * 
     * @param group
     */
    handleGroupChecked(group) {
      let { checked, parentGroup, nodes } = group;
      const setAllLayersVisible = ({nodes, visible}) => {
        nodes.forEach(node => {
          if (undefined !== node.id) {
            if (node.parentGroup.checked && node.checked) {
              CatalogLayersStoresRegistry.getLayerById(node.id).setVisible(visible);
            }
          } else {
            setAllLayersVisible({ nodes: node.nodes, visible: visible && node.checked });
          }
        });
      };
      if (checked) {
        const visible = parentGroup ? parentGroup.checked : true;
        if (parentGroup && parentGroup.mutually_exclusive) {
          parentGroup.nodes.forEach(node => {
            node.checked = node.groupId === group.groupId;
            if (node.checked) {
              setAllLayersVisible({ nodes: node.nodes, visible });
            }
          });
        } else {
          setAllLayersVisible({ nodes, visible });
        }
        while (parentGroup) {
          parentGroup.checked = parentGroup.root || parentGroup.checked;
          parentGroup = parentGroup.parentGroup
        }
      } else {
        nodes.forEach(node => {
          if (undefined !== node.id) {
            if (node.checked) {
              CatalogLayersStoresRegistry.getLayerById(node.id).setVisible(false);
            }
          } else {
            setAllLayersVisible({ nodes: node.nodes, visible: false });
          }
        });
      }
    },

    /**
     * Handle changing checked property of layer
     * 
     * @param layer
     */
    handleLayerChecked(layerObject) {
      let {checked, id, disabled, projectLayer=false, parentGroup} = layerObject;

      // in case of external layer
      if (!projectLayer) {
        GUI.getService('map').changeLayerVisibility({ id, visible: checked });
      } else {
        const layer = CatalogLayersStoresRegistry.getLayerById(id);
        if (checked) {
          const visible = layer.setVisible(!disabled);
          if (visible && 'toc' === this.legendplace) {
            setTimeout(() => CatalogEventHub.$emit('layer-change-style', { layerId: id }));
          }
          if (parentGroup.mutually_exclusive) {
            parentGroup.nodes.forEach(node => node.checked = node.id === id);
          }
          while (parentGroup) {
            parentGroup.checked = true;
            parentGroup = parentGroup.parentGroup;
          }
        } else {
          layer.setVisible(false);
        }
        CatalogEventHub.$emit('treenodevisible', layer);
      }
    },
    toggleFilterLayer() {
      CatalogEventHub.$emit('activefiltertokenlayer', this.storeid, this.layerstree);
    },
    clearSelection() {
      CatalogEventHub.$emit('unselectionlayer', this.storeid, this.layerstree);
    },
    toggle() {
      this.layerstree.checked = !this.layerstree.checked;
    },
    expandCollapse() {
      this.layerstree.expanded = !this.layerstree.expanded;
    },
    select() {
      if (!this.layerstree.external) {
        CatalogEventHub.$emit('treenodeselected',this.storeid, this.layerstree);
      }
    },

    /**
     * @TODO refactor this, almost the Same as `CatalogLayerContextMenu.vue::zoomToLayer(layer)`
     * 
     * @since v3.8 
     */
    zoomToLayer(layer) {
      GUI
        .getService('map')
        .goToBBox(
          [layer.bbox.minx, layer.bbox.miny, layer.bbox.maxx, layer.bbox.maxy],
          layer.epsg
        );
    },

    /**
     * @TODO refactor this, almost the same as: `CatalogLayerContextMenu.vue::canZoom(layer))`
     * 
     * @since v3.8
     */
    canZoom(layer) {
      return (layer.bbox && [layer.bbox.minx, layer.bbox.miny, layer.bbox.maxx, layer.bbox.maxy].find(coordinate => coordinate > 0));
    },
    
    /**
     * Handle `click` and `doubleclick` click events on a single tree item (TOC).
     * 
     * 1 = select legend item
     * 2 = zoom to layer bounds
     * 
     * @since v3.8
     */
     onTreeItemClick() {
      if (this.isGroup || this.isTable) { // Skip if TOC item is a Group or Table layer.
        return;
      }
      CLICK_EVENT.handleClick(() => {
        switch(CLICK_EVENT.count) {
          case 1: this.select(); break;
          case 2: this.canZoom(this.layerstree) && this.zoomToLayer(this.layerstree); break;
        }
      }, this);
    },

    triClass () {
      return this.g3wtemplate.getFontClass(this.layerstree.checked ? 'check' : 'uncheck');
    },

    downloadExternalLayer(download) {
      if (download.file) {
        downloadFile(download.file);
      } else if (download.url) {
        /** @FIXME missing implementation */
      }
    },

    removeExternalLayer(name, type) {
      GUI.getService('map').removeExternalLayer(name, wms);
    },

    showLayerMenu(layerstree, evt) {
      if (
        !this.isGroup &&
        (this.layerstree.openattributetable || this.layerstree.downloadable || this.layerstree.geolayer || this.layerstree.external)
      ) {
        CatalogEventHub.$emit('showmenulayer', layerstree, evt);
      }
    }

  },

  created() {
    // just firs time
    this.init();
  },

  async mounted() {
    await this.$nextTick();
    $('span.scalevisibility').tooltip();
  }

};
</script>