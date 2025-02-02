/**
 * @file
 * @since v3.7
 */

const { getAppLanguage } = require('core/i18n/i18n.service');

export default {
  methods: {
    getLanguage() {
      return getAppLanguage();
    },
    changeSelect(value) {
      this.state.value = value === 'null' ? null : value;
      this.change();
    },
    getValue(value) {
      return value === null ? 'null' : value;
    },
    resetValues() {
      this.state.input.options.values.splice(0);
    }
  },
  computed: {
    autocomplete() {
      return this.state.input.type === 'select_autocomplete' && this.state.input.options.usecompleter;
    },

  },
  watch:{
    async notvalid(value) {
      await this.$nextTick();
      if (this.select2)
        value ? this.select2.data('select2').$container.addClass("input-error-validation") : this.select2.data('select2').$container.removeClass("input-error-validation")
    }
  }
};