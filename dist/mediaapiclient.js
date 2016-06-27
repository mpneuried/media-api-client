/*
 * Media-API-Client 1.3.2 ( 2016-06-27 )
 * https://github.com/mpneuried/media-api-client/tree/1.3.2
 *
 * Released under the MIT license
 * https://github.com/mpneuried/media-api-client/blob/master/LICENSE
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MediaApiClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
      } catch (undefined) {}
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

})(_dereq_('events'));

module.exports = Base;


},{"events":8}],2:[function(_dereq_,module,exports){
var Base, Client, File, FileView, _defauktKeys, _defaults, _k, _v, dom, utils, xhr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

dom = _dereq_("domel");

xhr = _dereq_("xhr");

utils = _dereq_("./utils");

Base = _dereq_("./base");

File = _dereq_("./file");

FileView = _dereq_("./fileview");

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
  width: null,
  height: null,
  accept: null,
  ttl: 0,
  acl: "public-read",
  properties: null,
  tags: null,
  "content-disposition": null,
  cssdroppable: "dropable",
  csshover: "hover",
  cssprocess: "process",
  cssdisabled: "disabled"
};

_defauktKeys = (function() {
  var results;
  results = [];
  for (_k in _defaults) {
    _v = _defaults[_k];
    results.push(_k);
  }
  return results;
})();

Client = (function(superClass) {
  extend(Client, superClass);

  Client.prototype.version = "1.3.2";

  Client.prototype._rgxHost = /https?:\/\/[^\/$\s]+/i;

  function Client(drag, elresults, options) {
    var _html, _htmlData, _inpAccept, _mxcnt, _mxsz, _opt, _tag, i, len, ref, ref1, ref2, ref3, ref4, ref5;
    if (options == null) {
      options = {};
    }
    this._getFilesFromEvent = bind(this._getFilesFromEvent, this);
    this._validateEl = bind(this._validateEl, this);
    this._checkFinish = bind(this._checkFinish, this);
    this._calcProgress = bind(this._calcProgress, this);
    this.onFinish = bind(this.onFinish, this);
    this.fileDone = bind(this.fileDone, this);
    this.fileError = bind(this.fileError, this);
    this.fileProgress = bind(this.fileProgress, this);
    this.fileStarted = bind(this.fileStarted, this);
    this.fileNew = bind(this.fileNew, this);
    this.enable = bind(this.enable, this);
    this.disable = bind(this.disable, this);
    this.abortAll = bind(this.abortAll, this);
    this._defaultRequestSignature = bind(this._defaultRequestSignature, this);
    this.sign = bind(this.sign, this);
    this.deleteFile = bind(this.deleteFile, this);
    this.upload = bind(this.upload, this);
    this.onLeave = bind(this.onLeave, this);
    this.onOver = bind(this.onOver, this);
    this.onHover = bind(this.onHover, this);
    this.onSelect = bind(this.onSelect, this);
    this.initFileAPI = bind(this.initFileAPI, this);
    this.initialize = bind(this.initialize, this);
    Client.__super__.constructor.apply(this, arguments);
    this.enabled = true;
    this.useFileAPI = false;
    this.on("file.new", this.fileNew);
    this.on("file.done", this.fileDone);
    this.on("file.error", this.fileError);
    this.on("file.invalid", this.fileError);
    this.on("file.aborted", this.fileError);
    this.on("finish", this.onFinish);
    this.within_enter = false;
    this.el = this._validateEl(drag, "drag");
    this.sel = this.el.d.find("input" + (options.inputclass || "") + "[type='file']", true);
    if (this.sel == null) {
      this._error(null, "missing-select-el");
      return;
    }
    this.formname = this.sel.getAttribute("name");
    if (elresults != null) {
      this.res = this._validateEl(elresults, "result");
    }
    _htmlData = this.el.d.data();
    this.options = utils.assign({}, _defaults, _htmlData, options || {});
    if (!((ref = this.options.host) != null ? ref.length : void 0)) {
      this._error(null, "missing-host");
      return;
    }
    if (!this._rgxHost.test(this.options.host)) {
      this._error(null, "invalid-host");
      return;
    }
    if (!((ref1 = this.options.domain) != null ? ref1.length : void 0)) {
      this._error(null, "missing-domain");
      return;
    }
    if (!((ref2 = this.options.accesskey) != null ? ref2.length : void 0)) {
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
      this.sel.setAttribute("multiple", "multiple");
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
    if ((this.options.ttl != null) && !utils.isInt(this.options.ttl)) {
      this._error(null, "invalid-ttl");
      return;
    } else if (this.options.ttl != null) {
      this.options.ttl = parseInt(this.options.ttl, 10);
      if (isNaN(this.options.ttl)) {
        this._error(null, "invalid-ttl");
        return;
      }
    }
    if ((this.options.tags != null) && utils.isArray(this.options.tags)) {
      ref3 = this.options.tags;
      for (i = 0, len = ref3.length; i < len; i++) {
        _tag = ref3[i];
        if (!(!utils.isString(_tag))) {
          continue;
        }
        this._error(null, "invalid-tags");
        return;
      }
    } else if (this.options.tags != null) {
      this._error(null, "invalid-tags");
      return;
    }
    if ((this.options.properties != null) && !utils.isObject(this.options.properties)) {
      this._error(null, "invalid-properties");
      return;
    }
    if ((this.options.quality != null) && (!utils.isInt(this.options.quality) || this.options.quality < 0 || this.options.quality > 100)) {
      this._error(null, "invalid-quality");
      return;
    }
    if ((this.options["content-disposition"] != null) && !utils.isString(this.options["content-disposition"])) {
      this._error(null, "invalid-content-disposition");
      return;
    }
    if ((this.options.acl != null) && !utils.isString(this.options.acl) && ((ref4 = this.options.acl) !== "public-read" && ref4 !== "authenticated-read")) {
      this._error(null, "invalid-acl");
      return;
    }
    if ((this.options.requestSignFn != null) && utils.isFunction(this.options.requestSignFn)) {
      this._sign = this.options.requestSignFn;
    } else {
      this._sign = this._defaultRequestSignature;
    }
    _inpAccept = this.sel.getAttribute("accept");
    if ((this.options.accept != null) || (_inpAccept != null)) {
      _html = (_inpAccept != null ? _inpAccept.split(",") : void 0) || [];
      _opt = ((ref5 = this.options.accept) != null ? ref5.split(",") : void 0) || [];
      if (_html != null ? _html.length : void 0) {
        this.options.accept = _html;
      } else if (_opt != null ? _opt.length : void 0) {
        this.sel.setAttribute("accept", this.options.accept);
      }
      this.options.acceptRules = this.generateAcceptRules(this.options.accept);
    }
    this.initialize();
    this.idx_started = 0;
    this.idx_finished = 0;
    this.count_last_finished = 0;
    this.on("file.upload", this.fileStarted);
    this._currentProgress = {};
    this.on("file.progress", this.fileProgress);
    this.el.d.data("mediaapiclient", this);
    return;
  }

  Client.prototype.generateAcceptRules = function(accept) {
    var _rule, _rules, i, len;
    _rules = [];
    for (i = 0, len = accept.length; i < len; i++) {
      _rule = accept[i];
      if (_rule.indexOf("/") >= 0) {
        _rules.push((function() {
          var _regex;
          _regex = new RegExp((_rule.replace("*", "\\w+")) + "$", "i");
          return function(file) {
            return _regex.test(file.type);
          };
        })());
      } else if (_rule.indexOf(".") >= 0) {
        _rules.push((function() {
          var _regex;
          _regex = new RegExp((_rule.replace(".", "\\.")) + "$", "i");
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

  Client.prototype.initialize = function() {
    if (window.File && window.FileList && window.FileReader) {
      this.sel.d.on("change", this.onSelect);
      this.useFileAPI = true;
      this.initFileAPI();
    } else {

    }
  };

  Client.prototype.initFileAPI = function() {
    var _xhr;
    _xhr = new XMLHttpRequest();
    if (_xhr != null ? _xhr.upload : void 0) {
      this.el.ondragover = this.onHover;
      this.el.ondragleave = this.onLeave;
      this.el.ondrop = this.onSelect;
      this.el.d.addClass(this.options.cssdroppable);
    } else {

    }
  };

  Client.prototype.onSelect = function(evnt) {
    var files;
    files = this._getFilesFromEvent(evnt);
    evnt.preventDefault();
    if (!this.enabled) {
      return;
    }
    if (this.options.maxcount <= 0 || this.idx_started < this.options.maxcount) {
      this.el.d.removeClass(this.options.csshover);
      if (files != null ? files.length : void 0) {
        this.el.d.addClass(this.options.cssprocess);
        this.upload(files);
      }
      return;
    } else {
      this.el.d.removeClass(this.options.csshover);
      this.disable();
    }
  };

  Client.prototype.onHover = function(evnt) {
    evnt.preventDefault();
    if (!this.enabled) {
      return;
    }
    this.emit("file.hover");
    this.within_enter = true;
    setTimeout(((function(_this) {
      return function() {
        return _this.within_enter = false;
      };
    })(this)), 0);
    this.el.d.addClass(this.options.csshover);
  };

  Client.prototype.onOver = function(evnt) {
    evnt.preventDefault();
    if (!this.enabled) {
      return;
    }
  };

  Client.prototype.onLeave = function(evnt) {
    if (!this.enabled) {
      return;
    }
    if (!this.within_enter) {
      this.el.d.removeClass(this.options.csshover);
    }
  };

  Client.prototype.upload = function(files) {
    var file, i, idx, len;
    if (files.length > 10) {
      this.setMaxListeners(files.length);
    }
    if (this.useFileAPI) {
      for (idx = i = 0, len = files.length; i < len; idx = ++i) {
        file = files[idx];
        if (this.enabled) {
          if (this.options.maxcount <= 0 || this.idx_started < this.options.maxcount) {
            this.idx_started++;
            new File(file, this.idx_started, this, this.options);
          } else {
            this.disable();
          }
        }
      }
    }
  };

  Client.prototype.deleteFile = function(key, rev, cb) {
    var _url;
    _url = this.options.host + this.options.domain + ("/" + key + "?revision=" + rev);
    this.sign({
      url: _url,
      key: key
    }, (function(_this) {
      return function(err, surl, signature) {
        if (err) {
          cb(err);
          return;
        }
        xhr({
          url: surl,
          method: "DELETE"
        }, function(err, resp, body) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, body);
        });
      };
    })(this));
  };

  Client.prototype.sign = function(opt, cb) {
    var _opt, ref, ref1;
    _opt = utils.assign({}, {
      domain: this.options.domain,
      accesskey: this.options.accesskey,
      json: null,
      url: null,
      key: null
    }, opt);
    if (!((ref = _opt.url) != null ? ref.length : void 0)) {
      this._error(cb, "invalid-sign-url");
      return;
    }
    if (!((ref1 = _opt.key) != null ? ref1.length : void 0)) {
      this._error(cb, "invalid-sign-key");
      return;
    }
    this._sign(_opt.domain, _opt.accesskey, _opt.url, _opt.key, _opt.json, function(err, signature) {
      var _surl;
      if (err) {
        cb(err);
        return;
      }
      _surl = _opt.url;
      if (_surl.indexOf("?") >= 0) {
        _surl += "&";
      } else {
        _surl += "?";
      }
      _surl += "signature=" + encodeURIComponent(signature);
      cb(null, _surl, signature);
    });
  };

  Client.prototype._defaultRequestSignature = function(domain, accesskey, madiaapiurl, key, json, cb) {
    var _url, _xhr, data;
    _url = this.options.host + domain + "/sign/" + accesskey;
    _xhr = new window.XMLHttpRequest();
    data = new FormData();
    data.append("url", madiaapiurl);
    data.append("key", key);
    if (json != null) {
      data.append("json", JSON.stringify(json));
    }
    xhr({
      xhr: _xhr,
      method: "POST",
      url: _url,
      body: data
    }, (function(_this) {
      return function(err, resp, signature) {
        if (err) {
          cb(err);
          return;
        }
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          _this._error(cb, "sign-failed", {
            key: key,
            domain: domain,
            statusCode: resp.statusCode
          });
          return;
        }
        cb(null, signature);
      };
    })(this));
  };

  Client.prototype.abortAll = function() {
    this.emit("abortAll");
  };

  Client.prototype.disable = function() {
    this.sel.setAttribute("disabled", "disabled");
    this.el.d.addClass(this.options.cssdisabled);
    this.enabled = false;
  };

  Client.prototype.enable = function() {
    this.sel.removeAttribute("disabled");
    this.el.d.removeClass(this.options.cssdisabled);
    this.enabled = true;
  };

  Client.prototype.fileNew = function(file) {
    var _fileview;
    if (this.res != null) {
      _fileview = new FileView(file, this, this.options);
      this.res.d.append(_fileview.render());
    }
  };

  Client.prototype.fileStarted = function(file) {
    this._currentProgress[file.idx] = 0;
    if (this._running) {
      return;
    }
    this._running = true;
    this.emit("start");
  };

  Client.prototype.fileProgress = function(file, precent) {
    if ((this._currentProgress[file.idx] == null) || this._currentProgress[file.idx] >= 0) {
      this._currentProgress[file.idx] = precent;
    }
    this._calcProgress();
  };

  Client.prototype.fileError = function(file, err) {
    if (this.listeners("error").length) {
      this.emit("error", err, file);
    } else {
      console.error("FILE-ERROR", file, err);
    }
    if (!file._errored) {
      this._currentProgress[file.idx] = -1;
      this.idx_finished++;
      this._checkFinish();
    }
    file._errored = true;
  };

  Client.prototype.fileDone = function(file) {
    this._currentProgress[file.idx] = 100;
    this.idx_finished++;
    this._checkFinish();
  };

  Client.prototype.onFinish = function() {
    this.el.d.removeClass(this.options.cssprocess);
  };

  Client.prototype._calcProgress = function() {
    var _count, _done, _failed, _idx, _precCumu, _running, _waiting, prec, ref;
    _running = 0;
    _waiting = 0;
    _done = 0;
    _failed = 0;
    _precCumu = 0;
    _count = 0;
    ref = this._currentProgress;
    for (_idx in ref) {
      prec = ref[_idx];
      _count++;
      if (prec < 0) {
        _failed++;
        _precCumu += 100;
        continue;
      }
      if (prec === 0) {
        _waiting++;
        continue;
      }
      if (prec < 100) {
        _running++;
        _precCumu += prec;
        continue;
      }
      if (prec === 100) {
        _done++;
        _precCumu += 100;
      }
    }
    this.emit("progress", _precCumu / _count, [_waiting, _running, _done, _failed], _count);
  };

  Client.prototype._checkFinish = function() {
    if (this.idx_finished >= this.idx_started) {
      this._running = false;
      this._currentProgress = {};
      this.emit("finish", this.idx_finished - this.count_last_finished);
      this.count_last_finished = this.idx_finished;
      if (this.options.maxcount > 0 && this.idx_started >= this.options.maxcount) {
        this.disable();
      }
    }
  };

  Client.prototype._validateEl = function(el, type) {
    var _el;
    if (el == null) {
      this._error(null, "missing-" + type + "-el");
      return;
    }
    switch (typeof el) {
      case "string":
        _el = dom(el, null, true);
        break;
      case "object":
        if (el instanceof HTMLElement) {
          _el = dom.domel(el);
        }
    }
    if (_el == null) {
      this._error(null, "invalid-" + type + "-el");
      return;
    }
    return _el;
  };

  Client.prototype._getFilesFromEvent = function(evnt) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    return ((ref = evnt.target) != null ? ref.files : void 0) || ((ref1 = evnt.originalEvent) != null ? (ref2 = ref1.target) != null ? ref2.files : void 0 : void 0) || ((ref3 = evnt.dataTransfer) != null ? ref3.files : void 0) || ((ref4 = evnt.originalEvent) != null ? (ref5 = ref4.dataTransfer) != null ? ref5.files : void 0 : void 0) || [];
  };

  Client.prototype.ERRORS = {
    "missing-select-el": "Missing select element. Please define a valid element as a Selector, DOM-node",
    "invalid-select-el": "Invalid select element. Please define a valid element as a Selector, DOM-node",
    "missing-drag-el": "Missing drag element. Please define a valid element as a Selector, DOM-node",
    "invalid-drag-el": "Invalid drag element. Please define a valid element as a Selector, DOM-node",
    "missing-host": "Missing host. You have to defien a host as url starting with `http://` or `https://`.",
    "invalid-host": "Invalid host. You have to defien a host as url starting with `http://` or `https://`.",
    "missing-domain": "Missing domain. You have to define a domain.",
    "missing-accesskey": "Missing accesskey. You have to define a accesskey.",
    "missing-keyprefix": "Missing keyprefix. You have to define a keyprefix.",
    "invalid-sign-url": "please define a `url` to sign the request",
    "invalid-sign-key": "please define a `key` to sign the request",
    "invalid-ttl": "for the option `ttl` only a positiv number is allowed",
    "invalid-tags": "for the option `tags` only an array of strings is allowed",
    "invalid-properties": "for the option `properties` only an object is allowed",
    "invalid-content-disposition": "for the option `content-disposition` only an string like: `attachment; filename=friendly_filename.pdf` is allowed",
    "invalid-acl": "the option acl only accepts the string `public-read` or `authenticated-read`",
    "invalid-quality": "the option quality has to be a integer between 0 and 100",
    "sign-failed": "failed to get the signature from server"
  };

  return Client;

})(Base);

Client.defaults = function(options) {
  for (_k in options) {
    _v = options[_k];
    if (indexOf.call(_defauktKeys, _k) >= 0) {
      _defaults[_k] = _v;
    }
  }
  return _defaults;
};

module.exports = Client;


},{"./base":1,"./file":3,"./fileview":4,"./utils":6,"domel":7,"xhr":9}],3:[function(_dereq_,module,exports){
var File, xhr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

xhr = _dereq_("xhr");

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

})(_dereq_("./base"));

module.exports = File;


},{"./base":1,"xhr":9}],4:[function(_dereq_,module,exports){
var FileView, dom,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

dom = _dereq_("domel");

FileView = (function(superClass) {
  extend(FileView, superClass);

  function FileView(fileObj, client, options) {
    this.fileObj = fileObj;
    this.client = client;
    this.options = options;
    this.update = bind(this.update, this);
    this.render = bind(this.render, this);
    FileView.__super__.constructor.apply(this, arguments);
    if ((this.options.resultTemplateFn != null) && typeof this.options.resultTemplateFn === "function") {
      this.template = this.options.resultTemplateFn;
    } else {
      this.template = this._defaultTemplate;
    }
    if (this.options.cssfileelement != null) {
      this.resultClass = this.options.cssfileelement;
    } else {
      this.resultClass = "file col-sm-6 col-md-4";
    }
    this.fileObj.on("progress", this.update());
    this.fileObj.on("done", this.update());
    this.fileObj.on("error", this.update());
    this.fileObj.on("invalid", this.update());
    return;
  }

  FileView.prototype.render = function() {
    this.el = dom.create("div", {
      "class": this.resultClass
    });
    this.el.innerHTML = this.template(this.fileObj.getData());
    return this.el;
  };

  FileView.prototype.update = function() {
    return (function(_this) {
      return function(evnt) {
        _this.el.innerHTML = _this.template(_this.fileObj.getData());
      };
    })(this);
  };

  FileView.prototype._defaultTemplate = function(data) {
    var _eMsg, _eName, _html, _k, _reason, _v, i, len, ref, ref1, ref2, ref3;
    _html = "<div class=\"thumbnail state-" + data.state + "\">\n	<b>" + data.filename + "</b>";
    switch (data.state) {
      case "progress":
        _html += "<div class=\"progress\">\n	<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"" + data.progress + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: " + data.progress + "%;\">\n		<span>" + data.progress + "%</span>\n	</div>\n</div>";
        break;
      case "done":
        _html += "<div class=\"result\">\n	<a href=\"" + data.result.url + "\" target=\"_new\">Fertig! ( " + data.result.key + " )</a>";
        ref = data.result;
        for (_k in ref) {
          _v = ref[_k];
          _html += "<input type=\"hidden\" name=\"" + data.name + "_" + data.idx + "_" + _k + "\" value=\"" + _v + "\">";
        }
        _html += "</div>";
        break;
      case "invalid":
        _html += "<div class=\"result\">\n	<b>Invalid</b>";
        ref1 = data.invalid_reason;
        for (i = 0, len = ref1.length; i < len; i++) {
          _reason = ref1[i];
          switch (_reason) {
            case "maxsize":
              _html += "<div class=\"alert alert-error\">File too big. Only files until " + data.options.maxsize + "kb are allowed.</div>";
              break;
            case "accept":
              _html += "<div class=\"alert alert-error\">Wrong type. Only files of type " + (data.options.accept.join(", ")) + " are allowed.</div>";
          }
          _html += "</div>";
        }
        break;
      case "error":
        _eName = data != null ? (ref2 = data.error) != null ? ref2.name : void 0 : void 0;
        _eMsg = data != null ? (ref3 = data.error) != null ? ref3.message : void 0 : void 0;
        _html += "<div class=\"alert alert-error\">An Error occured.";
        if (_eName != null ? _eName.length : void 0) {
          _html += "<p class=\"details\"><b>" + _eName + ":</b> " + _eMsg + "</p>";
        }
        _html += "</div>";
        break;
      case "aborted":
        _html += "<div class=\"alert alert-error\">Upload aborted.</div>";
    }
    _html += "</div>";
    return _html;
  };

  return FileView;

})(_dereq_("./base"));

module.exports = FileView;


},{"./base":1,"domel":7}],5:[function(_dereq_,module,exports){
var Base, Client, File, FileView;

Base = _dereq_("./base");

File = _dereq_("./file");

FileView = _dereq_("./fileview");

Client = _dereq_("./client");

Client.Base = Base;

Client.File = File;

Client.FileView = FileView;

module.exports = Client;


},{"./base":1,"./client":2,"./file":3,"./fileview":4}],6:[function(_dereq_,module,exports){
var _intRegex, assign, isArray, isFunction, isInt, isObject, isString,
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

isFunction = function(object) {
  return typeof object === 'function';
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
  isFunction: isFunction,
  isInt: isInt,
  assign: assign
};


},{}],7:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var addD, addDWrap, domHelper, isString, nonAutoAttach,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

isString = function(vr) {
  return typeof vr === 'string' || vr instanceof String;
};

nonAutoAttach = ["domel", "create", "byClass", "byId"];

addDWrap = function(fn, el, elIdx) {
  if (elIdx == null) {
    elIdx = 0;
  }
  return function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    args.splice(elIdx, 0, el);
    return fn.apply(domHelper, args);
  };
};

addD = function(el, key) {
  var j, len, nameFn, ref;
  if (key == null) {
    key = "d";
  }
  if (el == null) {
    return el;
  }
  if (el[key] != null) {
    return el;
  }
  el[key] = {};
  ref = Object.keys(domHelper);
  for (j = 0, len = ref.length; j < len; j++) {
    nameFn = ref[j];
    if (indexOf.call(nonAutoAttach, nameFn) < 0) {
      el[key][nameFn] = addDWrap(domHelper[nameFn], el);
    }
  }
  el[key].find = addDWrap(domHelper, el, 1);
  el[key].byId = addDWrap(domHelper.byId, el, 1);
  el[key].byClass = addDWrap(domHelper.byClass, el, 1);
  return el;
};


/*
	
	DOM helpers
 */

