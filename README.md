# sciter analytics

![latest version](https://img.shields.io/npm/v/sciter-analytics.svg)
![downloads](https://img.shields.io/npm/dy/sciter-analytics.svg)

This is a [sciter.js](https://sciter.com/) package designed for in-app analytics.

The primary goal is to track user interactions within the application to gain insights that help enhance the overall user experience. By analyzing user behavior, we can optimize the app's functionality and design to better meet user needs.

Two types of events are recorded:

  * events that are triggered by user actions (e.g. clicking a button)
  * events that are triggered by the application (e.g. a page is loaded)

The following application analytics providers have been implemented:

- [Mixpanel](https://mixpanel.com/) - 90% tested
- [Amplitude](https://amplitude.com/) - not fully tested

## demo

- git clone the repository
- install packages `npm install`
- install the latest sciter sdk `npm run install-sdk`
- update the mixpanel project token or amplitude api key in `main.htm`
- start the demo `npm run scapp`

### demo requirements

- A recent version of Node.js `node` (tested with 22 LTS) and its package manager `npm`.
    - On Windows [download](https://nodejs.dev/download/) and run the installer
    - On Linux check the [installation guide](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-2-%E2%80%94-installing-node-js-with-apt-using-a-nodesource-ppa)

## add to your project

You can either add it to your project using npm or by copying the src directory.

### using npm

- install package `npm install sciter-analytics`

### copy source

- add the `src` dir to your project

### add to `<script type="module">`

```js
// using npm
import Mixpanel from "node_modules/sciter-analytics/src/mixpanel.js";
import Amplitude from "node_modules/sciter-analytics/src/amplitude.js";

// copying src
import Mixpanel from "src/mixpanel.js";
import Amplitude from "src/amplitude.js";
```

### Mixpanel example

```js
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

### Amplitude example

```js
const amplitude = new Amplitude({
    apikey: "0fad02b65a75f270c199db6b920fbf92",
    userId: Utils.randomStr(10),
    debug: true,
    eventProperties: {
        appName: "Sciter analytics",
        appRelease: "debug",
    },
});

amplitude.event("Start app");

// watch app close
amplitude.watch("closerequest", undefined, "App close request");

// watch app install click
amplitude.watch("click", "#installApp1", "Install app", {
    appName: "app 1",
});

amplitude.watch("click", "#installApp2", "Install app", {
    appName: "app 2",
});

amplitude.watch("click", "#installApp3", "Install app", {
    appName: "app 3",
});
```

# other providers to consider

- https://segment.com/
- https://docs.smartlook.com/

## todo

- implement generic tracking class? and make conversion on server to mixpanel specific?
- implement proxy because we will be stuck if we plan to stop using mixpanel
- distinguish between users using the same ip - user account, computer name is not possible
- what to do when we have no user id? ask mixpanel to create it or we create it? if yes, how do we get it from mixpanel?
- mixpanel - what happens if id is not passed in constructor?
- add auto-send option
