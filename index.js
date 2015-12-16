'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var origin = window.location.origin;

var isStarted = false;

var automagic = {
    baseUri: 'Scripts/',
    port: 3912,
    fileChanged: 'fileChanged'
};

automagic.init = function () {
    if (isStarted) {
        console.error('automagic has already been initialised - ensure that \'automagic.init() is not part of a file being reloaded\'');
        return;
    }

    isStarted = true;
    var socket = (0, _socketIoClient2['default'])('//localhost:' + automagic.port, { secure: true });

    socket.on(automagic.fileChanged, function (e) {
        var doneList = [];
        refresh(e.fileName, doneList);
    });
};

var getFullyQualifiedName = function getFullyQualifiedName(fileName) {
    return origin + '/' + automagic.baseUri + fileName;
};

function refresh(fileName, doneList) {
    var fullyQualifiedName = getFullyQualifiedName(fileName);

    //prevent circular references
    if (doneList.includes(fullyQualifiedName)) {
        return;
    }

    if (System.has(fullyQualifiedName)) {
        System['delete'](fullyQualifiedName);
    }
    System['import']('' + automagic.baseUri + fileName);
    doneList = [].concat(_toConsumableArray(doneList), [fullyQualifiedName]);

    var next = getNextDependent(fileName, doneList);
    if (next) {
        refresh(next, doneList);
    }
}

//TODO: turn into a generator
function getNextDependent(fileName, doneList) {
    var dependencyName = '' + automagic.baseUri + fileName;

    var keys = Object.keys(System.loads);
    for (var i = 0; i < keys.length; i++) {
        var loaded = System.loads[keys[i]];
        var nextFileNameIndex = loaded.name.lastIndexOf('/') + 1;
        var nextFileName = loaded.name.substring(nextFileNameIndex);

        if (loaded.deps.includes(dependencyName) && !doneList.includes(nextFileName)) {
            return nextFileName;
        }
    }
    return null;
}

exports['default'] = automagic;
module.exports = exports['default'];
