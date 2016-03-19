# Description

A lightweight web management web interface for LXD.
Completely in JavaScript. Does not need an application server, database or any other
backend services. Just serve the static HTML and JS files.

# Status

This software is pre-alpha.

# basics

```
apt-get install npm
npm install -g bower
npm install -g http-server
```

install dependencies:
```
bower install
```

start http server to serer lxd-webgui:

```
http-server -a localhost -p 8000
```

# lxd configuration

##  certs

Create a self-signed cert to authenticate to LXD:

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```

Convert cert to pkcs12:
```
openssl pkcs12 -export -out cert.p12 -inkey key.pem -in cert.pem
```

## lxd configuration

Configure LXD to listen to localhost on port 9000, and allow access from localhost port 8000. Also add cert to the trusted certs for lxd. We also have to configure LXD to accept the PUT, DELETE and OPTIONS HTTP headers, and fix allowed headers to  include "Content-Type".

```
lxc config trust add cert.pem
lxc config set core.https_address 127.0.0.1:9000
lxc config set core.https_allowed_origin https://localhost:8000
lxc config set core.https_allowed_methods "GET, POST, PUT, DELETE, OPTIONS"
lxc config set core.https_allowed_headers "Origin, X-Requested-With, Content-Type, Accept"
```

## browser configuration

Now, add the PKCS12 cert.p12 to your browser (Chrome: Settings import certificate)


# debugging

try to access lxd-gui: https://localhost:8000

try to access lxd: https://localhost:9000



# security considerations

Do not let any other application run on the same domain+port as lxd-gui.
