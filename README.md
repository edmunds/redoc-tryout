# Redoc Try-out

This is a stopgap solution to provide the Try-Out feature to Redoc: [https://github.com/Rebilly/ReDoc/issues/53](https://github.com/Rebilly/ReDoc/issues/53)

This implementation uses JQuery, standing aside of ReDoc waiting it to be fully loaded, and then arms the buttons with click listener. A separate Ajax call is made to load swagger.json just for the *Try-out* feature. When a click happens on `Try-Out` button, a form is generated following swagger.json.

Demo:
[http://technology.edmunds.com/redoc-tryout/demo.html](http://technology.edmunds.com/redoc-tryout/demo.html)


## How to Run

Clone the project. Open demo.html in the browser. The `Try-Out` button should show up below each method on right panel. Click on `Try-Out` to bring up the form. Click `Send` to make the http request. Note that since this is a bowser Ajax call, your api should respond with the correct CORS header when redoc is deployed in a separate host.

## How to Configure

Global variable `var defaultHost`: by default, the http will take in the .host property in the swagger.json. If the swagger.json doesn't have a .host property, `defaultHost` will be applied.

Global variable `var redocLoadingWaitTime`: this value in miliseconds is used for The Try-Out feature to wait for ReDoc to be fully loaded.


