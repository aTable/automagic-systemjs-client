'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var origin = window.location.origin;

var automagic = {
    baseUri: 'Scripts/',
    port: 3912
};

automagic.init = function () {
    var socket = (0, _socketIoClient2['default'])('//localhost:' + automagic.port, { secure: true });
    socket.on('fileChanged', function (e) {
        refreshModule(e);
    });
};

function getDependentModules(fileName) {
    Object.keys(System.loads).forEach(function (x) {
        var item = System.loads[x];
        var dependentIndex = item.deps.indexOf('' + automagic.baseUri + fileName);
        if (dependentIndex >= 0) {
            console.log('affected module', dependentIndex);
            refreshModule(e);
        }
    });
}

function refreshModule(e) {
    var fullyQualifiedName = origin + '/' + automagic.baseUri + e.fileName;

    if (System.has(fullyQualifiedName)) {
        System['delete'](fullyQualifiedName);
    }
    System['import']('' + automagic.baseUri + e.fileName);
}

exports['default'] = automagic;
module.exports = exports['default'];
