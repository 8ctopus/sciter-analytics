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

Add to your project inside `<script type="module">`

```js
// import using npm
import Mixpanel from "node_modules/sciter-analytics/src/analytics.js";

// import from src
import Mixpanel from "src/analytics.js";

const mixpanel = new Mixpanel({
    // project token
    token: "c557e826f1a76aaa4ed02e4681f95ae4",
    // user unique id
    userId: Utils.uuid(),
    debug: true,
});

// add user properties
mixpanel.properties({
    // reserved properties
    $name: "John Doe",
    $email: "john.doe@test.com",

    // custom properties
    address: "Some street",
    birthday: "1987-02-11",
});

// log event
mixpanel.event("App started");

// watch for event
mixpanel.watch("focus", "plaintext", "plaintext focused");

// send data
mixpanel.send();
```

# other providers to consider

- https://segment.com/
- https://docs.smartlook.com/
