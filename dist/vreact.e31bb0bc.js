// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"vdom/domschema.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\nattribute#0000 name:string value:string\nHTMLNode#0002 tag:int16 attrs:Array<attribute> nodes:Array<HTMLNode|TextNode>\nTextNode#0003 text:string\n";
exports.default = _default;
},{}],"vdom/schema.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.names = exports.types = void 0;

var _domschema = _interopRequireDefault(require("./domschema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var retrievedSchema;
exports.types = retrievedSchema;
var retrievedNames = {};
exports.names = retrievedNames;

var getSchema = function getSchema() {
  if (retrievedSchema) return retrievedSchema;

  var data = _domschema.default.trim().split('\n').filter(function (row) {
    return row && !row.includes('---functions---');
  }).reduce(function (res, next) {
    var _next$trim$split = next.trim().split(' = '),
        _next$trim$split2 = _slicedToArray(_next$trim$split, 2),
        input = _next$trim$split2[0],
        output = _next$trim$split2[1];

    var hasFlags = input.includes('flags');

    var _input$replace$split = input.replace('Array ', 'Array_').split(' '),
        _input$replace$split2 = _toArray(_input$replace$split),
        nameAndId = _input$replace$split2[0],
        params = _input$replace$split2.slice(1);

    var _nameAndId$split = nameAndId.split('#'),
        _nameAndId$split2 = _slicedToArray(_nameAndId$split, 2),
        name = _nameAndId$split2[0],
        id = _nameAndId$split2[1];

    var paramsParsed = params.map(function (param) {
      param = param.replace(/[{}]/).split(':');
      if (!param.length || param.length === 1) return;

      var _param = param,
          _param2 = _slicedToArray(_param, 2),
          name = _param2[0],
          type = _param2[1];

      if (type.includes('flags')) {
        var _type$split = type.split(/[.?]/),
            _type$split2 = _slicedToArray(_type$split, 3),
            flag = _type$split2[1],
            fieldType = _type$split2[2];

        type = {
          flag: flag,
          fieldType: fieldType
        };
      } else if (type.includes('int')) {
        type = {
          fieldType: 'int',
          length: type.substr(3)
        };
      } else if (type.includes('Array')) {
        type = {
          fieldType: 'array',
          arrayType: type.split('<')[1].replace('>', '').split('|')
        };
      } else type = {
        fieldType: type
      };

      return {
        name: name,
        type: type
      };
    }).filter(function (item) {
      return item;
    });
    res.schema[name.toLowerCase()] = {
      id: id,
      params: paramsParsed,
      hasFlags: hasFlags,
      output: output
    };
    res.names[id] = name.toLowerCase();
    return res;
  }, {
    schema: {},
    names: {}
  });

  var schema = data.schema,
      names = data.names;
  exports.types = retrievedSchema = schema;
  exports.names = retrievedNames = names;
  return schema;
};

getSchema();
window.types = retrievedSchema;
window.names = retrievedNames;
},{"./domschema":"vdom/domschema.js"}],"vdom/hex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Hex = function Hex() {
  _classCallCheck(this, Hex);
};

_defineProperty(Hex, "addZeros", function () {
  var hex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  hex = String(hex);

  while (hex.length < length) {
    hex = '0' + hex;
  }

  return hex;
});

_defineProperty(Hex, "random", function () {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  var id = [];

  while (id.length !== length) {
    id.push(Math.floor(Math.random() * 0xff));
  }

  return id.map(function (item) {
    return addHexZero(item.toString(16));
  }).join('');
});

_defineProperty(Hex, "fromNumber", function () {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  return Hex.addZeros(number.toString(16), length);
});

_defineProperty(Hex, "fromString", function () {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  string = unescape(encodeURIComponent(string));
  var out = [];

  for (var i = 0; i < string.length; i++) {
    out.push(string.charCodeAt(i).toString(16));
  }

  return Hex.addLength(out.map(function (item) {
    return Hex.addZeros(item);
  }).join(''));
});

_defineProperty(Hex, "addLength", function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var out = [];
  var length = input.length;
  if (length <= 253) out.push(length);else out = out.concat([254, length & 0xFF, (length & 0xFF00) >> 8, (length & 0xFF0000) >> 16]);
  var mappedOut = out.map(function (item) {
    return Hex.addZeros(item.toString(16));
  });
  return Array.isArray(input) ? [].concat(_toConsumableArray(mappedOut), _toConsumableArray(input)).join('') : mappedOut.join('') + input;
});

_defineProperty(Hex, "getWithLength", function () {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _Hex$getLength = Hex.getLength(string),
      length = _Hex$getLength.length,
      start = _Hex$getLength.start;

  return {
    length: length,
    offset: start + length,
    str: string.slice(start, length)
  };
});

