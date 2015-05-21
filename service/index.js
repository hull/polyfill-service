var NODE_ENV = process.env.NODE_ENV||'development',
    cluster  = require('express-cluster'),
    PORT     = Number(process.env.PORT) || 3000;
    compression = require('compression'),
    express  = require('express');
    app = require('./app');


function StartApp(worker) {
  app.get('/robots.txt', function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end("User-agent:*\nDisallow: /");
  });
  app.use(compression());

  return app.listen(PORT);
}

if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic')
}

Server = {
  start: function(){
    if (process.env.CLUSTER) {
      var workersCount = process.env.CLUSTER_WORKERS || require('os').cpus().length;
      cluster(StartApp, {
        respawn: true,
        count: workersCount
      });
    } else {
      StartApp({ process: {} });
    }
  }
}
Server.start();

module.exports = Server

console.log("Server listening on port: ", PORT);
