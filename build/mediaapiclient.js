(function() {
  var Base, EventEmitter, File, FileView, MediaApiClient, isArray, isInt, isObject, isString, _defauktKeys, _defaults, _intRegex, _k, _v,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isArray = function(vr) {
    return Object.prototype.toString.call(vr) === '[object Array]';
  };

  isObject = function(vr) {
    return vr !== null && typeof vr === 'object';
  };

  isString = function(vr) {
    return typeof vr === 'string' || vr instanceof String;
  };

  _intRegex = /^\d+$/;

  isInt = function(vr) {
    return _intRegex.test(vr);
  };

  EventEmitter = (function() {
    function EventEmitter() {}

    EventEmitter.prototype.on = function(name, listener) {
      var listeners, _base;
      listeners = (_base = (this._eventListeners != null ? this._eventListeners : this._eventListeners = {}))[name] != null ? _base[name] : _base[name] = [];
      return listeners.push(listener);
    };

    EventEmitter.prototype.off = function(name, listener) {
      var index, listeners, _ref;
      if (listeners = (_ref = this._eventListeners) != null ? _ref[name] : void 0) {
        index = listeners.indexOf(listener);
        if (index >= 0) {
          return listeners[index] = null;
        }
      }
    };

    EventEmitter.prototype.emit = function(name) {
      var args, listener, listeners, _i, _len, _ref, _results;
      if (listeners = (_ref = this._eventListeners) != null ? _ref[name] : void 0) {
        args = Array.prototype.slice.call(arguments, 1);
        _results = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results.push(listener != null ? listener.apply(this, args) : void 0);
        }
        return _results;
      }
    };

    EventEmitter.prototype.once = function(name, listener) {
      var remover;
      remover = (function(_this) {
        return function() {
          _this.off(name, listener);
          return _this.off(name, remover);
        };
      })(this);
      this.on(name, listener);
      return this.on(name, remover);
    };

    EventEmitter.prototype.addEventListener = EventEmitter.prototype.on;

    EventEmitter.prototype.removeEventListener = EventEmitter.prototype.off;

    return EventEmitter;

  })();

  Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      this._error = __bind(this._error, this);
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype._error = function(cb, err) {
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
      if (cb == null) {
        throw _err;
      } else {
        cb(_err);
      }
    };

    return Base;

  })(EventEmitter);

  File = (function(_super) {
    __extends(File, _super);

    File.prototype.states = ["new", "start", "signed", "upload", "progress", "done", "invalid", "error", "aborted"];

    function File(file, idx, client, options) {
      var _ref;
      this.file = file;
      this.idx = idx;
      this.client = client;
      this.options = options;
      this._defaultRequestSignature = __bind(this._defaultRequestSignature, this);
      this._handleProgress = __bind(this._handleProgress, this);
      this._upload = __bind(this._upload, this);
      this._sign = __bind(this._sign, this);
      this._now = __bind(this._now, this);
      this._testMime = __bind(this._testMime, this);
      this._validate = __bind(this._validate, this);
      this._setState = __bind(this._setState, this);
      this.getData = __bind(this.getData, this);
      this.getType = __bind(this.getType, this);
      this.getName = __bind(this.getName, this);
      this.getProgress = __bind(this.getProgress, this);
      this.getResult = __bind(this.getResult, this);
      this.getState = __bind(this.getState, this);
      this.abort = __bind(this.abort, this);
      this.start = __bind(this.start, this);
      File.__super__.constructor.apply(this, arguments);
      this.state = 0;
      this.validation = [];
      this.key = this.options.keyprefix + "_" + this.getName().replace(this._rgxFile2Key, "") + "_" + this._now() + "_" + this.idx;
      this.client.emit("file.new", this);
      this.client.on("abortAll", this.abort);
      this.on("start", this.start);
      this.on("signed", this._upload);
      if (this.options.requestSignFn == null) {
        this.options.requestSignFn = this._defaultRequestSignature;
      }
      if (!((_ref = this.options.keyprefix) != null ? _ref.length : void 0)) {
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
      var _ref;
      if (this.state <= 4) {
        this._setState(8);
        if ((_ref = this.requestUpload) != null) {
          _ref.abort();
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
      return state;
    };

    File.prototype._validate = function() {
      var _ref, _size;
      _size = this.file.size / 1024;
      if (this.options.maxsize > 0 && this.options.maxsize < _size) {
        this.validation.push("maxsize");
      }
      if (((_ref = this.options.acceptRules) != null ? _ref.length : void 0) && !this._testMime(this.options.acceptRules)) {
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
      var _i, _len, _rule;
      for (_i = 0, _len = acceptRules.length; _i < _len; _i++) {
        _rule = acceptRules[_i];
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
      this.options.requestSignFn.call(this, this.options.domain, this.options.accesskey, this.url, this.key, this.json, (function(_this) {
        return function(err, signature) {
          if (err) {
            _this.error = err;
            _this._setState(7);
            _this.emit("error", err);
            _this.client.emit("file.error", _this, err);
            return;
          }
          if (_this.url.indexOf("?") >= 0) {
            _this.url += "&";
          } else {
            _this.url += "?";
          }
          _this.url += "signature=" + encodeURIComponent(signature);
          _this._setState(2);
          _this.emit("signed");
        };
      })(this));
    };

    File.prototype._upload = function() {
      var data;
      if (this.state > 2) {
        return;
      }
      this._setState(3);
      data = new FormData();
      data.append("JSON", JSON.stringify(this.json));
      data.append("blob", this.file);
      this.requestUpload = jQuery.ajax({
        url: this.url,
        type: "POST",
        cache: false,
        data: data,
        processData: false,
        contentType: false,
        success: (function(_this) {
          return function(resp) {
            _this.data = resp != null ? resp.rows[0] : void 0;
            _this.progressState = 1;
            _this._setState(5);
            _this.emit("done", _this.data);
            _this.client.emit("file.done", _this);
          };
        })(this),
        error: (function(_this) {
          return function(err) {
            _this._setState(7);
            _this.progressState = 0;
            _this.error = err;
            _this.emit("error", err);
            _this.client.emit("file.error", _this, err);
          };
        })(this),
        xhr: (function(_this) {
          return function() {
            var xhr, _ref;
            xhr = new window.XMLHttpRequest();
            if ((_ref = xhr.upload) != null) {
              _ref.addEventListener("progress", _this._handleProgress(), false);
            }
            xhr.addEventListener("progress", _this._handleProgress(), false);
            return xhr;
          };
        })(this)
      });
    };

    File.prototype._handleProgress = function() {
      return (function(_this) {
        return function(evnt) {
          _this.progressState = evnt.loaded / evnt.total;
          _this._setState(4);
          _this.emit("progress", _this.getProgress(), evnt);
        };
      })(this);
    };

    File.prototype._defaultRequestSignature = function(domain, accesskey, madiaapiurl, key, json, cb) {
      var _data, _req, _url;
      _url = this.options.host + domain + "/sign/" + accesskey;
      _data = {
        url: madiaapiurl,
        key: key,
        json: JSON.stringify(json)
      };
      _req = jQuery.post(_url, _data, null, "text");
      _req.done(function(signature) {
        cb(null, signature);
      });
      _req.error(function(err) {
        console.error("get sign error", err);
        cb(err);
      });
    };

    return File;

  })(Base);


  /*
  class FileFallback extends File
  
  	validate: =>
  		return true
  
  	getName: =>
  		return @file.val()
  
  	getType: =>
  		return null
  
  	_upload: =>
  		if @state > 2
  			return
  		@_setState( 3 )
  		data = new FormData()
  		data.append( "JSON", JSON.stringify( @json ) )
  		data.append( "blob", @file )
  		
  		jQuery.ajax 
  			url: @url
  			type: "POST"
  			cache: false
  			data: data
  			processData: false
  			contentType: false
  			success: ( resp )=>
  				@data = resp?.rows[ 0 ]
  				@progressState = 1
  				@_setState( 5 )
  				@emit( "done", @data )
  				@client.emit( "file.done", @ )
  				return
  			error: ( err )=>
  				@_setState( 8 )
  				@progressState = 0
  				@error = err
  				@emit( "error", err )
  				@client.emit( "file.error", @, err )
  				return
  			xhr: =>
  				xhr = new window.XMLHttpRequest()
  				xhr.upload?.addEventListener( "progress", @_handleProgress(), false )
  				xhr.addEventListener( "progress", @_handleProgress(), false )
  				return xhr
  		return
   */

  FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView(fileObj, client, options) {
      this.fileObj = fileObj;
      this.client = client;
      this.options = options;
      this._defaultTemplate = __bind(this._defaultTemplate, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      FileView.__super__.constructor.apply(this, arguments);
      if ((this.client.resultTemplateFn != null) && typeof this.options.resultTemplateFn !== "function") {
        this.template = this.client.resultTemplateFn;
      } else {
        this.template = this._defaultTemplate;
      }
      this.fileObj.on("progress", this.update());
      this.fileObj.on("done", this.update());
      this.fileObj.on("error", this.update());
      this.fileObj.on("invalid", this.update());
      return;
    }

    FileView.prototype.render = function() {
      this.$el = jQuery("<div class=\"col-sm-6 col-md-4 file\"></div>").html(this.template(this.fileObj.getData()));
      return this.$el;
    };

    FileView.prototype.update = function() {
      return (function(_this) {
        return function(evnt) {
          _this.$el.html(_this.template(_this.fileObj.getData()));
        };
      })(this);
    };

    FileView.prototype._defaultTemplate = function(data) {
      var _html, _i, _k, _len, _reason, _ref, _ref1, _v;
      _html = "<div class=\"thumbnail state-" + data.state + "\">\n	<b>" + data.filename + "</b>";
      switch (data.state) {
        case "progress":
          _html += "<div class=\"progress\">\n	<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"" + data.progress + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: " + data.progress + "%;\">\n		<span>" + data.progress + "%</span>\n	</div>\n</div>";
          break;
        case "done":
          _html += "<div class=\"result\">\n	<a href=\"" + data.result.url + "\" target=\"_new\">Fertig! ( " + data.result.key + " )</a>";
          _ref = data.result;
          for (_k in _ref) {
            _v = _ref[_k];
            _html += "<input type=\"hidden\" name=\"" + data.name + "_" + data.idx + "_" + _k + "\" value=\"" + _v + "\">";
          }
          _html += "</div>";
          break;
        case "invalid":
          _html += "<div class=\"result\">\n	<b>Invalid</b>";
          _ref1 = data.invalid_reason;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            _reason = _ref1[_i];
            switch (_reason) {
              case "maxsize":
                _html += "<div class=\"alert alert-error\">File too big. Only files until " + data.options.maxsize + "kb are allowed.</div>";
                break;
              case "accept":
                _html += "<div class=\"alert alert-error\">Wrong type. Only files of type " + (data.options.accept.join(", ")) + " are allowed.</div>";
            }
          }
          _html += "</div>";
          break;
        case "error":
          _html += "<div class=\"alert alert-error\">An Error occured.</div>";
          break;
        case "aborted":
          _html += "<div class=\"alert alert-error\">Upload aborted.</div>";
      }
      _html += "</div>";
      return _html;
    };

    return FileView;

  })(Base);

  _defaults = {
    host: null,
    domain: null,
    accesskey: null,
    keyprefix: "clientupload",
    autostart: true,
    requestSignFn: null,
    resultTemplateFn: null,
    maxsize: 0,
    maxcount: 0,
    accept: null,
    ttl: 0,
    acl: "public-read",
    properties: null,
    tags: null,
    "content-disposition": null
  };

  _defauktKeys = (function() {
    var _results;
    _results = [];
    for (_k in _defaults) {
      _v = _defaults[_k];
      _results.push(_k);
    }
    return _results;
  })();

  MediaApiClient = (function(_super) {
    __extends(MediaApiClient, _super);

    MediaApiClient.prototype.version = "0.4.3";

    MediaApiClient.prototype._rgxHost = /https?:\/\/[^\/$\s]+/i;

    function MediaApiClient(drag, elresults, options) {
      var _html, _htmlData, _i, _inpAccept, _len, _mxcnt, _mxsz, _opt, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _tag;
      if (options == null) {
        options = {};
      }
      this._validateEl = __bind(this._validateEl, this);
      this._checkFinish = __bind(this._checkFinish, this);
      this.onFinish = __bind(this.onFinish, this);
      this.fileNew = __bind(this.fileNew, this);
      this.fileError = __bind(this.fileError, this);
      this.fileDone = __bind(this.fileDone, this);
      this.enable = __bind(this.enable, this);
      this.disable = __bind(this.disable, this);
      this.abortAll = __bind(this.abortAll, this);
      this.upload = __bind(this.upload, this);
      this.onLeave = __bind(this.onLeave, this);
      this.onOver = __bind(this.onOver, this);
      this.onHover = __bind(this.onHover, this);
      this.onSelect = __bind(this.onSelect, this);
      this.initFileAPI = __bind(this.initFileAPI, this);
      this.initialize = __bind(this.initialize, this);
      this.generateAcceptRules = __bind(this.generateAcceptRules, this);
      MediaApiClient.__super__.constructor.apply(this, arguments);
      this.enabled = true;
      this.useFileAPI = false;
      this.on("file.new", this.fileNew);
      this.on("file.done", this.fileDone);
      this.on("file.error", this.fileError);
      this.on("file.invalid", this.fileError);
      this.on("file.aborted", this.fileError);
      this.on("finish", this.onFinish);
      this.within_enter = false;
      this.$el = this._validateEl(drag, "drag");
      this.el = this.$el.get(0);
      this.$sel = this.$el.find("input" + (options.inputclass || "") + "[type='file']");
      if (!this.$sel.length) {
        this._error(null, "missing-select-el");
        return;
      }
      this.formname = this.$sel.attr("name");
      if (elresults != null) {
        this.$res = this._validateEl(elresults, "result");
      }
      _htmlData = this.$el.data();
      this.options = jQuery.extend({}, _defaults, _htmlData, options || {});
      if (!((_ref = this.options.host) != null ? _ref.length : void 0)) {
        this._error(null, "missing-host");
        return;
      }
      if (!this._rgxHost.test(this.options.host)) {
        this._error(null, "invalid-host");
        return;
      }
      if (!((_ref1 = this.options.domain) != null ? _ref1.length : void 0)) {
        this._error(null, "missing-domain");
        return;
      }
      if (!((_ref2 = this.options.accesskey) != null ? _ref2.length : void 0)) {
        this._error(null, "missing-accesskey");
        return;
      }
      if (this.options.maxcount != null) {
        _mxcnt = parseInt(this.options.maxcount, 10);
        if (isNaN(_mxcnt)) {
          this.options.maxcount = _defaults.maxcount;
        } else {
          this.options.maxcount = _mxcnt;
        }
      }
      if (this.options.maxcount !== 1) {
        this.$sel.attr("multiple", "multiple");
      }
      if (this.options.maxsize != null) {
        _mxsz = parseInt(this.options.maxsize, 10);
        if (isNaN(_mxsz)) {
          this.options.maxsize = _defaults.maxsize;
        } else {
          this.options.maxsize = _mxsz;
        }
      }
      if ((this.options.requestSignFn != null) && typeof this.options.requestSignFn !== "function") {
        this._error(null, "invalid-requestSignfn");
        return;
      }
      if ((this.options.ttl != null) && !isInt(this.options.ttl)) {
        this._error(null, "invalid-ttl");
        return;
      } else if (this.options.ttl != null) {
        this.options.ttl = parseInt(this.options.ttl, 10);
        if (isNaN(this.options.ttl)) {
          this._error(null, "invalid-ttl");
          return;
        }
      }
      if ((this.options.tags != null) && isArray(this.options.tags)) {
        _ref3 = this.options.tags;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          _tag = _ref3[_i];
          if (!(!isString(_tag))) {
            continue;
          }
          this._error(null, "invalid-tags");
          return;
        }
      } else if (this.options.tags != null) {
        this._error(null, "invalid-tags");
        return;
      }
      if ((this.options.properties != null) && !isObject(this.options.properties)) {
        this._error(null, "invalid-properties");
        return;
      }
      if ((this.options["content-disposition"] != null) && !isString(this.options["content-disposition"])) {
        this._error(null, "invalid-content-disposition");
        return;
      }
      if ((this.options.acl != null) && !isString(this.options.acl) && ((_ref4 = this.options.acl) !== "public-read" && _ref4 !== "authenticated-read")) {
        this._error(null, "invalid-acl");
        return;
      }
      _inpAccept = this.$sel.attr("accept");
      if ((this.options.accept != null) || (_inpAccept != null)) {
        _html = (_inpAccept != null ? _inpAccept.split(",") : void 0) || [];
        _opt = ((_ref5 = this.options.accept) != null ? _ref5.split(",") : void 0) || [];
        if (_html != null ? _html.length : void 0) {
          this.options.accept = _html;
        } else if (_opt != null ? _opt.length : void 0) {
          this.$sel.attr("accept", this.options.accept);
        }
        this.options.acceptRules = this.generateAcceptRules(this.options.accept);
      }
      this.initialize();
      this.idx_started = 0;
      this.idx_finished = 0;
      this.$el.data("mediaapiclient", this);
      return;
    }

    MediaApiClient.prototype.generateAcceptRules = function(accept) {
      var _i, _len, _rule, _rules;
      _rules = [];
      for (_i = 0, _len = accept.length; _i < _len; _i++) {
        _rule = accept[_i];
        if (_rule.indexOf("/") >= 0) {
          _rules.push((function() {
            var _regex;
            _regex = new RegExp("" + (_rule.replace("*", "\\w+")) + "$", "i");
            return function(file) {
              return _regex.test(file.type);
            };
          })());
        } else if (_rule.indexOf(".") >= 0) {
          _rules.push((function() {
            var _regex;
            _regex = new RegExp("" + (_rule.replace(".", "\\.")) + "$", "i");
            return function(file) {
              return _regex.test(file.name);
            };
          })());
        } else if (_rule === "*") {
          _rules.push((function(file) {
            return true;
          }));
        }
      }
      return _rules;
    };

    MediaApiClient.prototype.initialize = function() {
      if (window.File && window.FileList && window.FileReader) {
        this.$sel.on("change", this.onSelect);
        this.useFileAPI = true;
        this.initFileAPI();
      }
    };

    MediaApiClient.prototype.initFileAPI = function() {
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr != null ? xhr.upload : void 0) {
        this.el.ondragover = this.onHover;
        this.el.ondragleave = this.onLeave;
        this.el.ondrop = this.onSelect;
        this.$el.addClass("droppable");
      } else {

      }
    };

    MediaApiClient.prototype.onSelect = function(evnt) {
      var files, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      evnt.preventDefault();
      this.$sel.replaceWith(this.$sel = this.$sel.clone(true));
      if (!this.enabled) {
        return;
      }
      if (this.options.maxcount <= 0 || this.idx_started < this.options.maxcount) {
        this.$el.removeClass("hover").addClass("process");
        files = ((_ref = evnt.target) != null ? _ref.files : void 0) || ((_ref1 = evnt.originalEvent) != null ? (_ref2 = _ref1.target) != null ? _ref2.files : void 0 : void 0) || ((_ref3 = evnt.dataTransfer) != null ? _ref3.files : void 0) || ((_ref4 = evnt.originalEvent) != null ? (_ref5 = _ref4.dataTransfer) != null ? _ref5.files : void 0 : void 0);
        this.upload(files);
      } else {
        this.$el.removeClass("hover");
        this.disable();
      }
    };

    MediaApiClient.prototype.onHover = function(evnt) {
      console.log("hover");
      evnt.preventDefault();
      if (!this.enabled) {
        return;
      }
      this.within_enter = true;
      setTimeout(((function(_this) {
        return function() {
          return _this.within_enter = false;
        };
      })(this)), 0);
      this.$el.addClass("hover");
    };

    MediaApiClient.prototype.onOver = function(evnt) {
      evnt.preventDefault();
      if (!this.enabled) {
        return;
      }
    };

    MediaApiClient.prototype.onLeave = function(evnt) {
      if (!this.enabled) {
        return;
      }
      if (!this.within_enter) {
        this.$el.removeClass("hover");
      }
    };

    MediaApiClient.prototype.upload = function(files) {
      var file, idx, _i, _len;
      if (this.useFileAPI) {
        for (idx = _i = 0, _len = files.length; _i < _len; idx = ++_i) {
          file = files[idx];
          if (this.enabled) {
            if (this.options.maxcount <= 0 || this.idx_started < this.options.maxcount) {
              this.idx_started++;
              new MediaApiClient.File(file, this.idx_started, this, this.options);
            } else {
              this.disable();
            }
          }
        }
      }
    };

    MediaApiClient.prototype.abortAll = function() {
      this.emit("abortAll");
    };

    MediaApiClient.prototype.disable = function() {
      this.$sel.attr("disabled", "disabled");
      this.$el.addClass("disabled");
      this.enabled = false;
    };

    MediaApiClient.prototype.enable = function() {
      this.$sel.removeAttr("disabled");
      this.$el.removeClass("disabled");
      this.enabled = true;
    };

    MediaApiClient.prototype.fileDone = function(file) {
      this.idx_finished++;
      this._checkFinish();
    };

    MediaApiClient.prototype.fileError = function(file, err) {
      console.error("FILE-ERROR", file, err);
      this.idx_finished++;
      this._checkFinish();
    };

    MediaApiClient.prototype.fileNew = function(file) {
      var _fileview;
      if (this.$res != null) {
        _fileview = new MediaApiClient.FileView(file, this, this.options);
        this.$res.append(_fileview.render());
      }
    };

    MediaApiClient.prototype.onFinish = function() {
      this.$el.removeClass("process");
    };

    MediaApiClient.prototype._checkFinish = function() {
      if (this.idx_finished >= this.idx_started) {
        this.emit("finish");
        if (this.options.maxcount > 0 && this.idx_started >= this.options.maxcount) {
          this.disable();
        }
      }
    };

    MediaApiClient.prototype._validateEl = function(el, type) {
      var _el;
      if (el == null) {
        this._error(null, "missing-" + type + "-el");
        return;
      }
      switch (typeof el) {
        case "string":
          _el = jQuery(el);
          break;
        case "object":
          if (el instanceof jQuery) {
            _el = jQuery(el);
          }
          if (el instanceof HTMLElement) {
            _el = jQuery(el);
          }
      }
      if (!(_el != null ? _el.length : void 0)) {
        this._error(null, "invalid-" + type + "-el");
        return;
      }
      return _el;
    };

    MediaApiClient.prototype.ERRORS = {
      "missing-select-el": "Missing select element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object",
      "invalid-select-el": "Invalid select element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object",
      "missing-drag-el": "Missing drag element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object",
      "invalid-drag-el": "Invalid drag element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object",
      "missing-host": "Missing host. You have to defien a host as url starting with `http://` or `https://`.",
      "invalid-host": "Invalid host. You have to defien a host as url starting with `http://` or `https://`.",
      "missing-domain": "Missing domain. You have to define a domain.",
      "missing-accesskey": "Missing accesskey. You have to define a accesskey.",
      "missing-keyprefix": "Missing keyprefix. You have to define a keyprefix.",
      "invalid-ttl": "for the option `ttl` only a positiv number is allowed",
      "invalid-tags": "for the option `tags` only an array of strings is allowed",
      "invalid-properties": "for the option `properties` only an object is allowed",
      "invalid-content-disposition": "for the option `content-disposition` only an string like: `attachment; filename=friendly_filename.pdf` is allowed",
      "invalid-acl": "the option acl only accepts the string `public-read` or `authenticated-read`"
    };

    return MediaApiClient;

  })(Base);

  MediaApiClient.EventEmitter = EventEmitter;

  MediaApiClient.Base = Base;

  MediaApiClient.File = File;

  MediaApiClient.FileView = FileView;

  MediaApiClient.defaults = function(options) {
    for (_k in options) {
      _v = options[_k];
      if (__indexOf.call(_defauktKeys, _k) >= 0) {
        _defaults[_k] = _v;
      }
    }
    return _defaults;
  };

  if (typeof define !== "undefined" && define !== null) {
    define(["jquery", "bootstrap", "../bower_components/jssha/src/sha1.js"], (function(_this) {
      return function(jQuery, Bootstrap, Sha1) {
        return MediaApiClient;
      };
    })(this));
  } else {
    window.MediaApiClient = MediaApiClient;
  }

}).call(this);
