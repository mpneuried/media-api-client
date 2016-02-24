(function() {
  var File, xhr,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  xhr = require("xhr");

  File = (function(superClass) {
    extend(File, superClass);

    File.prototype.states = ["new", "start", "signed", "upload", "progress", "done", "invalid", "error", "aborted"];

    function File(file, idx, client, options) {
      var ref;
      this.file = file;
      this.idx = idx;
      this.client = client;
      this.options = options;
      this._handleProgress = bind(this._handleProgress, this);
      this._upload = bind(this._upload, this);
      this._sign = bind(this._sign, this);
      this._testMime = bind(this._testMime, this);
      this._validate = bind(this._validate, this);
      this._setState = bind(this._setState, this);
      this.getData = bind(this.getData, this);
      this.getType = bind(this.getType, this);
      this.getName = bind(this.getName, this);
      this.getProgress = bind(this.getProgress, this);
      this.getResult = bind(this.getResult, this);
      this.getState = bind(this.getState, this);
      this.abort = bind(this.abort, this);
      this.start = bind(this.start, this);
      File.__super__.constructor.apply(this, arguments);
      this.state = 0;
      this.validation = [];
      this.key = this.options.keyprefix + "_" + this.getName().replace(this._rgxFile2Key, "") + "_" + this._now() + "_" + this.idx;
      this.client.emit("file.new", this);
      this.client.on("abortAll", this.abort);
      this.on("start", this.start);
      this.on("signed", this._upload);
      if (!((ref = this.options.keyprefix) != null ? ref.length : void 0)) {
        this.options.keyprefix = "clientupload";
      }
      if (this.options.autostart == null) {
        this.options.autostart = true;
      }
      this._validate();
      if (this.options.autostart) {
        this.emit("start");
      }
      return;
    }

    File.prototype.start = function() {
      if (this.state <= 0) {
        this._setState(1);
        this.client.emit("file.upload", this);
        this._sign();
      }
      return this;
    };

    File.prototype.abort = function() {
      var ref;
      if (this.state <= 4) {
        this._setState(8);
        if ((ref = this.requestUpload) != null) {
          ref.abort();
        }
        this.emit("aborted");
        this.client.emit("file.aborted", this);
      }
      return this;
    };

    File.prototype.getState = function() {
      return this.states[this.state];
    };

    File.prototype.getResult = function() {
      if (this.state === 5 && (this.data != null)) {
        return {
          url: this.data.url,
          hash: this.data.filehash,
          key: this.data.key,
          type: this.data.content_type
        };
      }
      return null;
    };

    File.prototype.getProgress = function(asFactor) {
      var _fac;
      if (asFactor == null) {
        asFactor = false;
      }
      if (this.state < 4) {
        _fac = 0;
      } else if (this.state > 4) {
        _fac = 1;
      } else {
        _fac = this.progressState;
      }
      if (asFactor) {
        return _fac;
      } else {
        return Math.round(_fac * 100);
      }
    };

    File.prototype.getName = function() {
      return this.file.name;
    };

    File.prototype.getType = function() {
      return this.file.type;
    };

    File.prototype.getData = function() {
      var _ret;
      _ret = {
        name: this.client.formname,
        filename: this.getName(),
        idx: this.idx,
        state: this.getState(),
        progress: this.getProgress(),
        result: this.getResult(),
        options: this.options,
        invalid_reason: this.validation,
        error: this.error
      };
      return _ret;
    };

    File.prototype._setState = function(state) {
      if (state > this.state) {
        this.state = state;
        this.emit("state", this.getState());
      }
      if (this.state >= this.states.indexOf("done")) {
        this.client.removeListener("abortAll", this.abort);
      }
      return state;
    };

    File.prototype._validate = function() {
      var _size, ref;
      _size = this.file.size / 1024;
      if (this.options.maxsize > 0 && this.options.maxsize < _size) {
        this.validation.push("maxsize");
      }
      if (((ref = this.options.acceptRules) != null ? ref.length : void 0) && !this._testMime(this.options.acceptRules)) {
        this.validation.push("accept");
      }
      if (this.validation.length) {
        this._setState(6);
        this.emit("invalid", this.validation);
        this.client.emit("file.invalid", this, this.validation);
        return false;
      }
      return true;
    };

    File.prototype._testMime = function(acceptRules) {
      var _rule, i, len;
      for (i = 0, len = acceptRules.length; i < len; i++) {
        _rule = acceptRules[i];
        if (_rule(this.file)) {
          return true;
        }
      }
      return false;
    };

    File.prototype._now = function() {
      return Math.round(Date.now() / 1000);
    };

    File.prototype._rgxFile2Key = /([^A-Za-z0-9])/ig;

    File.prototype._sign = function() {
      var _content_type, _name;
      _name = this.getName();
      _content_type = this.getType();
      if (this.state > 1) {
        return;
      }
      this.url = this.options.host + this.options.domain + "/" + this.key;
      this.json = {
        blob: true,
        acl: this.options.acl,
        ttl: this.options.ttl,
        properties: {
          filename: _name
        }
      };
      if (this.options.width != null) {
        this.json.width = this.options.width;
      }
      if (this.options.height != null) {
        this.json.height = this.options.height;
      }
      if (this.options.quality != null) {
        this.json.quality = this.options.quality;
      }
      if (this.options.tags != null) {
        this.json.tags = this.options.tags;
      }
      if (this.options.properties != null) {
        this.json.properties = this.options.properties;
      }
      if (this.options["content-disposition"] != null) {
        this.json["content-disposition"] = this.options["content-disposition"];
      }
      if (_content_type != null ? _content_type.length : void 0) {
        this.json.content_type = _content_type;
      }
      this.emit("content", this.key, this.json);
      this.client.emit("file.content", this, this.key, this.json);
      this.client.sign.call(this, {
        url: this.url,
        key: this.key,
        json: this.json
      }, (function(_this) {
        return function(err, url) {
          _this.url = url;
          if (err) {
            _this.error = err;
            _this._setState(7);
            _this.emit("error", err);
            _this.client.emit("file.error", _this, err);
            return;
          }
          _this._setState(2);
          _this.emit("signed");
        };
      })(this));
    };

    File.prototype._upload = function() {
      var _xhr, data, ref;
      if (this.state > 2) {
        return;
      }
      this._setState(3);
      data = new FormData();
      data.append("JSON", JSON.stringify(this.json));
      data.append("blob", this.file);
      _xhr = new window.XMLHttpRequest();
      if ((ref = _xhr.upload) != null) {
        ref.addEventListener("progress", this._handleProgress(), false);
      }
      _xhr.addEventListener("progress", this._handleProgress(), false);
      _xhr._isfile = true;
      this.requestUpload = xhr({
        xhr: _xhr,
        url: this.url,
        method: "POST",
        data: data
      }, (function(_this) {
        return function(err, resp, body) {
          var _data;
          if (err) {
            _this._setState(7);
            _this.progressState = 0;
            _this.error = err;
            _this.emit("error", err);
            _this.client.emit("file.error", _this, err);
            return;
          }
          _data = JSON.parse(body);
          if (resp.statusCode >= 300) {
            _this._setState(7);
            _this.progressState = 0;
            _this.error = _data;
            _this.emit("error", _data);
            _this.client.emit("file.error", _this, _data);
            return;
          }
          _this.data = _data != null ? _data.rows[0] : void 0;
          _this.progressState = 1;
          _this._setState(5);
          _this.emit("done", _this.data);
          _this.client.emit("file.done", _this);
        };
      })(this));
    };

    File.prototype._handleProgress = function() {
      return (function(_this) {
        return function(evnt) {
          var _progress;
          if (evnt.target.method == null) {
            _this.progressState = evnt.loaded / evnt.total;
            _this._setState(4);
            _progress = _this.getProgress();
            _this.emit("progress", _progress, evnt);
            _this.client.emit("file.progress", _this, _progress);
            return;
          }
        };
      })(this);
    };

    return File;

  })(require("./base"));

  module.exports = File;

}).call(this);