domHelper = function(sel, context, onlyFirst) {
  var _el, _results, _sel, _sels, ref;
  if (context == null) {
    context = document;
  }
  if (onlyFirst == null) {
    onlyFirst = false;
  }
  _sels = sel.split(" ");
  if (_sels.every((function(sel) {
    var ref;
    return (ref = sel[0]) === "." || ref === "#";
  }))) {
    while (_sels.length) {
      if ((_sel = (ref = _sels.splice(0, 1)) != null ? ref[0] : void 0)) {
        switch (_sel[0]) {
          case ".":
            context = domHelper.byClass(_sel, context, onlyFirst);
            break;
          case "#":
            context = domHelper.byId(_sel, context, onlyFirst);
        }
      }
    }
    return context;
  }
  _results = context.querySelectorAll(sel);
  if (onlyFirst) {
    return addD(_results != null ? _results[0] : void 0);
  }
  return (function() {
    var j, len, results;
    results = [];
    for (j = 0, len = _results.length; j < len; j++) {
      _el = _results[j];
      results.push(addD(_el));
    }
    return results;
  })();
};

domHelper.domel = function(el) {
  if (el != null) {
    return addD(el);
  }
};

domHelper.create = function(tag, attributes) {
  var _el, _k, _v;
  if (tag == null) {
    tag = "DIV";
  }
  if (attributes == null) {
    attributes = {};
  }
  _el = document.createElement(tag);
  for (_k in attributes) {
    _v = attributes[_k];
    _el.setAttribute(_k, _v);
  }
  return addD(_el);
};

