# sciter in-app analytics

This is a [sciter.js](https://sciter.com/) in-app analytics experiment.
The general idea is to record what users do within the application.

The app records:
- environment variables: app name, version, operating system, ...
- events: whatever event you want to track

## demo

- git clone the repository
- on Linux/Mac `chmod +x install.sh start.sh`
- run `install.bat` (Win) or `./install.sh` (Linux/Mac) to download the latest sciter binaries and the sciter package manager
- install packages `php bin/spm.phar install`
- run `start.bat` (Win) or `./start.sh` (Linux/Mac)

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
