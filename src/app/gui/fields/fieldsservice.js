import utils from 'core/utils/utils';
import CatalogLayersStoresRegistry from 'core/catalog/cataloglayersstoresregistry';
import Fields from './fields';

const URLPattern = /^(https?:\/\/[^\s]+)/g;
const PhotoPattern = /[^\s]+.(png|jpg|jpeg|gif)$/g;
const FieldType = {
  SIMPLE: 'simple',
  GEO: 'geo',
  LINK: 'link',
  PHOTO: 'photo',
  PHOTOLINK: 'photolink',
  IMAGE: 'image',
  POINTLINK: 'pointlink',
  ROUTE: 'route',
  VUE: 'vue',
};

export default {
  /**
   * Get Type field from field value
   * field : Object contain the value of the field
   * @param field
   * @returns {string}
   */
  getType(field) {
    let { type } = field;
    if (type !== 'vue') {
      const fieldValue = field.value;
      const value = fieldValue && utils.toRawType(fieldValue) === 'Object' && !fieldValue.coordinates && !fieldValue.vue ? fieldValue.value : fieldValue;
      if (!value) type = FieldType.SIMPLE;
      else if (value && typeof value === 'object') {
        if (value.coordinates) type = FieldType.GEO;
        else if (value.vue) type = FieldType.VUE;
      } else if (value && Array.isArray(value)) {
        if (value.length && value[0].photo) type = FieldType.PHOTO;
        else type = FieldType.SIMPLE;
      } else if (value.toString().toLowerCase().match(PhotoPattern)) {
        type = FieldType.PHOTO;
      } else if (value.toString().match(URLPattern)) {
        type = FieldType.LINK;
      } else type = FieldType.SIMPLE;
    }
    return `${type}_field`;
  },
  isSimple(field) {
    return this.getType(field) === `${FieldType.SIMPLE}_field`;
  },
  isLink(field) {
    return this.getType(field) === `${FieldType.LINK}_field`;
  },
  isImage(field) {
    return this.getType(field) === `${FieldType.IMAGE}_field`;
  },
  isPhoto(field) {
    return this.getType(field) === `${FieldType.PHOTO}_field`;
  },
  isVue(field) {
    return this.getType(field) === `${FieldType.VUE}_field`;
  },
  /**
   * Method to add a new field type to Fields
   * @param type
   * @param field
   */
  add({ type, field }) {
    Fields[type] = field;
  },
  /**
   * Remove field from Fields list
   * @param type
   */
  remove(type) {
    delete Fields[type];
  },
  /**
   * chenge type of field (example to set vue type)
   * @param layerId
   * @param field
   */
  changeConfigFieldType({ layerId, field = {} }) {
    const layer = CatalogLayersStoresRegistry.getLayerById(layerId);
    layer.changeConfigFieldType(field);
  },
  /**
   * Reset origin type
   * @param layerId
   * @param field
   */
  resetConfigFieldType({ layerId, field = {} }) {
    const layer = CatalogLayersStoresRegistry.getLayerById(layerId);
    layer.resetConfigField(field);
  },
};
