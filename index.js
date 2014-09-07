'use strict';

var tracing = require('tracing');
var logify = require('logify');

module.exports = function create(opts) {
  opts = opts || {};
  var logger = opts.logger || logify(opts.loggerOpts);
  var httpLogger = logger.component(opts.component || 'http');

  logger.serializers.http = function http() {
    var allowedReq = [
      'query',
      'header',
      'method',
      'length',
      'url',
      'path',
      'querystring',
      'type',
      'query',
      'protocol',
      'ip',
    ];
    var allowedRes = [
      'header',
      'status',
      'length',
      'type',
    ];
    if (!current) return;
    return {
      req: allowedReq.reduce(function(r, key) {
        r[key] = current.request[key];
        return r;
      }, {}),
      res: allowedRes.reduce(function(r, key) {
        r[key] = current.response[key];
        return r;
      }, {}),
    };
  };

  var current = null;

  return function* middleware(next) {
    var start = Date.now();
    this.logger = httpLogger.child();
    this.logger.context.http = true;
    var context = current = this;

    var listener = tracing.createAsyncListener({
      before: function before() {
        current = context;
      },
      after: function after() {
        current = null;
      },
    });
    yield* next;
    tracing.removeAsyncListener(listener);

    var duration = Date.now() - start;
    this.logger.info({
      action: 'query',
      duration: duration,
    }, 'Serving %s took %dms', this.path, duration);
  };
};

module.exports.error = function() {
  return function* (next) {
    try {
      yield* next;
    } catch(err) {
      this.logger.error(err);
    }
  };
};
