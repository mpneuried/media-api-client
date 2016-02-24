(function() {
  var Base,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Base = (function(superClass) {
    extend(Base, superClass);

    function Base() {
      this._error = bind(this._error, this);
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype._error = function(cb, err, data) {
      var _err;
      if (!(err instanceof Error)) {
        _err = new Error(err);
        _err.name = err;
        try {
          _err.message = this.ERRORS[err] || " - ";
        } catch (_error) {}
      } else {
        _err = err;
      }
      if (this.listeners("error").length) {
        this.emit("error", _err, data);
      } else {
        console.error(_err, data);
      }
      if (cb == null) {
        throw _err;
      } else {
        cb(_err);
      }
    };

    return Base;

  })(require('events'));

  module.exports = Base;

}).call(this);
