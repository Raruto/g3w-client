var config = require('../test.inline_config');
var geoService = require('geo/service');

function service(){
    this.config = config;
    this.projectConfig = null;
};

geoService.on('loaded',function(){
    console.log("Caricato");
});

service.prototype.setup = function(){
    geoService.setup(config.group);
};

module.exports = new service();