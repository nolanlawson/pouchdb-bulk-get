-- Add the missing _bulk_get API to CouchDB.

local cjson = require 'cjson'
local forward_headers = ngx.req.get_headers()
local body = ngx.req.read_body()
local query_args = ngx.req.get_query_args() -- then json-decode all the values
local post_args = ngx.req.get_body_data()
local db = ngx.var.db
local k, i, v

for k, v in pairs(query_args) do
    query_args[k] = cjson.decode(v)
end

ngx.header.content_type = 'application/json'

local json

local status, msg = pcall(function() json = cjson.decode(post_args) end)
if not status then
    ngx.say(cjson.encode({error="could not decode request body as json"}))
    return
end

-- don't want attachments as mime
ngx.req.set_header('accept', 'application/json') 

ngx.say('[')
for i, v in ipairs(json.docs) do
    local id = v['id']
    local args = {}
    v['id'] = nil
    -- combine query string arguments and per-item arguments
    for k,v in pairs(query_args) do
        args[k] = cjson.encode(v)
    end
    for k,v in pairs(v) do
        args[k] = cjson.encode(v)
    end
    local subreq = ngx.location.capture('/' .. db .. '/' .. id, {args=args})
    ngx.print(subreq.body)
    if i < #json.docs then
        ngx.say(',')
    end
end
ngx.say(']')
