# Description

A lightweight web management web interface for LXD.
Completely in JavaScript. Does not need an application server, database or any other
backend services. Just serve the static HTML and JS files.

# Status

This software is pre-alpha.

# installation

## LXD

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


## Prerequisites

Install npm, bower and a simple http server:
```
$ sudo apt-get install npm
$ sudo npm install -g bower
$ sudo npm install -g http-server
```

## Dependencies

install web dependencies for lxc-gui:
```
lxd-webgui$ bower install
```

## HTTP server

create certs for the http server:
```
lxd-webgui$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```


start http server to serve lxd-webgui:
```
lxd-webgui$ http-server -S -a localhost -p 8000 
```

## lxd configuration

### certs

Create a self-signed cert to authenticate to LXD:

```
$ cd ~/
$ mkdir lxc-cert
$ cd lxc-cert
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```
Content of certificate (CN, AU etc.) does not matter. 

Convert cert to pkcs12:
```
$ openssl pkcs12 -export -out cert.p12 -inkey key.pem -in cert.pem
```

Now, add the PKCS12 cert.p12 to your browser:
```
 Chrome: "Settings" -> "Manage Certificates" ->  "import" -> select the .p12 from above
```

### lxd configuration

Configure LXD to listen to localhost on port 9000, and allow access from localhost port 8000. 
Also add cert to the trusted certs for lxd. We also have to configure LXD to accept the PUT, DELETE and OPTIONS HTTP headers, and fix allowed headers to  include "Content-Type".
Afterwards, we NEED to restart it atm. 

```
$ sudo lxc config trust add cert.pem
$ sudo lxc config set core.https_address 127.0.0.1:9000
$ sudo lxc config set core.https_allowed_origin https://localhost:8000
$ sudo lxc config set core.https_allowed_methods "GET, POST, PUT, DELETE, OPTIONS"
$ sudo lxc config set core.https_allowed_headers "Origin, X-Requested-With, Content-Type, Accept"
$ sudo lxd restart
```


### debugging

try to access lxd-gui: https://localhost:8000

try to access lxd: https://localhost:9000




# security considerations

Do not let any other application run on the same domain+port as lxd-gui.


There is no CSRF protection for the LXD REST service. 