_defineProperty(Hex, "getArrayWithLength", function () {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _Hex$getLength2 = Hex.getLength(string),
      length = _Hex$getLength2.length,
      start = _Hex$getLength2.start;

  string = string.slice(start);
  var offset = 0;
  var arr = [];

  for (var i = 0; i < length; i++) {
    var _Hex$getLength3 = Hex.getLength(string.slice(offset)),
        _length = _Hex$getLength3.length,
        _start = _Hex$getLength3.start;

    offset += _length + _start;
    arr.push(string.slice(_start, _length));
  }

  return arr;
});

_defineProperty(Hex, "getLength", function () {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var length = parseInt(string.slice(0, 2), 16);
  var start = 2;

  if (length > 254) {
    length = parseInt(string.slice(0, 8), 16);
    start = 8;
  }

  return {
    length: length,
    start: start
  };
});

var _default = Hex;
exports.default = _default;
},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"node_modules/process/browser.js"}],"vdom/SL.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deserialization = exports.Serialization = void 0;

var _schema = require("./schema");

var _hex = _interopRequireDefault(require("./hex"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TypesIn = function TypesIn() {
  _classCallCheck(this, TypesIn);
};

_defineProperty(TypesIn, "int", function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
  data = typeof data === 'string' ? data : _hex.default.fromNumber(data, length / 8);
  return data;
});

_defineProperty(TypesIn, "string", function () {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return _hex.default.fromString(str);
});

_defineProperty(TypesIn, "array", function () {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      arrayType = _ref.arrayType;

  items = items ? items : []; // TODO: Bad code

  if (items.__proto__.constructor.assign) {
    items = Object.entries(items).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          name = _ref3[0],
          value = _ref3[1];

      return String(_schema.types[arrayType[0]].id) + new Serialization(arrayType[0], {
        name: name,
        value: value
      }).getHex();
    });
  } else items = items.map(function (item) {
    var type = _typeof(item) === 'object' ? 'HTMLNode' : 'TextNode';
    if (type === 'HTMLNode') return _hex.default.addLength(_schema.types.htmlnode.id + item.child);else return _hex.default.addLength(_schema.types.textnode.id + new Serialization(type, {
      text: item
    }).getHex());
  });

  return Array.isArray(items) && items.length ? _hex.default.addLength(_hex.default.addLength(items)) : '00000000';
});

var TypesOut = function TypesOut() {
  _classCallCheck(this, TypesOut);
};

_defineProperty(TypesOut, "int", function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var type = arguments.length > 1 ? arguments[1] : undefined;
  var _type$length = type.length,
      length = _type$length === void 0 ? 128 : _type$length;
  length = length / 4;
  return {
    item: data.slice(0, length),
    res: data.slice(length)
  };
});

_defineProperty(TypesOut, "bytes", function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    res: [],
    item: data
  };
});

_defineProperty(TypesOut, "string", function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (data.length === 0) return '';
  var offset = 0;
  var start = 0;
  var length = parseInt(data.slice(0, 2), 16);

  if (length > 254) {
    length = parseInt(data.slice(0, 8), 16);
    offset = 8;
    start = 8;
  } else {
    offset = 2;
    start = 2;
  }

  offset += length;
  var str = [];

  for (var i = 0; i < length; i += 2) {
    str.push(String.fromCharCode(parseInt(data[i] + data[i + 1], 16)));
  }

  var res = str.filter(function (item) {
    return item;
  }).join('');
  return {
    item: res,
    res: data.slice(offset)
  };
});

_defineProperty(TypesOut, "array", function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var type = arguments.length > 1 ? arguments[1] : undefined;
  if (!data || !data.length) return console.error('No data to parse long from.');
  if (data.slice(0, 8) === '00000000') return {
    item: null,
    res: data.slice(8)
  };
  var arrayType = type.arrayType;
  var arrayTypes = arrayType.reduce(function (t, n) {
    var id = _schema.types[n.toLowerCase()].id;

    t[id] = _schema.names[id];
    return t;
  }, {});

  var parsedData = _hex.default.getWithLength(data);

  var items = _hex.default.getArrayWithLength(parsedData.str).map(function (item) {
    var type = item.slice(0, 4);
    var actualType = arrayTypes[type];
    if (!actualType) throw new Error('Unknown array type!');
    console.log(actualType, item);
    var data = new Deserialization(actualType, item.slice(4));
    console.log(data);
  }); // const itemtype = str.slice(0, 4)
  // console.log(str, itemtype, length)


  return {
    item: [],
    res: ''
  };
});

_defineProperty(TypesOut, "long", function (data) {
  if (!data || !data.length) return console.error('No data to parse long from.');
  var item = Bytes.toHex(data.slice(0, 8));
  return {
    item: item,
    res: data.slice(8)
  };
});

_defineProperty(TypesOut, "name", function (data) {
  if (!data || !data.length) return console.error('No data to parse long from.');
  return {
    item: Bytes.toHex(data.slice(0, 4)),
    res: data.slice(4)
  };
});

