PouchDB `_bulk_get` replication patch
=====

This plugin adds support for an experimental `_bulk_get` CouchDB endpoint. By adding the ability to fetch many documents in a single request during replication, speed is increased. If `_bulk_get` is not found then PouchDB will fall back to its regular algorithm.

This repository contains an nginx+lua shim but a CouchDB patch is available at https://github.com/dholth/couchdb/tree/1.6.x

Building
----
This plugin pulls in some parts of the pouchdb repository and expects it to exist at `../pouchdb/` . After that,

    npm install
    npm run build

Your plugin is now located at `dist/pouchdb.bulk-get.js` and `dist/pouchdb.bulk-get.min.js` and is ready for distribution.

Using
--------

To use this plugin, include it after `pouchdb.js` in your HTML page:

```html
<script src="pouchdb.js"></script>
<script src="pouchdb.bulk-get.js"></script>
```

It hasn't been tested in Node.js