domHelper.data = function(el, key, val) {
  if ((el != null ? el.dataset : void 0) == null) {
    if (val != null) {
      return;
    }
    return addD(el);
  }
  if ((key != null) && (val != null)) {
    el.dataset[key] = val;
  } else if (key != null) {
    return el.dataset[key];
  }
  return el.dataset;
};

domHelper.attr = function(el, key, val) {
  if ((key != null) && (val != null)) {
    el.setAttribute(key, val);
  } else if (key != null) {
    el.getAttribute(key);
  }
  return el;
};

domHelper.byClass = function(_cl, context, onlyFirst) {
  var _el, _results;
  if (context == null) {
    context = document;
  }
  if (onlyFirst == null) {
    onlyFirst = false;
  }
  if (_cl[0] === ".") {
    _cl = _cl.slice(1);
  }
  _results = context.getElementsByClassName(_cl);
  if (onlyFirst) {
    return addD(_results != null ? _results[0] : void 0);
  }
  return (function() {
    var j, len, results;
    results = [];
    for (j = 0, len = _results.length; j < len; j++) {
      _el = _results[j];
      results.push(addD(_el));
    }
    return results;
  })();
};

domHelper.byId = function(_id, context) {
  if (context == null) {
    context = document;
  }
  if (_id[0] === "#") {
    _id = _id.slice(1);
  }
  return addD(context.getElementById(_id));
};

