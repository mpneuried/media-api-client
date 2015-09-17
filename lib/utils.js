(function() {
  var _intRegex, assign, isArray, isInt, isObject, isString,
    slice = [].slice;

  isObject = function(vr) {
    return vr !== null && typeof vr === 'object';
  };

  isArray = function(vr) {
    return Object.prototype.toString.call(vr) === '[object Array]';
  };

  isString = function(vr) {
    return typeof vr === 'string' || vr instanceof String;
  };

  _intRegex = /^\d+$/;

  isInt = function(vr) {
    return _intRegex.test(vr);
  };

  assign = function() {
    var _k, _v, i, len, src, srcs, tgrt;
    tgrt = arguments[0], srcs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = srcs.length; i < len; i++) {
      src = srcs[i];
      if (isObject(src)) {
        for (_k in src) {
          _v = src[_k];
          tgrt[_k] = _v;
        }
      }
    }
    return tgrt;
  };

  module.exports = {
    isArray: isArray,
    isObject: isObject,
    isString: isString,
    isInt: isInt,
    assign: assign
  };

}).call(this);