var Serialization = function Serialization(_name, _params) {
  var _this = this;

  _classCallCheck(this, Serialization);

  _defineProperty(this, "hex", '');

  _defineProperty(this, "serialize", function () {
    var inputName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var inputParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!inputName) throw new Error('Nothing to serialize');

    var object = _schema.types[inputName.toLowerCase()];

    if (!object) throw new Error('Unknown name: ' + inputName);
    var params = object.params,
        _object$output = object.output,
        output = _object$output === void 0 ? '' : _object$output;
    params.forEach(function (param) {
      var name = param.name,
          type = param.type;
      var ser = String(TypesIn[type.fieldType](inputParams[name], type));
      _this.hex = _this.hex + ser || '00000000';
    });
    return output;
  });

  _defineProperty(this, "getHex", function () {
    return _this.hex;
  });

  if (_name && _params) this.serialize(_name, _params);
};

exports.Serialization = Serialization;

var Deserialization = function Deserialization(_name2, _data) {
  var _this2 = this;

  _classCallCheck(this, Deserialization);

  _defineProperty(this, "fields", {});

  _defineProperty(this, "deserialize", function () {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (!name) throw new Error('No name');
    if (!data) throw new Error('Nothing to deserialize');

    var object = _schema.types[name.toLowerCase()];

    console.log(object);
    if (!object) throw new Error('No object for: ' + name);
    object.params.forEach(function (field) {
      var name = field.name,
          type = field.type;

      var _TypesOut$type$fieldT = TypesOut[type.fieldType](data || [], type),
          res = _TypesOut$type$fieldT.res,
          item = _TypesOut$type$fieldT.item;

      data = res;
      _this2.fields[name] = item;
    });
    _this2.name = _schema.names[_this2.fields.name];
  });

  if (_name2 && _data) this.deserialize(_name2, _data);
};

exports.Deserialization = Deserialization;
},{"./schema":"vdom/schema.js","./hex":"vdom/hex.js","path":"node_modules/path-browserify/index.js"}],"vreact.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToHTML = exports.Component = exports.default = void 0;

var _schema = require("./vdom/schema");

var _SL = require("./vdom/SL");

var _hex = _interopRequireDefault(require("./vdom/hex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

console.log(_schema.types);
var vreact = {};
var tree = '';
var tags = ['div', 'span', 'p', 'h1'].reduce(function (all, next, i) {
  var hex = (i + 1).toString(16);
  all[next] = _hex.default.addZeros(hex, 4);
  return all;
}, {});
console.log(tags);

var Component = function Component() {
  var _this = this;

  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _classCallCheck(this, Component);

  _defineProperty(this, "state", {});

  _defineProperty(this, "setState", function (obj) {
    Object.entries(obj).forEach(function (entry) {
      var _entry = _slicedToArray(entry, 2),
          key = _entry[0],
          value = _entry[1];

      _this.state[key] = value;
      updateElement(_this._id, _this.render());
    });
  });

  if (props.id) this._id = props.id;
  this.children = children;
};

exports.Component = Component;

_defineProperty(Component, "isClass", true);

var parseTree = function parseTree() {
  var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var mainObject = new _SL.Deserialization('HTMLNode', tree);
  console.log(mainObject);
};

var renderToHTML = function renderToHTML(query, _ref) {
  var item = _ref.child;
  // console.log('qwe', item)
  parseTree(item); // document.querySelector(query).appendChild(item.render())
};

exports.renderToHTML = renderToHTML;

var _default = function _default(tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  console.log(tag, attrs, children);
  var element = tags[tag];
  var type = typeof tag === 'string' ? 'HTMLNode' : '';
  var text = children.reduce(function (str, next) {
    return typeof next === 'string' ? next + str : str;
  }, '');
  var hexView = new _SL.Serialization(type, {
    tag: element,
    text: text,
    nodes: children,
    attrs: attrs
  }).getHex();
  console.log(hexView);
  return {
    child: hexView
  };
  var id = "El".concat(String(Math.random()).replace('.', ''));
  if (typeof tag === 'function') return new tag({
    id: id,
    children: children
  });
  console.log(tag, attrs, children);

  if (typeof tag === 'string') {
    return;
  }
};

exports.default = _default;
},{"./vdom/schema":"vdom/schema.js","./vdom/SL":"vdom/SL.js","./vdom/hex":"vdom/hex.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _vreact = _interopRequireWildcard(require("./vreact"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var App =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return (0, _vreact.default)("div", null, (0, _vreact.default)("h1", null, "Hello!"), (0, _vreact.default)("div", null, "Ivan"), (0, _vreact.default)("p", null, "What are going on here?"));
    }
  }]);

  return App;
}(_vreact.Component);

(0, _vreact.renderToHTML)('#App', (0, _vreact.default)("div", null, (0, _vreact.default)("h1", null, "Hello,"), (0, _vreact.default)("p", null, "Test"), (0, _vreact.default)("div", {
  style: "color: red"
}, (0, _vreact.default)("p", null, "Hi"), (0, _vreact.default)("p", null, "Me"))));
},{"./vreact":"vreact.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51690" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/vreact.e31bb0bc.js.map