domHelper.last = function(el, selector) {
  var idx;
  idx = el.childNodes.length - 1;
  while (idx >= 0) {
    if (domHelper.is(el.childNodes[idx], selector)) {
      return addD(el.childNodes[idx]);
      break;
    }
    idx--;
  }
  return null;
};

domHelper.parent = function(el, selector) {
  var _cursor;
  if (selector == null) {
    return addD(el.parentNode);
  }
  _cursor = el;
  while (_cursor.parentNode != null) {
    _cursor = _cursor.parentNode;
    if (domHelper.is(_cursor, selector)) {
      return addD(_cursor);
    }
  }
  return null;
};

domHelper.first = function(el, selector) {
  var child, idx, j, len, ref;
  idx = el.childNodes.length - 1;
  ref = el.childNodes;
  for (j = 0, len = ref.length; j < len; j++) {
    child = ref[j];
    if (domHelper.is(child, selector)) {
      return addD(child);
    }
  }
  return null;
};

domHelper.children = function(el, selector) {
  var child, children, idx, j, len, ref;
  children = [];
  idx = el.childNodes.length - 1;
  ref = el.childNodes;
  for (j = 0, len = ref.length; j < len; j++) {
    child = ref[j];
    if (domHelper.is(child, selector)) {
      children.push(addD(child));
    }
  }
  return children;
};

