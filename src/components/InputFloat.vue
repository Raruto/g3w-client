<!--
  @file
  @since v3.7
-->

<template>
  <baseinput :state="state">
    <input
      @change="change"
      @input="change"
      class="form-control"
      style="width:100%"
      :tabIndex="tabIndex"
      v-disabled="!editable"
      :class="{'input-error-validation' : notvalid}"
      v-model="state.value"
      slot="body"
      type="number"
      :step="state.step || 1"
      :placeholder="state.default">
  </baseinput>
</template>

<script>
const Input = require('gui/inputs/input');

export default {
  mixins: [Input],
};
</script>