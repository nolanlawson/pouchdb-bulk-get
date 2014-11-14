
var replicate = require('./replicate');
var utils = require('../pouchdb/lib/utils');
var extend = require('pouchdb-extend');

exports.replicate = replicate.replicate;

/*************************** HTTP Adapter *********************************/

function patchHTTPAdapter(PouchDB) { 
  var HTTPAdapter = PouchDB.adapters.http;

  var patchedAdapter = function(opts, callback) { 
    HTTPAdapter.call(this, opts, callback);

    var ajaxOpts = opts.ajax || {};
    opts = utils.clone(opts);
    function ajax(options, callback) {
      return utils.ajax(utils.extend({}, ajaxOpts, options), callback);
    }

    this.getBulk = utils.adapterFun('getBulk', function (parameters, callback) {
      var options = {
        method : "POST",
        url : this.getUrl() + '_bulk_get',
        headers : this.getHeaders(),
        body : JSON.stringify({docs:parameters}),
        json : true,
        processData : true,
        timeout : 10000,
        cache : false
      };

      // Get the documents
      ajax(options, function (err, doc, xhr) {
        // If the document does not exist, send an error to the callback
        if (err) {
          return callback(err);
        }

        // Send the document to the callback
        callback(null, doc, xhr);
      });
    });
  };

  extend(true, patchedAdapter, HTTPAdapter);

  PouchDB.adapter('http', patchedAdapter);
  PouchDB.adapter('https', patchedAdapter);
};

exports.patchHTTPAdapter = patchHTTPAdapter;

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.replicate = exports.replicate;
  patchHTTPAdapter(window.PouchDB);
}
