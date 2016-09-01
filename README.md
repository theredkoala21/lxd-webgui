# Description

A lightweight web management web interface for LXD.

Written completely in AngularJS. Does not need an application server, database or other backend services. Just serve the static HTML and JS files and go!

# Status

This software is beta.

## Browser support

Works best in Chrome. Works in Firefox. Safari is currently not supported.

# Screenshot

![Screenshot](/doc/screenshot-overview.png?raw=true "Screenshot")

# installation

The installation procedure is as follows:
- Install LXD (if not already happened)
- Install LXD-WEBGUI
- Create a client certificate and install it into the browser, and lxd
- Configure lxd to listen to localhost/network


## Install LXD itself

install lxd as described here:
 - https://linuxcontainers.org/lxd/getting-started-cli/
 - https://www.stgraber.org/2016/03/15/lxd-2-0-installing-and-configuring-lxd-212/

My lxd init looks like this:
```
$ sudo lxd init
Name of the storage backend to use (dir or zfs): zfs
Create a new ZFS pool (yes/no)? yes
Name of the new ZFS pool: lxdpool
Would you like to use an existing block device (yes/no)? no
Size in GB of the new loop device (1GB minimum): 16
Would you like LXD to be available over the network (yes/no)? no
LXD has been successfully configured.
```

## Install LXD-WEBGUI

### Prerequisites

Install npm, bower and a simple http server:
```
$ sudo apt-get install npm
$ sudo npm install -g bower
$ sudo npm install -g http-server
```

### checkout LXD-WEBGUI

```
$ git clone https://github.com/dobin/lxd-webgui.git
$ cd lxd-webgui
```


### Dependencies

install web dependencies for lxc-gui:
```
lxd-webgui$ bower install
```

### HTTP server

create certs for the http server:
```
lxd-webgui$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```


start http server to serve lxd-webgui:
```
lxd-webgui$ http-server -S -a localhost -p 8000
```

Of course you can just put the file to be served via Apache (/var/www) or any other web server.
They are just static files.

## lxd configuration

### certs

Create a self-signed cert to authenticate to LXD:

```
$ cd ~/
$ mkdir lxc-cert
$ cd lxc-cert
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```
Content of certificate (CN, AU etc.) does not really matter, but should contain something
like "LXD" so you are able to select the correct cert when prompted.

Convert cert to pkcs12:
```
$ openssl pkcs12 -export -out cert.p12 -inkey key.pem -in cert.pem
```

Now, add the PKCS12 cert.p12 to your browser, or your OS:
```
 Chrome: "Settings" -> "Manage Certificates" ->  "import" -> select the .p12 from above
 Firefox: "Preferences" -> "Advanced" -> "Certificates" -> "View Certificates" -> "(Your Certificates)" -> "Import"
```

Internet Explorer / Edge and Chrome will use the Windows/OSX certificate store. Firefox has its own certificate store.


## lxd configuration

Most importantly, we have the add the above client certificate
(~/lxd-cert/cert.pem) into the trusted certs of lxd:
```
$ sudo lxc config trust add cert.pem
```

Configure LXD to listen to localhost on port 9000, and allow access from localhost port 8000 (where LXD-WEBGUI lives). We also have to configure LXD to accept the PUT, DELETE and OPTIONS HTTP headers, and fix allowed headers to  include "Content-Type".
Afterwards, we NEED to restart it atm.

```
$ sudo lxc config set core.https_address 127.0.0.1:9000
$ sudo lxc config set core.https_allowed_origin https://localhost:8000
$ sudo lxc config set core.https_allowed_methods "GET, POST, PUT, DELETE, OPTIONS"
$ sudo lxc config set core.https_allowed_headers "Origin, X-Requested-With, Content-Type, Accept"
$ sudo lxc config set core.https_allowed_credentials "true"
$ sudo lxd restart
```

## LXD-WEBGUI network access

If you want to access LXD-WEBGUI via the network, configure LXD to listen
to the network with:
```
$ sudo lxc config set core.https_address <your-ip>:9000
$ sudo lxc config set core.https_allowed_origin *
```

This will allow anyone with a valid client cert to access the LXD API.
You'll have to import the client certificate (p12) into the browser which
you are using to access LXD-WEBGUI.

You can specify the LXD API server in the "Settings" tab in LXD-WEBGUI.


## start

important:
try to access lxd API: https://localhost:9000
(and accept the certificate warning)


access LXD-WEBGUI: https://localhost:8000


# FAQ

## Whats up with all the certs?

LXD provides a REST based API via HTTPS webserver (here :9000). This webserver needs a server certificate.

LXD-WEBGUI is served via HTTPS via a webserver. This also needs a server certificate.

The authentication to the LXD API is performed via a client certificate. This certificate is stored in the
browser of the user. LXD-WEBGUI performs HTTP requests to the API, which is authenticated via this client cert.


# security considerations

Do not let any other application run on the same domain+port as LXD-WEBGUI.

There is no CSRF protection for the LXD REST service.
