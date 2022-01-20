# sciter in-app analytics

This is a [sciter.js](https://sciter.com/) in-app analytics experiment.
The general idea is to record what users do within the application.

The app records:
- environment variables: app name, version, operating system, ...
- events: whatever event you want to track

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
