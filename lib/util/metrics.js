var fhComponentMetrics = require('fh-component-metrics');

var APP_TITLE = "cloud-app-" + process.env.FH_TITLE;
var config = {
  "enabled": !!process.env.METRICS_HOST,
  "host": process.env.METRICS_HOST,
  "port": process.env.METRICS_PORT
};

var middleware;
var metrics;
if(config && config.enabled){
  console.log("Metrics service enabled " + config.host);
  var metricsObj = fhComponentMetrics(config);
  metricsObj.memory(APP_TITLE, {interval: 2000}, function(err){
    if(err) console.error(err);
  });
  
  metricsObj.cpu(APP_TITLE, {interval: 2000}, function(err){
    if(err) console.error(err);
  });
  middleware = fhComponentMetrics.timingMiddleware(APP_TITLE, config)
  metrics = metricsObj;
}else{
  console.log("Metrics service disabled. Please configure METRICS_HOST and METRICS_PORT environment variables.")
}

var emptyFunction = function(){};

module.exports = {
  title: APP_TITLE,
  gauge : function(){
    if(metrics){
      return metrics.gauge;
    }
    return emptyFunction;
  },
  inc : function(){
    if(metrics){
      return metrics.inc;
    }
    return emptyFunction;
  },
  dec : function(){
    if(metrics){
      return metrics.dec;
    }
    return emptyFunction;
  },
  middleware: middleware
};
