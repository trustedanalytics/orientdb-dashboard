/**
 * Copyright (c) 2016 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var listen_port = process.env.PORT;

var vcap_services  = JSON.parse(process.env.VCAP_SERVICES);

var target_hostname = vcap_services["orientdb"][0].credentials["hostname"];
var target_port = vcap_services["orientdb"][0].credentials["ports"]["2480/tcp"];

console.log("Setting up proxy to " , target_hostname, ":" , target_port);

var http = require('http'),
    httpProxy = require('http-proxy'),
    auth = require('http-auth');

var proxy = httpProxy.createProxyServer({   target: {
    host: target_hostname,
    port: target_port
  },ws: true, web:true});

var server = http.createServer(function(req, res) {
  proxy.web(req, res);
});

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

console.log("Listening on port " + listen_port);
server.listen(listen_port);