domHelper.countChildren = function(el, selector) {
  return domHelper.children(el, selector).length;
};

domHelper.is = function(el, selector) {
  if (selector[0] === ".") {
    return domHelper.hasClass(el, selector.slice(1));
  }
  if (selector[0] === "#") {
    return domHelper.hasId(el, selector.slice(1));
  }
  return false;
};

domHelper.hasClass = function(el, classname) {
  var ref;
  if (el.classList != null) {
    return el.classList.contains(classname);
  }
  if ((el != null ? el.className : void 0) == null) {
    return false;
  }
  if (indexOf.call((el != null ? (ref = el.className) != null ? ref.split(" ") : void 0 : void 0) || [], classname) >= 0) {
    return true;
  }
  return false;
};

domHelper.hide = function(el) {
  if ((el != null ? el.style : void 0) == null) {
    return null;
  }
  el.style.display = "none";
  return el;
};

domHelper.show = function(el, display) {
  if (display == null) {
    display = "block";
  }
  if ((el != null ? el.style : void 0) == null) {
    return null;
  }
  el.style.display = display;
  return el;
};

domHelper.addClass = function(element, classname) {
  var _classnames;
  if (this.hasClass(element, classname)) {
    return;
  }
  _classnames = element.className;
  if (!_classnames.length) {
    element.className = classname;
    return;
  }
  element.className += " " + classname;
  return addD(element);
};

