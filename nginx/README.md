Experimental CouchDB _bulk_get shim
===================================

This folder contains an experimental implementation of a _bulk_get API for CouchDB implemented as an nginx extension in lua. When CouchDB is proxied behind nginx with this module, a _bulk_get endpoint is added to each database, exposing a way to make many CouchDB GET requests at once. Behind the scenes the lua extension breaks _bulk_get into many local GET requests to CouchDB.

Combined with support in PouchDB, replication is hundreds of times faster because you don't have to pay for as many round trips to the remote server.

Using the Shim
--------------

Install nginx with lua enabled. Use or modify dbproxy.conf to expose CouchDB
under http://localhost/db/. The new http://localhost/db/dbname/_bulk_get
API will be exposed. Mix with patched PouchDB for fast-enough replication.

