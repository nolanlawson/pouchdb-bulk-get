
var replicate = require('./replicate');
var utils = require('../pouchdb/lib/utils');
var extend = require('pouchdb-extend');

exports.replicate = replicate.replicate;

/*************************** HTTP Adapter *********************************/

// Generate a URL with the host data given by opts and the given path
function genDBUrl(opts, path) {
  return genUrl(opts, opts.db + '/' + path);
}

// Generate a URL with the host data given by opts and the given path
function genUrl(opts, path) {
  if (opts.remote) {
    // If the host already has a path, then we need to have a path delimiter
    // Otherwise, the path delimiter is the empty string
    var pathDel = !opts.path ? '' : '/';

    // If the host already has a path, then we need to have a path delimiter
    // Otherwise, the path delimiter is the empty string
    return opts.protocol + '://' + opts.host + ':' + opts.port + '/' +
           opts.path + pathDel + path;
  }

  return '/' + path;
}

// Get a bunch of documents by doing a bulk get for each set of 'GET' options in
// a parameters array. Requires CouchDB API extension.
exports.getBulk = utils.adapterFun('getBulk', function (parameters, callback) {
  var options = {
    method : "POST",
    url : genDBUrl(host, '_bulk_get'),
    headers : host.headers,
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

function patchHTTPAdapter(PouchDB) { 
  var HTTPAdapter = PouchDB.adapters.http;

  var patchedAdapter = function(opts, callback) { 
    HTTPAdapter.call(this, opts, callback);
    this.getBulk = exports.getBulk;
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