domHelper.removeClass = function(element, classname) {
  var _classnames, rxp;
  if (!this.hasClass(element, classname)) {
    return;
  }
  _classnames = element.className;
  rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
  _classnames = _classnames.replace(rxp, "");
  element.className = _classnames;
  return addD(element);
};

domHelper.hasId = function(el, id) {
  if ((el != null ? el.id : void 0) === id) {
    return true;
  }
  return false;
};

domHelper.append = function(el, html) {
  var _hdiv, child, j, k, len, len1, ref;
  if (isString(html)) {
    _hdiv = document.createElement('div');
    _hdiv.innerHTML = html;
    ref = _hdiv.childNodes;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      if ((child != null ? child.tagName : void 0) != null) {
        el.appendChild(child);
      }
    }
  } else if (html instanceof HTMLCollection) {
    for (k = 0, len1 = html.length; k < len1; k++) {
      child = html[k];
      el.appendChild(child);
    }
  } else if (html instanceof Element) {
    el.appendChild(html);
  }
  return addD(el);
};

domHelper.prepend = function(el, html) {
  var _firstCh, _hdiv, _latestFirst, child, j, ref, ref1;
  _firstCh = (ref = el.childNodes) != null ? ref[0] : void 0;
  if (_firstCh == null) {
    domHelper.append(el, html);
    return;
  }
  _hdiv = document.createElement('div');
  _hdiv.innerHTML = html;
  _latestFirst = _firstCh;
  ref1 = _hdiv.childNodes;
  for (j = ref1.length - 1; j >= 0; j += -1) {
    child = ref1[j];
    if (!((child != null ? child.tagName : void 0) != null)) {
      continue;
    }
    el.insertBefore(child, _latestFirst);
    _latestFirst = child;
  }
  return el;
};

