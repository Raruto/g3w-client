var t = require('i18n.service');

$('.content-wrapper').html(t('text1'));

var appUi = require('app.ui');
var appService = require('app.service');

var app = new Vue({
	el: 'body'
});

appService.setup();

module.exports = app;