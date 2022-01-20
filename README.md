# sciter in-app analytics

This is a [sciter.js](https://sciter.com/) in-app analytics experiment.
The general idea is to record what users do within the application.

The app records:
- environment variables: app name, version, operating system, ...
- events: whatever event you want to track

===== IT IS WORK IN PROGRESS =====

## demo

- git clone the repository
- install packages `npm install`
- install latest sciter sdk `npm run install-sdk`
- start the demo `npm run scapp`

## demo requirements

- A recent version of Node.js `node` (tested with 16 LTS) and its package manager `npm`.
    - On Windows [download](https://nodejs.dev/download/) and run the installer
    - On Linux check the [installation guide](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-2-%E2%80%94-installing-node-js-with-apt-using-a-nodesource-ppa)

## add to your project

### using npm

- install package `npm install sciter-analytics`

### using source

- copy the `src` dir to your project

Add to your project

```js
<script type="module">

// import from node
import Analytics from "node_modules/sciter-analytics/src/analytics.js";

// import from src
import Analytics from "src/analytics.js";

// initialize
Analytics.init({
    log: true,
    endpoint: "http://localhost/index.php",
    //endpoint: "https://httpbin.org/post",
});

// add more environmental variables
Analytics.env({
    name: "my app name",
    version: "0.0.1",
    uuid: uuid(),
});

// log event
Analytics.event("app started");

// watch
Analytics.watch("focus", "plaintext", "plaintext focused");

// log what happened
Analytics.log();

// send data
Analytics.send();
```

# endpoints to test

- https://segment.com/
- https://docs.smartlook.com/
- https://developer.mixpanel.com/
- https://developers.amplitude.com/docs
- https://httpbin.org/

# todo

- fix uuid
- add first endpoint
- test fetch error management - https - server refused answer - server error
