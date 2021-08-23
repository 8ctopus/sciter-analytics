# sciter in-app analytics

This is a [sciter.js](https://sciter.com/) in-app analytics experiment.
The general idea is to record what users do within the application.

The app records:
- environment variables: app name, version, operating system, ...
- events: whatever event you want to track

## demo

- git clone the repository
- run `install.bat` to download the latest sciter binaries and the sciter package manager
- install packages `php spm.phar install`
- run `scapp.bat`
- to refresh the app after changes to the html/css click `F5`

# endpoints to test

- https://segment.com/
- https://docs.smartlook.com/
- https://developer.mixpanel.com/
- https://developers.amplitude.com/docs
- https://httpbin.org/

# todo

- fix uuid