domHelper.remove = function(el) {
  var i;
  if (el instanceof Element) {
    el.parentElement.removeChild(el);
  }
  if (el instanceof HTMLCollection) {
    i = el.length - 1;
    while (i >= 0) {
      if (el[i] && el[i].parentElement) {
        el[i].parentElement.removeChild(el[i]);
      }
      i--;
    }
  }
  return el;
};

domHelper.replaceWith = function(el, elToRepl) {
  domHelper.parent(el).replaceChild(elToRepl, el);
  return el;
};

domHelper.clone = function(el) {
  return addD(el.cloneNode(true));
};

domHelper.on = function(el, type, handler) {
  if (el == null) {
    return;
  }
  if (el.addEventListener != null) {
    el.addEventListener(type, handler, false);
  } else if (el.attachEvent != null) {
    el.attachEvent('on' + type, handler);
  } else {
    el['on' + type] = handler;
  }
  return el;
};

domHelper.off = function(el, type, handler) {
  if (el == null) {
    return;
  }
  if (el.removeEventListener != null) {
    el.removeEventListener(type, handler, false);
  } else if (el.detachEvent != null) {
    el.detachEvent('on' + type, handler);
  } else {
    delete el['on' + type];
  }
  return el;
};

domHelper.emit = function(el, type) {
  var evt;
  evt = document.createEvent('Event');
  evt.initEvent(type, true, false);
  el.dispatchEvent(evt);
  return evt;
};

module.exports = domHelper;


},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(_dereq_,module,exports){
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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],9:[function(_dereq_,module,exports){
"use strict";
var window = _dereq_("global/window")
var once = _dereq_("once")
var isFunction = _dereq_("is-function")
var parseHeaders = _dereq_("parse-headers")
var xtend = _dereq_("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    var callback = options.callback
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        callback(err, response, response.body)

    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function noop() {}

},{"global/window":10,"is-function":11,"once":12,"parse-headers":15,"xtend":16}],10:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(_dereq_,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],12:[function(_dereq_,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],13:[function(_dereq_,module,exports){
var isFunction = _dereq_('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":11}],14:[function(_dereq_,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],15:[function(_dereq_,module,exports){
var trim = _dereq_('trim')
  , forEach = _dereq_('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":13,"trim":14}],16:[function(_dereq_,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[5])(5)
});