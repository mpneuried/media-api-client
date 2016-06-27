/*
 * Media-API-Client 1.3.1 ( 2016-06-27 )
 * https://github.com/mpneuried/media-api-client/tree/1.3.1
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

  Client.prototype.version = "@@version";

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
    }, function(err, resp, signature) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, signature);
    });
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
    "invalid-quality": "the option quality has to be a integer between 0 and 100"
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
    var _html, _k, _reason, _v, i, len, ref, ref1;
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
        _html += "<div class=\"alert alert-error\">An Error occured.</div>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfc3JjL2xpYi9iYXNlLmNvZmZlZSIsIl9zcmMvbGliL2NsaWVudC5jb2ZmZWUiLCJfc3JjL2xpYi9maWxlLmNvZmZlZSIsIl9zcmMvbGliL2ZpbGV2aWV3LmNvZmZlZSIsIl9zcmMvbGliL21haW4uY29mZmVlIiwiX3NyYy9saWIvdXRpbHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2RvbWVsL2xpYi9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMveGhyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIm5vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMveHRlbmQvaW1tdXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxJQUFBO0VBQUE7Ozs7QUFBTTs7Ozs7Ozs7aUJBQ0wsTUFBQSxHQUFR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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEJhc2UgZXh0ZW5kcyByZXF1aXJlKCdldmVudHMnKVxuXHRfZXJyb3I6ICggY2IsIGVyciwgZGF0YSApPT5cblx0XHRpZiBub3QgKCBlcnIgaW5zdGFuY2VvZiBFcnJvciApXG5cdFx0XHRfZXJyID0gbmV3IEVycm9yKCBlcnIgKVxuXHRcdFx0X2Vyci5uYW1lID0gZXJyXG5cdFx0XHR0cnlcblx0XHRcdFx0X2Vyci5tZXNzYWdlID0gQEVSUk9SU1sgZXJyIF0gb3IgXCIgLSBcIlxuXHRcdGVsc2Vcblx0XHRcdF9lcnIgPSBlcnJcblxuXHRcdGlmIEBsaXN0ZW5lcnMoIFwiZXJyb3JcIiApLmxlbmd0aFxuXHRcdFx0QGVtaXQoIFwiZXJyb3JcIiwgX2VyciwgZGF0YSApXG5cdFx0ZWxzZVxuXHRcdFx0Y29uc29sZS5lcnJvciggX2VyciwgZGF0YSApXG5cblx0XHRpZiBub3QgY2I/XG5cdFx0XHR0aHJvdyBfZXJyXG5cdFx0ZWxzZVxuXHRcdFx0Y2IoIF9lcnIgKVxuXHRcdHJldHVyblxuXHRcdFxubW9kdWxlLmV4cG9ydHMgPSBCYXNlXG4iLCJkb20gPSByZXF1aXJlKCBcImRvbWVsXCIgKVxueGhyID0gcmVxdWlyZSggXCJ4aHJcIiApXG5cbnV0aWxzID0gcmVxdWlyZSggXCIuL3V0aWxzXCIgKVxuQmFzZSA9IHJlcXVpcmUoIFwiLi9iYXNlXCIgKVxuRmlsZSA9IHJlcXVpcmUoIFwiLi9maWxlXCIgKVxuRmlsZVZpZXcgPSByZXF1aXJlKCBcIi4vZmlsZXZpZXdcIiApXG5cbl9kZWZhdWx0cyA9XG5cdGhvc3Q6IG51bGxcblx0ZG9tYWluOiBudWxsXG5cdGFjY2Vzc2tleTogbnVsbFxuXHRrZXlwcmVmaXg6IFwiY2xpZW50dXBsb2FkXCJcblx0YXV0b3N0YXJ0OiB0cnVlXG5cdHJlcXVlc3RTaWduRm46IG51bGxcblx0cmVzdWx0VGVtcGxhdGVGbjogbnVsbFxuXHRtYXhzaXplOiAwXG5cdG1heGNvdW50OiAwXG5cdHdpZHRoOiBudWxsXG5cdGhlaWdodDogbnVsbFxuXHRhY2NlcHQ6IG51bGxcblx0dHRsOiAwXG5cdGFjbDogXCJwdWJsaWMtcmVhZFwiXG5cdHByb3BlcnRpZXM6IG51bGxcblx0dGFnczogbnVsbFxuXHRcImNvbnRlbnQtZGlzcG9zaXRpb25cIjogbnVsbFxuXHRjc3Nkcm9wcGFibGU6IFwiZHJvcGFibGVcIlxuXHRjc3Nob3ZlcjogXCJob3ZlclwiXG5cdGNzc3Byb2Nlc3M6IFwicHJvY2Vzc1wiXG5cdGNzc2Rpc2FibGVkOiBcImRpc2FibGVkXCJcblxuX2RlZmF1a3RLZXlzID0gZm9yIF9rLCBfdiBvZiBfZGVmYXVsdHNcblx0X2tcblxuY2xhc3MgQ2xpZW50IGV4dGVuZHMgQmFzZVxuXHR2ZXJzaW9uOiBcIkBAdmVyc2lvblwiXG5cblx0X3JneEhvc3Q6IC9odHRwcz86XFwvXFwvW15cXC8kXFxzXSsvaVxuXG5cdGNvbnN0cnVjdG9yOiAoIGRyYWcsIGVscmVzdWx0cywgb3B0aW9ucyA9IHt9ICktPlxuXHRcdHN1cGVyXG5cdFx0XG5cdFx0QGVuYWJsZWQgPSB0cnVlXG5cdFx0QHVzZUZpbGVBUEkgPSBmYWxzZVxuXHRcdFxuXHRcdEBvbiggXCJmaWxlLm5ld1wiLCBAZmlsZU5ldyApXG5cblx0XHRAb24oIFwiZmlsZS5kb25lXCIsIEBmaWxlRG9uZSApXG5cdFx0QG9uKCBcImZpbGUuZXJyb3JcIiwgQGZpbGVFcnJvciApXG5cdFx0QG9uKCBcImZpbGUuaW52YWxpZFwiLCBAZmlsZUVycm9yIClcblx0XHRAb24oIFwiZmlsZS5hYm9ydGVkXCIsIEBmaWxlRXJyb3IgKVxuXHRcdEBvbiggXCJmaW5pc2hcIiwgQG9uRmluaXNoIClcblx0XHRAd2l0aGluX2VudGVyID0gZmFsc2VcblxuXG5cdFx0QGVsID0gQF92YWxpZGF0ZUVsKCBkcmFnLCBcImRyYWdcIiApXG5cdFx0QHNlbCA9IEBlbC5kLmZpbmQoIFwiaW5wdXQjeyBvcHRpb25zLmlucHV0Y2xhc3Mgb3IgXCJcIiB9W3R5cGU9J2ZpbGUnXVwiLCB0cnVlIClcblx0XHRpZiBub3QgQHNlbD9cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy1zZWxlY3QtZWxcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdEBmb3JtbmFtZSA9IEBzZWwuZ2V0QXR0cmlidXRlKCBcIm5hbWVcIiApXG5cblx0XHRpZiBlbHJlc3VsdHM/XG5cdFx0XHRAcmVzID0gQF92YWxpZGF0ZUVsKCBlbHJlc3VsdHMsIFwicmVzdWx0XCIgKVxuXG5cblx0XHRfaHRtbERhdGEgPSBAZWwuZC5kYXRhKClcblx0XHRAb3B0aW9ucyA9IHV0aWxzLmFzc2lnbigge30sIF9kZWZhdWx0cywgX2h0bWxEYXRhLCBvcHRpb25zIG9yIHt9IClcblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5ob3N0Py5sZW5ndGhcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy1ob3N0XCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgQF9yZ3hIb3N0LnRlc3QoIEBvcHRpb25zLmhvc3QgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLWhvc3RcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5kb21haW4/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJtaXNzaW5nLWRvbWFpblwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IEBvcHRpb25zLmFjY2Vzc2tleT8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3NpbmctYWNjZXNza2V5XCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBAb3B0aW9ucy5tYXhjb3VudD9cblx0XHRcdF9teGNudCA9IHBhcnNlSW50KCBAb3B0aW9ucy5tYXhjb3VudCwgMTAgKVxuXHRcdFx0aWYgaXNOYU4oIF9teGNudCApXG5cdFx0XHRcdEBvcHRpb25zLm1heGNvdW50ID0gX2RlZmF1bHRzLm1heGNvdW50XG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBvcHRpb25zLm1heGNvdW50ID0gX214Y250XG5cblx0XHRpZiBAb3B0aW9ucy5tYXhjb3VudCBpc250IDFcblx0XHRcdEBzZWwuc2V0QXR0cmlidXRlKCBcIm11bHRpcGxlXCIsIFwibXVsdGlwbGVcIiApXG5cblx0XHRpZiBAb3B0aW9ucy5tYXhzaXplP1xuXHRcdFx0X214c3ogPSBwYXJzZUludCggQG9wdGlvbnMubWF4c2l6ZSwgMTAgKVxuXHRcdFx0aWYgaXNOYU4oIF9teHN6IClcblx0XHRcdFx0QG9wdGlvbnMubWF4c2l6ZSA9IF9kZWZhdWx0cy5tYXhzaXplXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBvcHRpb25zLm1heHNpemUgPSBfbXhzelxuXG5cdFx0aWYgQG9wdGlvbnMucmVxdWVzdFNpZ25Gbj8gYW5kIHR5cGVvZiBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuIGlzbnQgXCJmdW5jdGlvblwiXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtcmVxdWVzdFNpZ25mblwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMudHRsPyBhbmQgbm90IHV0aWxzLmlzSW50KCBAb3B0aW9ucy50dGwgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXR0bFwiIClcblx0XHRcdHJldHVyblxuXHRcdGVsc2UgaWYgQG9wdGlvbnMudHRsP1xuXHRcdFx0QG9wdGlvbnMudHRsID0gcGFyc2VJbnQoIEBvcHRpb25zLnR0bCwgMTAgKVxuXHRcdFx0aWYgaXNOYU4oIEBvcHRpb25zLnR0bCApXG5cdFx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC10dGxcIiApXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMudGFncz8gYW5kIHV0aWxzLmlzQXJyYXkoIEBvcHRpb25zLnRhZ3MgKVxuXHRcdFx0Zm9yIF90YWcgaW4gQG9wdGlvbnMudGFncyB3aGVuIG5vdCB1dGlscy5pc1N0cmluZyggX3RhZyApXG5cdFx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC10YWdzXCIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRlbHNlIGlmIEBvcHRpb25zLnRhZ3M/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdGFnc1wiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMucHJvcGVydGllcz8gYW5kIG5vdCB1dGlscy5pc09iamVjdCggQG9wdGlvbnMucHJvcGVydGllcyApXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtcHJvcGVydGllc1wiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMucXVhbGl0eT8gYW5kICggbm90IHV0aWxzLmlzSW50KCBAb3B0aW9ucy5xdWFsaXR5ICkgb3IgQG9wdGlvbnMucXVhbGl0eSA8IDAgb3IgQG9wdGlvbnMucXVhbGl0eSA+IDEwMCApXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtcXVhbGl0eVwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnNbIFwiY29udGVudC1kaXNwb3NpdGlvblwiIF0/IGFuZCBub3QgdXRpbHMuaXNTdHJpbmcoIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdIClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC1jb250ZW50LWRpc3Bvc2l0aW9uXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBAb3B0aW9ucy5hY2w/IGFuZCBub3QgdXRpbHMuaXNTdHJpbmcoIEBvcHRpb25zLmFjbCApIGFuZCBAb3B0aW9ucy5hY2wgbm90IGluIFsgXCJwdWJsaWMtcmVhZFwiLCBcImF1dGhlbnRpY2F0ZWQtcmVhZFwiIF1cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC1hY2xcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRcdFxuXHRcdGlmIEBvcHRpb25zLnJlcXVlc3RTaWduRm4/IGFuZCB1dGlscy5pc0Z1bmN0aW9uKCBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuIClcblx0XHRcdEBfc2lnbiA9IEBvcHRpb25zLnJlcXVlc3RTaWduRm5cblx0XHRlbHNlXG5cdFx0XHRAX3NpZ24gPSBAX2RlZmF1bHRSZXF1ZXN0U2lnbmF0dXJlXG5cblx0XHRfaW5wQWNjZXB0ID0gQHNlbC5nZXRBdHRyaWJ1dGUoIFwiYWNjZXB0XCIgKVxuXHRcdGlmIEBvcHRpb25zLmFjY2VwdD8gb3IgX2lucEFjY2VwdD9cblx0XHRcdF9odG1sID0gX2lucEFjY2VwdD8uc3BsaXQoIFwiLFwiICkgb3IgW11cblx0XHRcdF9vcHQgPSBAb3B0aW9ucy5hY2NlcHQ/LnNwbGl0KCBcIixcIiApIG9yIFtdXG5cdFx0XHRpZiBfaHRtbD8ubGVuZ3RoXG5cdFx0XHRcdEBvcHRpb25zLmFjY2VwdCA9IF9odG1sXG5cdFx0XHRlbHNlIGlmIF9vcHQ/Lmxlbmd0aFxuXHRcdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJhY2NlcHRcIiwgQG9wdGlvbnMuYWNjZXB0IClcblx0XHRcdEBvcHRpb25zLmFjY2VwdFJ1bGVzID0gQGdlbmVyYXRlQWNjZXB0UnVsZXMoIEBvcHRpb25zLmFjY2VwdCApXG5cblx0XHRAaW5pdGlhbGl6ZSgpXG5cdFx0QGlkeF9zdGFydGVkID0gMFxuXHRcdEBpZHhfZmluaXNoZWQgPSAwXG5cdFx0QGNvdW50X2xhc3RfZmluaXNoZWQgPSAwXG5cblx0XHRAb24gXCJmaWxlLnVwbG9hZFwiLCBAZmlsZVN0YXJ0ZWRcblxuXHRcdEBfY3VycmVudFByb2dyZXNzID0ge31cblx0XHRAb24gXCJmaWxlLnByb2dyZXNzXCIsIEBmaWxlUHJvZ3Jlc3NcblxuXHRcdEBlbC5kLmRhdGEoIFwibWVkaWFhcGljbGllbnRcIiwgQCApXG5cdFx0cmV0dXJuXG5cblx0Z2VuZXJhdGVBY2NlcHRSdWxlczogKCBhY2NlcHQgKS0+XG5cdFx0X3J1bGVzID0gW11cblxuXHRcdGZvciBfcnVsZSBpbiBhY2NlcHRcblx0XHRcdGlmIF9ydWxlLmluZGV4T2YoIFwiL1wiICkgPj0gMFxuXHRcdFx0XHRfcnVsZXMucHVzaCAoIC0+XG5cdFx0XHRcdFx0X3JlZ2V4ID0gbmV3IFJlZ0V4cCggXCIje19ydWxlLnJlcGxhY2UoIFwiKlwiLCBcIlxcXFx3K1wiICl9JFwiLCBcImlcIiApXG5cdFx0XHRcdFx0cmV0dXJuICggZmlsZSApLT5cblx0XHRcdFx0XHRcdHJldHVybiBfcmVnZXgudGVzdCggZmlsZS50eXBlIClcblx0XHRcdFx0XHQpKClcblx0XHRcdGVsc2UgaWYgX3J1bGUuaW5kZXhPZiggXCIuXCIgKSA+PSAwXG5cdFx0XHRcdF9ydWxlcy5wdXNoICggLT5cblx0XHRcdFx0XHRfcmVnZXggPSBuZXcgUmVnRXhwKCBcIiN7X3J1bGUucmVwbGFjZSggXCIuXCIsIFwiXFxcXC5cIiApfSRcIiwgXCJpXCIgKVxuXHRcdFx0XHRcdHJldHVybiAoIGZpbGUgKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3JlZ2V4LnRlc3QoIGZpbGUubmFtZSApXG5cdFx0XHRcdFx0KSgpXG5cdFx0XHRlbHNlIGlmIF9ydWxlIGlzIFwiKlwiXG5cdFx0XHRcdF9ydWxlcy5wdXNoICgoIGZpbGUgKS0+IHRydWUgKVxuXHRcdHJldHVybiBfcnVsZXNcblxuXHRpbml0aWFsaXplOiA9PlxuXHRcdGlmIHdpbmRvdy5GaWxlIGFuZCB3aW5kb3cuRmlsZUxpc3QgYW5kIHdpbmRvdy5GaWxlUmVhZGVyXG5cdFx0XHRAc2VsLmQub24oIFwiY2hhbmdlXCIsIEBvblNlbGVjdCApXG5cdFx0XHRAdXNlRmlsZUFQSSA9IHRydWVcblx0XHRcdEBpbml0RmlsZUFQSSgpXG5cdFx0ZWxzZVxuXHRcdFx0IyBUT0RPIGltcGxlbWVudCBJRTkgRmFsbGJhY2tcdFx0XG5cdFx0cmV0dXJuXG5cblx0aW5pdEZpbGVBUEk6ID0+XG5cdFx0X3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cdFx0XG5cdFx0aWYgX3hocj8udXBsb2FkXG5cdFx0XHRAZWwub25kcmFnb3ZlciA9IEBvbkhvdmVyXG5cdFx0XHRAZWwub25kcmFnbGVhdmUgPSBAb25MZWF2ZVxuXHRcdFx0QGVsLm9uZHJvcCA9IEBvblNlbGVjdFxuXHRcdFx0XG5cdFx0XHRAZWwuZC5hZGRDbGFzcyggQG9wdGlvbnMuY3NzZHJvcHBhYmxlIClcblx0XHRlbHNlXG5cdFx0cmV0dXJuXG5cblx0b25TZWxlY3Q6ICggZXZudCApPT5cblx0XHRmaWxlcyA9IEBfZ2V0RmlsZXNGcm9tRXZlbnQoIGV2bnQgKVxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPD0gMCBvciBAaWR4X3N0YXJ0ZWQgPCBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc2hvdmVyIClcblx0XHRcdGlmIGZpbGVzPy5sZW5ndGhcblx0XHRcdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc3Byb2Nlc3MgKVxuXG5cdFx0XHRcdEB1cGxvYWQoIGZpbGVzIClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdEBlbC5kLnJlbW92ZUNsYXNzKCBAb3B0aW9ucy5jc3Nob3ZlciApXG5cdFx0XHRAZGlzYWJsZSgpXG5cdFx0cmV0dXJuXG5cblx0b25Ib3ZlcjogKCBldm50ICk9PlxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0QGVtaXQoIFwiZmlsZS5ob3ZlclwiIClcblx0XHRAd2l0aGluX2VudGVyID0gdHJ1ZVxuXHRcdHNldFRpbWVvdXQoICggPT4gQHdpdGhpbl9lbnRlciA9IGZhbHNlICksIDApXG5cdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc2hvdmVyIClcblx0XHRyZXR1cm5cblxuXHRvbk92ZXI6ICggZXZudCApPT5cblx0XHRldm50LnByZXZlbnREZWZhdWx0KClcblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXG5cdG9uTGVhdmU6ICggZXZudCApPT5cblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBAd2l0aGluX2VudGVyXG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdHJldHVyblxuXG5cdHVwbG9hZDogKCBmaWxlcyApPT5cblx0XHRAc2V0TWF4TGlzdGVuZXJzKCBmaWxlcy5sZW5ndGggKSBpZiBmaWxlcy5sZW5ndGggPiAxMFxuXHRcdGlmIEB1c2VGaWxlQVBJXG5cdFx0XHRmb3IgZmlsZSwgaWR4IGluIGZpbGVzIHdoZW4gQGVuYWJsZWRcblx0XHRcdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPD0gMCBvciBAaWR4X3N0YXJ0ZWQgPCBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0XHRcdEBpZHhfc3RhcnRlZCsrXG5cdFx0XHRcdFx0bmV3IEZpbGUoIGZpbGUsIEBpZHhfc3RhcnRlZCwgQCwgQG9wdGlvbnMgKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXHRcblx0ZGVsZXRlRmlsZTogKCBrZXksIHJldiwgY2IgKT0+XG5cdFx0XG5cdFx0X3VybCA9IEBvcHRpb25zLmhvc3QgKyBAb3B0aW9ucy5kb21haW4gKyBcIi8je2tleX0/cmV2aXNpb249I3tyZXZ9XCJcblx0XHRcblx0XHRAc2lnbiB7IHVybDogX3VybCwga2V5OiBrZXkgfSwgKCBlcnIsIHN1cmwsIHNpZ25hdHVyZSApPT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0eGhyKCB7XG5cdFx0XHRcdHVybDogc3VybFxuXHRcdFx0XHRtZXRob2Q6IFwiREVMRVRFXCJcblx0XHRcdH0sICggZXJyLCByZXNwLCBib2R5ICk9PlxuXHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0Y2IoIG51bGwsIGJvZHkgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXHRcblx0c2lnbjogKCBvcHQsIGNiICk9PlxuXHRcdF9vcHQgPSB1dGlscy5hc3NpZ24oIHt9LCB7IGRvbWFpbjogQG9wdGlvbnMuZG9tYWluLCBhY2Nlc3NrZXk6IEBvcHRpb25zLmFjY2Vzc2tleSwganNvbjogbnVsbCwgdXJsOiBudWxsLCBrZXk6IG51bGwgfSwgb3B0IClcblx0XHRpZiBub3QgX29wdC51cmw/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggY2IsIFwiaW52YWxpZC1zaWduLXVybFwiIClcblx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBfb3B0LmtleT8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBjYiwgXCJpbnZhbGlkLXNpZ24ta2V5XCIgKVxuXHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRAX3NpZ24gX29wdC5kb21haW4sIF9vcHQuYWNjZXNza2V5LCBfb3B0LnVybCwgX29wdC5rZXksIF9vcHQuanNvbiwgKCBlcnIsIHNpZ25hdHVyZSApLT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRfc3VybCA9IF9vcHQudXJsXG5cdFx0XHRpZiBfc3VybC5pbmRleE9mKCBcIj9cIiApID49IDBcblx0XHRcdFx0X3N1cmwgKz0gXCImXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0X3N1cmwgKz0gXCI/XCJcblx0XHRcdF9zdXJsICs9ICggXCJzaWduYXR1cmU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIHNpZ25hdHVyZSApIClcblx0XHRcdGNiKCBudWxsLCBfc3VybCwgc2lnbmF0dXJlIClcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXHRcdFxuXHRfZGVmYXVsdFJlcXVlc3RTaWduYXR1cmU6ICggZG9tYWluLCBhY2Nlc3NrZXksIG1hZGlhYXBpdXJsLCBrZXksIGpzb24sIGNiICk9PlxuXHRcdFxuXHRcdF91cmwgPSBAb3B0aW9ucy5ob3N0ICsgZG9tYWluICsgXCIvc2lnbi9cIiArIGFjY2Vzc2tleVxuXHRcdFxuXHRcdF94aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRcblx0XHRkYXRhID0gbmV3IEZvcm1EYXRhKClcblx0XHRkYXRhLmFwcGVuZCggXCJ1cmxcIiwgbWFkaWFhcGl1cmwgKVxuXHRcdGRhdGEuYXBwZW5kKCBcImtleVwiLCBrZXkgKVxuXHRcdGlmIGpzb24/XG5cdFx0XHRkYXRhLmFwcGVuZCggXCJqc29uXCIsIEpTT04uc3RyaW5naWZ5KCBqc29uICkgKVxuXHRcdHhocigge1xuXHRcdFx0eGhyOiBfeGhyXG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiXG5cdFx0XHR1cmw6IF91cmxcblx0XHRcdGJvZHk6IGRhdGFcblx0XHR9LCAoIGVyciwgcmVzcCwgc2lnbmF0dXJlICktPlxuXHRcdFx0aWYgZXJyXG5cdFx0XHRcdGNiKCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNiKCBudWxsLCBzaWduYXR1cmUgKVxuXHRcdFx0cmV0dXJuXG5cdFx0KVxuXHRcdHJldHVyblxuXG5cdGFib3J0QWxsOiA9PlxuXHRcdEBlbWl0IFwiYWJvcnRBbGxcIlxuXHRcdHJldHVyblxuXG5cdGRpc2FibGU6ID0+XG5cdFx0QHNlbC5zZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiIClcblx0XHRAZWwuZC5hZGRDbGFzcyggQG9wdGlvbnMuY3NzZGlzYWJsZWQgKVxuXHRcdEBlbmFibGVkID0gZmFsc2Vcblx0XHRyZXR1cm5cblxuXHRlbmFibGU6ID0+XG5cdFx0QHNlbC5yZW1vdmVBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApXG5cdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc2Rpc2FibGVkIClcblx0XHRAZW5hYmxlZCA9IHRydWVcblx0XHRyZXR1cm5cblxuXHRmaWxlTmV3OiAoIGZpbGUgKT0+XG5cdFx0aWYgQHJlcz9cblx0XHRcdF9maWxldmlldyA9IG5ldyBGaWxlVmlldyggZmlsZSwgQCwgQG9wdGlvbnMgKVxuXHRcdFx0QHJlcy5kLmFwcGVuZCggX2ZpbGV2aWV3LnJlbmRlcigpIClcblx0XHRyZXR1cm5cblxuXHRmaWxlU3RhcnRlZDogKCBmaWxlICk9PlxuXHRcdEBfY3VycmVudFByb2dyZXNzWyBmaWxlLmlkeCBdID0gMFxuXHRcdGlmIEBfcnVubmluZ1xuXHRcdFx0cmV0dXJuXG5cdFx0QF9ydW5uaW5nID0gdHJ1ZVxuXHRcdEBlbWl0KCBcInN0YXJ0XCIgKVxuXHRcdHJldHVyblxuXG5cdGZpbGVQcm9ncmVzczogKCBmaWxlLCBwcmVjZW50ICk9PlxuXHRcdGlmIG5vdCBAX2N1cnJlbnRQcm9ncmVzc1sgZmlsZS5pZHggXT8gb3IgQF9jdXJyZW50UHJvZ3Jlc3NbIGZpbGUuaWR4IF0gPj0gMFxuXHRcdFx0QF9jdXJyZW50UHJvZ3Jlc3NbIGZpbGUuaWR4IF0gPSBwcmVjZW50XG5cblx0XHRAX2NhbGNQcm9ncmVzcygpXG5cdFx0cmV0dXJuXG5cblx0ZmlsZUVycm9yOiAoIGZpbGUsIGVyciApPT5cblx0XHRpZiBAbGlzdGVuZXJzKCBcImVycm9yXCIgKS5sZW5ndGhcblx0XHRcdEBlbWl0KCBcImVycm9yXCIsIGVyciwgZmlsZSApXG5cdFx0ZWxzZVxuXHRcdFx0Y29uc29sZS5lcnJvciBcIkZJTEUtRVJST1JcIiwgZmlsZSwgZXJyXG5cdFx0aWYgbm90IGZpbGUuX2Vycm9yZWRcblx0XHRcdEBfY3VycmVudFByb2dyZXNzWyBmaWxlLmlkeCBdID0gLTFcblx0XHRcdEBpZHhfZmluaXNoZWQrK1xuXHRcdFx0QF9jaGVja0ZpbmlzaCgpXG5cdFx0ZmlsZS5fZXJyb3JlZCA9IHRydWVcblxuXHRcdHJldHVyblxuXG5cdGZpbGVEb25lOiAoIGZpbGUgKT0+XG5cdFx0QF9jdXJyZW50UHJvZ3Jlc3NbIGZpbGUuaWR4IF0gPSAxMDBcblx0XHRAaWR4X2ZpbmlzaGVkKytcblx0XHRAX2NoZWNrRmluaXNoKClcblx0XHRyZXR1cm5cblxuXHRvbkZpbmlzaDogPT5cblx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzcHJvY2VzcyApXG5cdFx0cmV0dXJuXG5cblx0X2NhbGNQcm9ncmVzczogPT5cblx0XHRfcnVubmluZyA9IDBcblx0XHRfd2FpdGluZyA9IDBcblx0XHRfZG9uZSA9IDBcblx0XHRfZmFpbGVkID0gMFxuXHRcdF9wcmVjQ3VtdSA9IDBcblx0XHRfY291bnQgPSAwXG5cblx0XHRmb3IgX2lkeCwgcHJlYyBvZiBAX2N1cnJlbnRQcm9ncmVzc1xuXHRcdFx0X2NvdW50Kytcblx0XHRcdGlmIHByZWMgPCAwXG5cdFx0XHRcdF9mYWlsZWQrK1xuXHRcdFx0XHRfcHJlY0N1bXUgKz0gMTAwXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBwcmVjIGlzIDBcblx0XHRcdFx0X3dhaXRpbmcrK1xuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0aWYgcHJlYyA8IDEwMFxuXHRcdFx0XHRfcnVubmluZysrXG5cdFx0XHRcdF9wcmVjQ3VtdSArPSBwcmVjXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBwcmVjIGlzIDEwMFxuXHRcdFx0XHRfZG9uZSsrXG5cdFx0XHRcdF9wcmVjQ3VtdSArPSAxMDBcblxuXHRcdEBlbWl0KCBcInByb2dyZXNzXCIsIF9wcmVjQ3VtdS9fY291bnQsIFsgX3dhaXRpbmcsIF9ydW5uaW5nLCBfZG9uZSwgX2ZhaWxlZCBdLCBfY291bnQgKVxuXHRcdHJldHVyblxuXG5cdF9jaGVja0ZpbmlzaDogPT5cblx0XHRpZiBAaWR4X2ZpbmlzaGVkID49IEBpZHhfc3RhcnRlZFxuXHRcdFx0QF9ydW5uaW5nID0gZmFsc2Vcblx0XHRcdEBfY3VycmVudFByb2dyZXNzID0ge31cblx0XHRcdEBlbWl0KCBcImZpbmlzaFwiLCBAaWR4X2ZpbmlzaGVkIC0gQGNvdW50X2xhc3RfZmluaXNoZWQgKVxuXHRcdFx0QGNvdW50X2xhc3RfZmluaXNoZWQgPSBAaWR4X2ZpbmlzaGVkXG5cdFx0XHRpZiBAb3B0aW9ucy5tYXhjb3VudCA+IDAgYW5kIEBpZHhfc3RhcnRlZCA+PSBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0XHRAZGlzYWJsZSgpXG5cdFx0cmV0dXJuXG5cblx0X3ZhbGlkYXRlRWw6ICggZWwsIHR5cGUgKT0+XG5cdFx0aWYgbm90IGVsP1xuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJtaXNzaW5nLSN7dHlwZX0tZWxcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdHN3aXRjaCB0eXBlb2YgZWxcblx0XHRcdHdoZW4gXCJzdHJpbmdcIlxuXHRcdFx0XHRfZWwgPSBkb20oIGVsLCBudWxsLCB0cnVlIClcblx0XHRcdHdoZW4gXCJvYmplY3RcIlxuXHRcdFx0XHRpZiBlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0X2VsID0gZG9tLmRvbWVsKCBlbCApXG5cblx0XHRpZiBub3QgX2VsP1xuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLSN7dHlwZX0tZWxcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdHJldHVybiBfZWxcblxuXHRfZ2V0RmlsZXNGcm9tRXZlbnQ6ICggZXZudCApPT5cblx0XHRyZXR1cm4gZXZudC50YXJnZXQ/LmZpbGVzIG9yIGV2bnQub3JpZ2luYWxFdmVudD8udGFyZ2V0Py5maWxlcyBvciBldm50LmRhdGFUcmFuc2Zlcj8uZmlsZXMgb3IgZXZudC5vcmlnaW5hbEV2ZW50Py5kYXRhVHJhbnNmZXI/LmZpbGVzIG9yIFtdXG5cblx0RVJST1JTOlxuXHRcdFwibWlzc2luZy1zZWxlY3QtZWxcIjogXCJNaXNzaW5nIHNlbGVjdCBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLXNlbGVjdC1lbFwiOiBcIkludmFsaWQgc2VsZWN0IGVsZW1lbnQuIFBsZWFzZSBkZWZpbmUgYSB2YWxpZCBlbGVtZW50IGFzIGEgU2VsZWN0b3IsIERPTS1ub2RlXCJcblx0XHRcIm1pc3NpbmctZHJhZy1lbFwiOiBcIk1pc3NpbmcgZHJhZyBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLWRyYWctZWxcIjogXCJJbnZhbGlkIGRyYWcgZWxlbWVudC4gUGxlYXNlIGRlZmluZSBhIHZhbGlkIGVsZW1lbnQgYXMgYSBTZWxlY3RvciwgRE9NLW5vZGVcIlxuXHRcdFwibWlzc2luZy1ob3N0XCI6IFwiTWlzc2luZyBob3N0LiBZb3UgaGF2ZSB0byBkZWZpZW4gYSBob3N0IGFzIHVybCBzdGFydGluZyB3aXRoIGBodHRwOi8vYCBvciBgaHR0cHM6Ly9gLlwiXG5cdFx0XCJpbnZhbGlkLWhvc3RcIjogXCJJbnZhbGlkIGhvc3QuIFlvdSBoYXZlIHRvIGRlZmllbiBhIGhvc3QgYXMgdXJsIHN0YXJ0aW5nIHdpdGggYGh0dHA6Ly9gIG9yIGBodHRwczovL2AuXCJcblx0XHRcIm1pc3NpbmctZG9tYWluXCI6IFwiTWlzc2luZyBkb21haW4uIFlvdSBoYXZlIHRvIGRlZmluZSBhIGRvbWFpbi5cIlxuXHRcdFwibWlzc2luZy1hY2Nlc3NrZXlcIjogXCJNaXNzaW5nIGFjY2Vzc2tleS4gWW91IGhhdmUgdG8gZGVmaW5lIGEgYWNjZXNza2V5LlwiXG5cdFx0XCJtaXNzaW5nLWtleXByZWZpeFwiOiBcIk1pc3Npbmcga2V5cHJlZml4LiBZb3UgaGF2ZSB0byBkZWZpbmUgYSBrZXlwcmVmaXguXCJcblx0XHRcImludmFsaWQtc2lnbi11cmxcIjogXCJwbGVhc2UgZGVmaW5lIGEgYHVybGAgdG8gc2lnbiB0aGUgcmVxdWVzdFwiXG5cdFx0XCJpbnZhbGlkLXNpZ24ta2V5XCI6IFwicGxlYXNlIGRlZmluZSBhIGBrZXlgIHRvIHNpZ24gdGhlIHJlcXVlc3RcIlxuXHRcdFwiaW52YWxpZC10dGxcIjogXCJmb3IgdGhlIG9wdGlvbiBgdHRsYCBvbmx5IGEgcG9zaXRpdiBudW1iZXIgaXMgYWxsb3dlZFwiXG5cdFx0XCJpbnZhbGlkLXRhZ3NcIjogXCJmb3IgdGhlIG9wdGlvbiBgdGFnc2Agb25seSBhbiBhcnJheSBvZiBzdHJpbmdzIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1wcm9wZXJ0aWVzXCI6IFwiZm9yIHRoZSBvcHRpb24gYHByb3BlcnRpZXNgIG9ubHkgYW4gb2JqZWN0IGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1jb250ZW50LWRpc3Bvc2l0aW9uXCI6IFwiZm9yIHRoZSBvcHRpb24gYGNvbnRlbnQtZGlzcG9zaXRpb25gIG9ubHkgYW4gc3RyaW5nIGxpa2U6IGBhdHRhY2htZW50OyBmaWxlbmFtZT1mcmllbmRseV9maWxlbmFtZS5wZGZgIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1hY2xcIjogXCJ0aGUgb3B0aW9uIGFjbCBvbmx5IGFjY2VwdHMgdGhlIHN0cmluZyBgcHVibGljLXJlYWRgIG9yIGBhdXRoZW50aWNhdGVkLXJlYWRgXCJcblx0XHRcImludmFsaWQtcXVhbGl0eVwiOiBcInRoZSBvcHRpb24gcXVhbGl0eSBoYXMgdG8gYmUgYSBpbnRlZ2VyIGJldHdlZW4gMCBhbmQgMTAwXCJcblxuQ2xpZW50LmRlZmF1bHRzID0gKCBvcHRpb25zICktPlxuXHRmb3IgX2ssIF92IG9mIG9wdGlvbnMgd2hlbiBfayBpbiBfZGVmYXVrdEtleXNcblx0XHRfZGVmYXVsdHNbIF9rIF0gPSBfdlxuXHRyZXR1cm4gX2RlZmF1bHRzXG5cdFxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRcbiIsInhociA9IHJlcXVpcmUoIFwieGhyXCIgKVxuXG5jbGFzcyBGaWxlIGV4dGVuZHMgcmVxdWlyZShcIi4vYmFzZVwiKVxuXG5cdHN0YXRlczogWyBcIm5ld1wiLCBcInN0YXJ0XCIsIFwic2lnbmVkXCIsIFwidXBsb2FkXCIsIFwicHJvZ3Jlc3NcIiwgXCJkb25lXCIsIFwiaW52YWxpZFwiLCBcImVycm9yXCIsIFwiYWJvcnRlZFwiIF1cblxuXHRjb25zdHJ1Y3RvcjogKCBAZmlsZSwgQGlkeCwgQGNsaWVudCwgQG9wdGlvbnMgKS0+XG5cdFx0c3VwZXJcblx0XHRAc3RhdGUgPSAwXG5cdFx0QHZhbGlkYXRpb24gPSBbXVxuXG5cdFx0QGtleSA9IEBvcHRpb25zLmtleXByZWZpeCArIFwiX1wiICsgQGdldE5hbWUoKS5yZXBsYWNlKCBAX3JneEZpbGUyS2V5LCBcIlwiICkgKyBcIl9cIiArIEBfbm93KCkgKyBcIl9cIiArIEBpZHhcblxuXHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLm5ld1wiLCBAIClcblx0XHRAY2xpZW50Lm9uIFwiYWJvcnRBbGxcIiwgQGFib3J0XG5cblx0XHRAb24oIFwic3RhcnRcIiwgQHN0YXJ0IClcblx0XHRAb24oIFwic2lnbmVkXCIsIEBfdXBsb2FkIClcblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5rZXlwcmVmaXg/Lmxlbmd0aFxuXHRcdFx0QG9wdGlvbnMua2V5cHJlZml4ID0gXCJjbGllbnR1cGxvYWRcIlxuXG5cdFx0aWYgbm90IEBvcHRpb25zLmF1dG9zdGFydD9cblx0XHRcdEBvcHRpb25zLmF1dG9zdGFydCA9IHRydWVcblxuXHRcdEBfdmFsaWRhdGUoKVxuXG5cdFx0aWYgQG9wdGlvbnMuYXV0b3N0YXJ0XG5cdFx0XHRAZW1pdCBcInN0YXJ0XCJcblx0XHRyZXR1cm5cblxuXHRzdGFydDogPT5cblx0XHRpZiBAc3RhdGUgPD0gMFxuXHRcdFx0QF9zZXRTdGF0ZSggMSApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS51cGxvYWRcIiwgQCApXG5cdFx0XHRAX3NpZ24oKVxuXHRcdHJldHVybiBAXG5cdFxuXHRhYm9ydDogPT5cblx0XHRpZiBAc3RhdGUgPD0gNFxuXHRcdFx0QF9zZXRTdGF0ZSggOCApXG5cdFx0XHRAcmVxdWVzdFVwbG9hZD8uYWJvcnQoKVxuXHRcdFx0QGVtaXQgXCJhYm9ydGVkXCJcblx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmFib3J0ZWRcIiwgQCApXG5cdFx0cmV0dXJuIEBcblx0XG5cdGdldFN0YXRlOiA9PlxuXHRcdHJldHVybiBAc3RhdGVzWyBAc3RhdGUgXVxuXG5cdGdldFJlc3VsdDogPT5cblx0XHRpZiBAc3RhdGUgaXMgNSBhbmQgQGRhdGE/XG5cdFx0XHRyZXR1cm4geyB1cmw6IEBkYXRhLnVybCwgaGFzaDogQGRhdGEuZmlsZWhhc2gsIGtleTogQGRhdGEua2V5LCB0eXBlOiBAZGF0YS5jb250ZW50X3R5cGUgfVxuXHRcdHJldHVybiBudWxsXG5cblx0Z2V0UHJvZ3Jlc3M6ICggYXNGYWN0b3IgPSBmYWxzZSApPT5cblx0XHRpZiBAc3RhdGUgPCA0XG5cdFx0XHRfZmFjID0gMFxuXHRcdGVsc2UgaWYgQHN0YXRlID4gNFxuXHRcdFx0X2ZhYyA9IDFcblx0XHRlbHNlXG5cdFx0XHRfZmFjID0gQHByb2dyZXNzU3RhdGVcblxuXHRcdGlmIGFzRmFjdG9yXG5cdFx0XHRyZXR1cm4gX2ZhY1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKCBfZmFjICogMTAwIClcblxuXHRnZXROYW1lOiA9PlxuXHRcdHJldHVybiBAZmlsZS5uYW1lXG5cblx0Z2V0VHlwZTogPT5cblx0XHRyZXR1cm4gQGZpbGUudHlwZVxuXG5cdGdldERhdGE6ID0+XG5cdFx0X3JldCA9XG5cdFx0XHRuYW1lOiBAY2xpZW50LmZvcm1uYW1lXG5cdFx0XHRmaWxlbmFtZTogQGdldE5hbWUoKVxuXHRcdFx0aWR4OiBAaWR4XG5cdFx0XHRzdGF0ZTogQGdldFN0YXRlKClcblx0XHRcdHByb2dyZXNzOiBAZ2V0UHJvZ3Jlc3MoKVxuXHRcdFx0cmVzdWx0OiBAZ2V0UmVzdWx0KClcblx0XHRcdG9wdGlvbnM6IEBvcHRpb25zXG5cdFx0XHRpbnZhbGlkX3JlYXNvbjogQHZhbGlkYXRpb25cblx0XHRcdGVycm9yOiBAZXJyb3Jcblx0XHRyZXR1cm4gX3JldFxuXG5cdF9zZXRTdGF0ZTogKCBzdGF0ZSApPT5cblx0XHRpZiBzdGF0ZSA+IEBzdGF0ZVxuXHRcdFx0QHN0YXRlID0gc3RhdGVcblx0XHRcdEBlbWl0KCBcInN0YXRlXCIsIEBnZXRTdGF0ZSgpIClcblxuXHRcdCMgZGV0YWNoIHRoZSBmaWxlIGZyb20gdGhlIGNsaWVudFxuXHRcdGlmIEBzdGF0ZSA+PSBAc3RhdGVzLmluZGV4T2YoIFwiZG9uZVwiIClcblx0XHRcdEBjbGllbnQucmVtb3ZlTGlzdGVuZXIgXCJhYm9ydEFsbFwiLCBAYWJvcnRcblx0XHRyZXR1cm4gc3RhdGVcblxuXHRfdmFsaWRhdGU6ID0+XG5cdFx0X3NpemUgPSBAZmlsZS5zaXplIC8gMTAyNFxuXHRcdGlmIEBvcHRpb25zLm1heHNpemUgPiAwIGFuZCBAb3B0aW9ucy5tYXhzaXplIDwgX3NpemVcblx0XHRcdEB2YWxpZGF0aW9uLnB1c2ggXCJtYXhzaXplXCJcblxuXHRcdGlmIEBvcHRpb25zLmFjY2VwdFJ1bGVzPy5sZW5ndGggYW5kIG5vdCBAX3Rlc3RNaW1lKCBAb3B0aW9ucy5hY2NlcHRSdWxlcyApXG5cdFx0XHRAdmFsaWRhdGlvbi5wdXNoIFwiYWNjZXB0XCJcblxuXHRcdGlmIEB2YWxpZGF0aW9uLmxlbmd0aFxuXHRcdFx0QF9zZXRTdGF0ZSggNiApXG5cdFx0XHRAZW1pdCggXCJpbnZhbGlkXCIsIEB2YWxpZGF0aW9uIClcblx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmludmFsaWRcIiwgQCwgQHZhbGlkYXRpb24gKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuXHRfdGVzdE1pbWU6ICggYWNjZXB0UnVsZXMgKT0+XG5cdFx0Zm9yIF9ydWxlIGluIGFjY2VwdFJ1bGVzXG5cdFx0XHRpZiBfcnVsZSggQGZpbGUgKVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cdF9ub3c6IC0+XG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIERhdGUubm93KCkgLyAxMDAwIClcblxuXHRfcmd4RmlsZTJLZXk6IC8oW15BLVphLXowLTldKS9pZ1xuXHRfc2lnbjogPT5cblx0XHRfbmFtZSA9IEBnZXROYW1lKClcblx0XHRfY29udGVudF90eXBlID0gQGdldFR5cGUoKVxuXHRcdGlmIEBzdGF0ZSA+IDFcblx0XHRcdHJldHVyblxuXHRcdEB1cmwgPSBAb3B0aW9ucy5ob3N0ICsgQG9wdGlvbnMuZG9tYWluICsgXCIvXCIgKyBAa2V5XG5cdFx0QGpzb24gPVxuXHRcdFx0YmxvYjogdHJ1ZVxuXHRcdFx0YWNsOiBAb3B0aW9ucy5hY2xcblx0XHRcdHR0bDogQG9wdGlvbnMudHRsXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRmaWxlbmFtZTogX25hbWVcblxuXHRcdEBqc29uLndpZHRoID0gQG9wdGlvbnMud2lkdGggaWYgQG9wdGlvbnMud2lkdGg/XG5cdFx0QGpzb24uaGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0IGlmIEBvcHRpb25zLmhlaWdodD9cblx0XHRAanNvbi5xdWFsaXR5ID0gQG9wdGlvbnMucXVhbGl0eSBpZiBAb3B0aW9ucy5xdWFsaXR5P1xuXHRcdFxuXHRcdEBqc29uLnRhZ3MgPSBAb3B0aW9ucy50YWdzIGlmIEBvcHRpb25zLnRhZ3M/XG5cdFx0QGpzb24ucHJvcGVydGllcyA9IEBvcHRpb25zLnByb3BlcnRpZXMgaWYgQG9wdGlvbnMucHJvcGVydGllcz9cblx0XHRAanNvblsgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSA9IEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdIGlmIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdP1xuXG5cdFx0QGpzb24uY29udGVudF90eXBlID0gX2NvbnRlbnRfdHlwZSBpZiBfY29udGVudF90eXBlPy5sZW5ndGhcblxuXHRcdEBlbWl0KCBcImNvbnRlbnRcIiwgQGtleSwgQGpzb24gKVxuXHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmNvbnRlbnRcIiwgQCwgQGtleSwgQGpzb24gKVxuXHRcdFxuXHRcdEBjbGllbnQuc2lnbi5jYWxsIEAsIHsgdXJsOiBAdXJsLCBrZXk6IEBrZXksIGpzb246IEBqc29uIH0sICggZXJyLCBAdXJsICk9PlxuXHRcdFx0aWYgZXJyXG5cdFx0XHRcdEBlcnJvciA9IGVyclxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QGVtaXQoIFwiZXJyb3JcIiwgZXJyIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0QF9zZXRTdGF0ZSggMiApXG5cdFx0XHRAZW1pdCggXCJzaWduZWRcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm5cblxuXHRfdXBsb2FkOiA9PlxuXHRcdGlmIEBzdGF0ZSA+IDJcblx0XHRcdHJldHVyblxuXHRcdEBfc2V0U3RhdGUoIDMgKVxuXHRcdGRhdGEgPSBuZXcgRm9ybURhdGEoKVxuXHRcdGRhdGEuYXBwZW5kKCBcIkpTT05cIiwgSlNPTi5zdHJpbmdpZnkoIEBqc29uICkgKVxuXHRcdGRhdGEuYXBwZW5kKCBcImJsb2JcIiwgQGZpbGUgKVxuXHRcdFxuXHRcdF94aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRfeGhyLnVwbG9hZD8uYWRkRXZlbnRMaXN0ZW5lciggXCJwcm9ncmVzc1wiLCBAX2hhbmRsZVByb2dyZXNzKCksIGZhbHNlIClcblx0XHRfeGhyLmFkZEV2ZW50TGlzdGVuZXIoIFwicHJvZ3Jlc3NcIiwgQF9oYW5kbGVQcm9ncmVzcygpLCBmYWxzZSApXG5cdFx0X3hoci5faXNmaWxlID0gdHJ1ZVxuXHRcdFxuXHRcdEByZXF1ZXN0VXBsb2FkID0geGhyKCB7XG5cdFx0XHR4aHI6IF94aHJcblx0XHRcdHVybDogQHVybFxuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIlxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0sICggZXJyLCByZXNwLCBib2R5ICk9PlxuXHRcdFx0I2NvbnNvbGUubG9nIFwicmVxdWVzdFVwbG9hZFwiLCBlcnIsIHJlc3AsIGJvZHlcblx0XHRcdGlmIGVyclxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IGVyclxuXHRcdFx0XHRAZW1pdCggXCJlcnJvclwiLCBlcnIgKVxuXHRcdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5lcnJvclwiLCBALCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XG5cdFx0XHRfZGF0YSA9IEpTT04ucGFyc2UoIGJvZHkgKVxuXHRcdFx0aWYgcmVzcC5zdGF0dXNDb2RlID49IDMwMFxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IF9kYXRhXG5cdFx0XHRcdEBlbWl0KCBcImVycm9yXCIsIF9kYXRhIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgX2RhdGEgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFxuXHRcdFx0QGRhdGEgPSBfZGF0YT8ucm93c1sgMCBdXG5cdFx0XHRAcHJvZ3Jlc3NTdGF0ZSA9IDFcblx0XHRcdEBfc2V0U3RhdGUoIDUgKVxuXHRcdFx0QGVtaXQoIFwiZG9uZVwiLCBAZGF0YSApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5kb25lXCIsIEAgKVxuXHRcdFx0cmV0dXJuXG5cdFx0KVxuXHRcdHJldHVyblxuXG5cdF9oYW5kbGVQcm9ncmVzczogPT5cblx0XHRyZXR1cm4gKCBldm50ICk9PlxuXHRcdFx0aWYgbm90IGV2bnQudGFyZ2V0Lm1ldGhvZD9cblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSBldm50LmxvYWRlZC9ldm50LnRvdGFsXG5cdFx0XHRcdEBfc2V0U3RhdGUoIDQgKVxuXHRcdFx0XHRfcHJvZ3Jlc3MgPSBAZ2V0UHJvZ3Jlc3MoKVxuXHRcdFx0XHRAZW1pdCggXCJwcm9ncmVzc1wiLCBfcHJvZ3Jlc3MsIGV2bnQgKVxuXHRcdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5wcm9ncmVzc1wiLCBALCBfcHJvZ3Jlc3MgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHJldHVyblxuXHRcdFxubW9kdWxlLmV4cG9ydHMgPSBGaWxlXG4iLCJkb20gPSByZXF1aXJlKCBcImRvbWVsXCIgKVxuXG5jbGFzcyBGaWxlVmlldyBleHRlbmRzIHJlcXVpcmUoXCIuL2Jhc2VcIilcblx0Y29uc3RydWN0b3I6ICggQGZpbGVPYmosIEBjbGllbnQsIEBvcHRpb25zICktPlxuXHRcdHN1cGVyXG5cdFx0XG5cdFx0aWYgQG9wdGlvbnMucmVzdWx0VGVtcGxhdGVGbj8gYW5kIHR5cGVvZiBAb3B0aW9ucy5yZXN1bHRUZW1wbGF0ZUZuIGlzIFwiZnVuY3Rpb25cIlxuXHRcdFx0QHRlbXBsYXRlID0gQG9wdGlvbnMucmVzdWx0VGVtcGxhdGVGblxuXHRcdGVsc2Vcblx0XHRcdEB0ZW1wbGF0ZSA9IEBfZGVmYXVsdFRlbXBsYXRlXG5cdFx0XG5cdFx0aWYgQG9wdGlvbnMuY3NzZmlsZWVsZW1lbnQ/XG5cdFx0XHRAcmVzdWx0Q2xhc3MgPSBAb3B0aW9ucy5jc3NmaWxlZWxlbWVudFxuXHRcdGVsc2Vcblx0XHRcdEByZXN1bHRDbGFzcyA9IFwiZmlsZSBjb2wtc20tNiBjb2wtbWQtNFwiXG5cblx0XHRAZmlsZU9iai5vbiggXCJwcm9ncmVzc1wiLCBAdXBkYXRlKCkgKVxuXHRcdEBmaWxlT2JqLm9uKCBcImRvbmVcIiwgQHVwZGF0ZSgpIClcblx0XHRAZmlsZU9iai5vbiggXCJlcnJvclwiLCBAdXBkYXRlKCkgKVxuXHRcdEBmaWxlT2JqLm9uKCBcImludmFsaWRcIiwgQHVwZGF0ZSgpIClcblx0XHRyZXR1cm5cblxuXHRyZW5kZXI6ID0+XG5cdFx0QGVsID0gZG9tLmNyZWF0ZSggXCJkaXZcIiwgeyBjbGFzczogQHJlc3VsdENsYXNzIH0gKVxuXHRcdEBlbC5pbm5lckhUTUwgPSBAdGVtcGxhdGUoIEBmaWxlT2JqLmdldERhdGEoKSApXG5cdFx0cmV0dXJuIEBlbFxuXG5cdHVwZGF0ZTogPT5cblx0XHRyZXR1cm4gKCBldm50ICk9PlxuXHRcdFx0QGVsLmlubmVySFRNTCA9IEB0ZW1wbGF0ZSggQGZpbGVPYmouZ2V0RGF0YSgpIClcblx0XHRcdHJldHVyblxuXG5cdF9kZWZhdWx0VGVtcGxhdGU6ICggZGF0YSApLT5cblx0XHRfaHRtbCA9IFwiXCJcIlxuXHQ8ZGl2IGNsYXNzPVwidGh1bWJuYWlsIHN0YXRlLSN7IGRhdGEuc3RhdGUgfVwiPlxuXHRcdDxiPiN7IGRhdGEuZmlsZW5hbWV9PC9iPlxuXHRcdFwiXCJcIlxuXHRcdHN3aXRjaCBkYXRhLnN0YXRlXG5cdFx0XHR3aGVuIFwicHJvZ3Jlc3NcIlxuXHRcdFx0XHRfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2dyZXNzXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIje2RhdGEucHJvZ3Jlc3N9XCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogI3tkYXRhLnByb2dyZXNzfSU7XCI+XG5cdFx0XHRcdFx0XHQ8c3Bhbj4je2RhdGEucHJvZ3Jlc3N9JTwvc3Bhbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0d2hlbiBcImRvbmVcIlxuXHRcdFx0XHRfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJlc3VsdFwiPlxuXHRcdFx0XHRcdDxhIGhyZWY9XCIje2RhdGEucmVzdWx0LnVybH1cIiB0YXJnZXQ9XCJfbmV3XCI+RmVydGlnISAoICN7ZGF0YS5yZXN1bHQua2V5fSApPC9hPlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdFx0Zm9yIF9rLCBfdiBvZiBkYXRhLnJlc3VsdFxuXHRcdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiI3tkYXRhLm5hbWV9XyN7IGRhdGEuaWR4IH1fI3tfa31cIiB2YWx1ZT1cIiN7X3Z9XCI+XG5cdFx0XHRcdFx0XCJcIlwiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHR3aGVuIFwiaW52YWxpZFwiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzdWx0XCI+XG5cdFx0XHRcdFx0PGI+SW52YWxpZDwvYj5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHRcdGZvciBfcmVhc29uIGluIGRhdGEuaW52YWxpZF9yZWFzb25cblx0XHRcdFx0XHRzd2l0Y2ggX3JlYXNvblxuXHRcdFx0XHRcdFx0d2hlbiBcIm1heHNpemVcIlxuXHRcdFx0XHRcdFx0XHRfaHRtbCArPSBcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWVycm9yXFxcIj5GaWxlIHRvbyBiaWcuIE9ubHkgZmlsZXMgdW50aWwgI3tkYXRhLm9wdGlvbnMubWF4c2l6ZX1rYiBhcmUgYWxsb3dlZC48L2Rpdj5cIlxuXHRcdFx0XHRcdFx0d2hlbiBcImFjY2VwdFwiXG5cdFx0XHRcdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPldyb25nIHR5cGUuIE9ubHkgZmlsZXMgb2YgdHlwZSAje2RhdGEub3B0aW9ucy5hY2NlcHQuam9pbiggXCIsIFwiICl9IGFyZSBhbGxvd2VkLjwvZGl2PlwiXG5cblx0XHRcdFx0IF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHR3aGVuIFwiZXJyb3JcIlxuXHRcdFx0XHRfaHRtbCArPSBcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWVycm9yXFxcIj5BbiBFcnJvciBvY2N1cmVkLjwvZGl2PlwiXG5cblx0XHRcdHdoZW4gXCJhYm9ydGVkXCJcblx0XHRcdFx0X2h0bWwgKz0gXCI8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1lcnJvclxcXCI+VXBsb2FkIGFib3J0ZWQuPC9kaXY+XCJcblxuXHRcdF9odG1sICs9IFwiXCJcIlxuXHQ8L2Rpdj5cblx0XHRcIlwiXCJcblx0XHRyZXR1cm4gX2h0bWxcblx0XHRcbm1vZHVsZS5leHBvcnRzID0gRmlsZVZpZXdcbiIsIkJhc2UgPSByZXF1aXJlKCBcIi4vYmFzZVwiIClcbkZpbGUgPSByZXF1aXJlKCBcIi4vZmlsZVwiIClcbkZpbGVWaWV3ID0gcmVxdWlyZSggXCIuL2ZpbGV2aWV3XCIgKVxuXG5DbGllbnQgPSByZXF1aXJlKCBcIi4vY2xpZW50XCIgKVxuQ2xpZW50LkJhc2UgPSBCYXNlXG5DbGllbnQuRmlsZSA9IEZpbGVcbkNsaWVudC5GaWxlVmlldyA9IEZpbGVWaWV3XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50XG4iLCJpc09iamVjdCA9ICggdnIgKS0+XG5cdHJldHVybiAoIHZyIGlzbnQgbnVsbCBhbmQgdHlwZW9mIHZyIGlzICdvYmplY3QnIClcblxuaXNBcnJheSA9ICggdnIgKS0+XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZyICkgaXMgJ1tvYmplY3QgQXJyYXldJ1xuXG5pc1N0cmluZyA9ICggdnIgKS0+XG5cdHJldHVybiB0eXBlb2YgdnIgaXMgJ3N0cmluZycgb3IgdnIgaW5zdGFuY2VvZiBTdHJpbmdcblxuX2ludFJlZ2V4ID0gL15cXGQrJC9cbmlzSW50ID0gKCB2ciApLT5cblx0cmV0dXJuIF9pbnRSZWdleC50ZXN0KCB2ciApXG5cbmlzRnVuY3Rpb24gPSAoIG9iamVjdCApLT5cblx0cmV0dXJuIHR5cGVvZihvYmplY3QpIGlzICdmdW5jdGlvbidcblxuYXNzaWduID0gKCB0Z3J0LCBzcmNzLi4uICktPlxuXHRmb3Igc3JjIGluIHNyY3Ncblx0XHRpZiBpc09iamVjdCggc3JjIClcblx0XHRcdGZvciBfaywgX3Ygb2Ygc3JjXG5cdFx0XHRcdHRncnRbIF9rIF0gPSBfdlxuXHRyZXR1cm4gdGdydFxuXHRcbm1vZHVsZS5leHBvcnRzID1cblx0aXNBcnJheTogaXNBcnJheVxuXHRpc09iamVjdDogaXNPYmplY3Rcblx0aXNTdHJpbmc6IGlzU3RyaW5nXG5cdGlzRnVuY3Rpb246IGlzRnVuY3Rpb25cblx0aXNJbnQ6IGlzSW50XG5cdGFzc2lnbjogYXNzaWduXG4iLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5kb21lbCA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBhZGRELCBhZGREV3JhcCwgZG9tSGVscGVyLCBpc1N0cmluZywgbm9uQXV0b0F0dGFjaCxcbiAgc2xpY2UgPSBbXS5zbGljZSxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5pc1N0cmluZyA9IGZ1bmN0aW9uKHZyKSB7XG4gIHJldHVybiB0eXBlb2YgdnIgPT09ICdzdHJpbmcnIHx8IHZyIGluc3RhbmNlb2YgU3RyaW5nO1xufTtcblxubm9uQXV0b0F0dGFjaCA9IFtcImRvbWVsXCIsIFwiY3JlYXRlXCIsIFwiYnlDbGFzc1wiLCBcImJ5SWRcIl07XG5cbmFkZERXcmFwID0gZnVuY3Rpb24oZm4sIGVsLCBlbElkeCkge1xuICBpZiAoZWxJZHggPT0gbnVsbCkge1xuICAgIGVsSWR4ID0gMDtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3M7XG4gICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIGFyZ3Muc3BsaWNlKGVsSWR4LCAwLCBlbCk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGRvbUhlbHBlciwgYXJncyk7XG4gIH07XG59O1xuXG5hZGREID0gZnVuY3Rpb24oZWwsIGtleSkge1xuICB2YXIgaiwgbGVuLCBuYW1lRm4sIHJlZjtcbiAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAga2V5ID0gXCJkXCI7XG4gIH1cbiAgaWYgKGVsID09IG51bGwpIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cbiAgaWYgKGVsW2tleV0gIT0gbnVsbCkge1xuICAgIHJldHVybiBlbDtcbiAgfVxuICBlbFtrZXldID0ge307XG4gIHJlZiA9IE9iamVjdC5rZXlzKGRvbUhlbHBlcik7XG4gIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIG5hbWVGbiA9IHJlZltqXTtcbiAgICBpZiAoaW5kZXhPZi5jYWxsKG5vbkF1dG9BdHRhY2gsIG5hbWVGbikgPCAwKSB7XG4gICAgICBlbFtrZXldW25hbWVGbl0gPSBhZGREV3JhcChkb21IZWxwZXJbbmFtZUZuXSwgZWwpO1xuICAgIH1cbiAgfVxuICBlbFtrZXldLmZpbmQgPSBhZGREV3JhcChkb21IZWxwZXIsIGVsLCAxKTtcbiAgZWxba2V5XS5ieUlkID0gYWRkRFdyYXAoZG9tSGVscGVyLmJ5SWQsIGVsLCAxKTtcbiAgZWxba2V5XS5ieUNsYXNzID0gYWRkRFdyYXAoZG9tSGVscGVyLmJ5Q2xhc3MsIGVsLCAxKTtcbiAgcmV0dXJuIGVsO1xufTtcblxuXG4vKlxuXHRcblx0RE9NIGhlbHBlcnNcbiAqL1xuXG5kb21IZWxwZXIgPSBmdW5jdGlvbihzZWwsIGNvbnRleHQsIG9ubHlGaXJzdCkge1xuICB2YXIgX2VsLCBfcmVzdWx0cywgX3NlbCwgX3NlbHMsIHJlZjtcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIGNvbnRleHQgPSBkb2N1bWVudDtcbiAgfVxuICBpZiAob25seUZpcnN0ID09IG51bGwpIHtcbiAgICBvbmx5Rmlyc3QgPSBmYWxzZTtcbiAgfVxuICBfc2VscyA9IHNlbC5zcGxpdChcIiBcIik7XG4gIGlmIChfc2Vscy5ldmVyeSgoZnVuY3Rpb24oc2VsKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gKHJlZiA9IHNlbFswXSkgPT09IFwiLlwiIHx8IHJlZiA9PT0gXCIjXCI7XG4gIH0pKSkge1xuICAgIHdoaWxlIChfc2Vscy5sZW5ndGgpIHtcbiAgICAgIGlmICgoX3NlbCA9IChyZWYgPSBfc2Vscy5zcGxpY2UoMCwgMSkpICE9IG51bGwgPyByZWZbMF0gOiB2b2lkIDApKSB7XG4gICAgICAgIHN3aXRjaCAoX3NlbFswXSkge1xuICAgICAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgICAgICBjb250ZXh0ID0gZG9tSGVscGVyLmJ5Q2xhc3MoX3NlbCwgY29udGV4dCwgb25seUZpcnN0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgICAgICBjb250ZXh0ID0gZG9tSGVscGVyLmJ5SWQoX3NlbCwgY29udGV4dCwgb25seUZpcnN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuICBfcmVzdWx0cyA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWwpO1xuICBpZiAob25seUZpcnN0KSB7XG4gICAgcmV0dXJuIGFkZEQoX3Jlc3VsdHMgIT0gbnVsbCA/IF9yZXN1bHRzWzBdIDogdm9pZCAwKTtcbiAgfVxuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IF9yZXN1bHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBfZWwgPSBfcmVzdWx0c1tqXTtcbiAgICAgIHJlc3VsdHMucHVzaChhZGREKF9lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSkoKTtcbn07XG5cbmRvbUhlbHBlci5kb21lbCA9IGZ1bmN0aW9uKGVsKSB7XG4gIGlmIChlbCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGFkZEQoZWwpO1xuICB9XG59O1xuXG5kb21IZWxwZXIuY3JlYXRlID0gZnVuY3Rpb24odGFnLCBhdHRyaWJ1dGVzKSB7XG4gIHZhciBfZWwsIF9rLCBfdjtcbiAgaWYgKHRhZyA9PSBudWxsKSB7XG4gICAgdGFnID0gXCJESVZcIjtcbiAgfVxuICBpZiAoYXR0cmlidXRlcyA9PSBudWxsKSB7XG4gICAgYXR0cmlidXRlcyA9IHt9O1xuICB9XG4gIF9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgZm9yIChfayBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgX3YgPSBhdHRyaWJ1dGVzW19rXTtcbiAgICBfZWwuc2V0QXR0cmlidXRlKF9rLCBfdik7XG4gIH1cbiAgcmV0dXJuIGFkZEQoX2VsKTtcbn07XG5cbmRvbUhlbHBlci5kYXRhID0gZnVuY3Rpb24oZWwsIGtleSwgdmFsKSB7XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLmRhdGFzZXQgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGFkZEQoZWwpO1xuICB9XG4gIGlmICgoa2V5ICE9IG51bGwpICYmICh2YWwgIT0gbnVsbCkpIHtcbiAgICBlbC5kYXRhc2V0W2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm4gZWwuZGF0YXNldFtrZXldO1xuICB9XG4gIHJldHVybiBlbC5kYXRhc2V0O1xufTtcblxuZG9tSGVscGVyLmF0dHIgPSBmdW5jdGlvbihlbCwga2V5LCB2YWwpIHtcbiAgaWYgKChrZXkgIT0gbnVsbCkgJiYgKHZhbCAhPSBudWxsKSkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICBlbC5nZXRBdHRyaWJ1dGUoa2V5KTtcbiAgfVxuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuYnlDbGFzcyA9IGZ1bmN0aW9uKF9jbCwgY29udGV4dCwgb25seUZpcnN0KSB7XG4gIHZhciBfZWwsIF9yZXN1bHRzO1xuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgY29udGV4dCA9IGRvY3VtZW50O1xuICB9XG4gIGlmIChvbmx5Rmlyc3QgPT0gbnVsbCkge1xuICAgIG9ubHlGaXJzdCA9IGZhbHNlO1xuICB9XG4gIGlmIChfY2xbMF0gPT09IFwiLlwiKSB7XG4gICAgX2NsID0gX2NsLnNsaWNlKDEpO1xuICB9XG4gIF9yZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKF9jbCk7XG4gIGlmIChvbmx5Rmlyc3QpIHtcbiAgICByZXR1cm4gYWRkRChfcmVzdWx0cyAhPSBudWxsID8gX3Jlc3VsdHNbMF0gOiB2b2lkIDApO1xuICB9XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuID0gX3Jlc3VsdHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIF9lbCA9IF9yZXN1bHRzW2pdO1xuICAgICAgcmVzdWx0cy5wdXNoKGFkZEQoX2VsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9KSgpO1xufTtcblxuZG9tSGVscGVyLmJ5SWQgPSBmdW5jdGlvbihfaWQsIGNvbnRleHQpIHtcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIGNvbnRleHQgPSBkb2N1bWVudDtcbiAgfVxuICBpZiAoX2lkWzBdID09PSBcIiNcIikge1xuICAgIF9pZCA9IF9pZC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gYWRkRChjb250ZXh0LmdldEVsZW1lbnRCeUlkKF9pZCkpO1xufTtcblxuZG9tSGVscGVyLmxhc3QgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGlkeDtcbiAgaWR4ID0gZWwuY2hpbGROb2Rlcy5sZW5ndGggLSAxO1xuICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICBpZiAoZG9tSGVscGVyLmlzKGVsLmNoaWxkTm9kZXNbaWR4XSwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gYWRkRChlbC5jaGlsZE5vZGVzW2lkeF0pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlkeC0tO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZG9tSGVscGVyLnBhcmVudCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgX2N1cnNvcjtcbiAgaWYgKHNlbGVjdG9yID09IG51bGwpIHtcbiAgICByZXR1cm4gYWRkRChlbC5wYXJlbnROb2RlKTtcbiAgfVxuICBfY3Vyc29yID0gZWw7XG4gIHdoaWxlIChfY3Vyc29yLnBhcmVudE5vZGUgIT0gbnVsbCkge1xuICAgIF9jdXJzb3IgPSBfY3Vyc29yLnBhcmVudE5vZGU7XG4gICAgaWYgKGRvbUhlbHBlci5pcyhfY3Vyc29yLCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBhZGREKF9jdXJzb3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRvbUhlbHBlci5maXJzdCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgY2hpbGQsIGlkeCwgaiwgbGVuLCByZWY7XG4gIGlkeCA9IGVsLmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgcmVmID0gZWwuY2hpbGROb2RlcztcbiAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgY2hpbGQgPSByZWZbal07XG4gICAgaWYgKGRvbUhlbHBlci5pcyhjaGlsZCwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gYWRkRChjaGlsZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZG9tSGVscGVyLmNoaWxkcmVuID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBjaGlsZCwgY2hpbGRyZW4sIGlkeCwgaiwgbGVuLCByZWY7XG4gIGNoaWxkcmVuID0gW107XG4gIGlkeCA9IGVsLmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgcmVmID0gZWwuY2hpbGROb2RlcztcbiAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgY2hpbGQgPSByZWZbal07XG4gICAgaWYgKGRvbUhlbHBlci5pcyhjaGlsZCwgc2VsZWN0b3IpKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKGFkZEQoY2hpbGQpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoaWxkcmVuO1xufTtcblxuZG9tSGVscGVyLmNvdW50Q2hpbGRyZW4gPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGRvbUhlbHBlci5jaGlsZHJlbihlbCwgc2VsZWN0b3IpLmxlbmd0aDtcbn07XG5cbmRvbUhlbHBlci5pcyA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICBpZiAoc2VsZWN0b3JbMF0gPT09IFwiLlwiKSB7XG4gICAgcmV0dXJuIGRvbUhlbHBlci5oYXNDbGFzcyhlbCwgc2VsZWN0b3Iuc2xpY2UoMSkpO1xuICB9XG4gIGlmIChzZWxlY3RvclswXSA9PT0gXCIjXCIpIHtcbiAgICByZXR1cm4gZG9tSGVscGVyLmhhc0lkKGVsLCBzZWxlY3Rvci5zbGljZSgxKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZG9tSGVscGVyLmhhc0NsYXNzID0gZnVuY3Rpb24oZWwsIGNsYXNzbmFtZSkge1xuICB2YXIgcmVmO1xuICBpZiAoZWwuY2xhc3NMaXN0ICE9IG51bGwpIHtcbiAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzbmFtZSk7XG4gIH1cbiAgaWYgKChlbCAhPSBudWxsID8gZWwuY2xhc3NOYW1lIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpbmRleE9mLmNhbGwoKGVsICE9IG51bGwgPyAocmVmID0gZWwuY2xhc3NOYW1lKSAhPSBudWxsID8gcmVmLnNwbGl0KFwiIFwiKSA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgW10sIGNsYXNzbmFtZSkgPj0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmRvbUhlbHBlci5oaWRlID0gZnVuY3Rpb24oZWwpIHtcbiAgaWYgKChlbCAhPSBudWxsID8gZWwuc3R5bGUgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5zaG93ID0gZnVuY3Rpb24oZWwsIGRpc3BsYXkpIHtcbiAgaWYgKGRpc3BsYXkgPT0gbnVsbCkge1xuICAgIGRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIH1cbiAgaWYgKChlbCAhPSBudWxsID8gZWwuc3R5bGUgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBlbC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmFkZENsYXNzID0gZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NuYW1lKSB7XG4gIHZhciBfY2xhc3NuYW1lcztcbiAgaWYgKHRoaXMuaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NuYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBfY2xhc3NuYW1lcyA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuICBpZiAoIV9jbGFzc25hbWVzLmxlbmd0aCkge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NuYW1lO1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtZW50LmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzbmFtZTtcbiAgcmV0dXJuIGFkZEQoZWxlbWVudCk7XG59O1xuXG5kb21IZWxwZXIucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtZW50LCBjbGFzc25hbWUpIHtcbiAgdmFyIF9jbGFzc25hbWVzLCByeHA7XG4gIGlmICghdGhpcy5oYXNDbGFzcyhlbGVtZW50LCBjbGFzc25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9jbGFzc25hbWVzID0gZWxlbWVudC5jbGFzc05hbWU7XG4gIHJ4cCA9IG5ldyBSZWdFeHAoXCJcXFxccz9cXFxcYlwiICsgY2xhc3NuYW1lICsgXCJcXFxcYlwiLCBcImdcIik7XG4gIF9jbGFzc25hbWVzID0gX2NsYXNzbmFtZXMucmVwbGFjZShyeHAsIFwiXCIpO1xuICBlbGVtZW50LmNsYXNzTmFtZSA9IF9jbGFzc25hbWVzO1xuICByZXR1cm4gYWRkRChlbGVtZW50KTtcbn07XG5cbmRvbUhlbHBlci5oYXNJZCA9IGZ1bmN0aW9uKGVsLCBpZCkge1xuICBpZiAoKGVsICE9IG51bGwgPyBlbC5pZCA6IHZvaWQgMCkgPT09IGlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZG9tSGVscGVyLmFwcGVuZCA9IGZ1bmN0aW9uKGVsLCBodG1sKSB7XG4gIHZhciBfaGRpdiwgY2hpbGQsIGosIGssIGxlbiwgbGVuMSwgcmVmO1xuICBpZiAoaXNTdHJpbmcoaHRtbCkpIHtcbiAgICBfaGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF9oZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmVmID0gX2hkaXYuY2hpbGROb2RlcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGNoaWxkID0gcmVmW2pdO1xuICAgICAgaWYgKChjaGlsZCAhPSBudWxsID8gY2hpbGQudGFnTmFtZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGh0bWwgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbikge1xuICAgIGZvciAoayA9IDAsIGxlbjEgPSBodG1sLmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgY2hpbGQgPSBodG1sW2tdO1xuICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChodG1sIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIGVsLmFwcGVuZENoaWxkKGh0bWwpO1xuICB9XG4gIHJldHVybiBhZGREKGVsKTtcbn07XG5cbmRvbUhlbHBlci5wcmVwZW5kID0gZnVuY3Rpb24oZWwsIGh0bWwpIHtcbiAgdmFyIF9maXJzdENoLCBfaGRpdiwgX2xhdGVzdEZpcnN0LCBjaGlsZCwgaiwgcmVmLCByZWYxO1xuICBfZmlyc3RDaCA9IChyZWYgPSBlbC5jaGlsZE5vZGVzKSAhPSBudWxsID8gcmVmWzBdIDogdm9pZCAwO1xuICBpZiAoX2ZpcnN0Q2ggPT0gbnVsbCkge1xuICAgIGRvbUhlbHBlci5hcHBlbmQoZWwsIGh0bWwpO1xuICAgIHJldHVybjtcbiAgfVxuICBfaGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBfaGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICBfbGF0ZXN0Rmlyc3QgPSBfZmlyc3RDaDtcbiAgcmVmMSA9IF9oZGl2LmNoaWxkTm9kZXM7XG4gIGZvciAoaiA9IHJlZjEubGVuZ3RoIC0gMTsgaiA+PSAwOyBqICs9IC0xKSB7XG4gICAgY2hpbGQgPSByZWYxW2pdO1xuICAgIGlmICghKChjaGlsZCAhPSBudWxsID8gY2hpbGQudGFnTmFtZSA6IHZvaWQgMCkgIT0gbnVsbCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBlbC5pbnNlcnRCZWZvcmUoY2hpbGQsIF9sYXRlc3RGaXJzdCk7XG4gICAgX2xhdGVzdEZpcnN0ID0gY2hpbGQ7XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLnJlbW92ZSA9IGZ1bmN0aW9uKGVsKSB7XG4gIHZhciBpO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgZWwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbCk7XG4gIH1cbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIHtcbiAgICBpID0gZWwubGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAoZWxbaV0gJiYgZWxbaV0ucGFyZW50RWxlbWVudCkge1xuICAgICAgICBlbFtpXS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsW2ldKTtcbiAgICAgIH1cbiAgICAgIGktLTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLnJlcGxhY2VXaXRoID0gZnVuY3Rpb24oZWwsIGVsVG9SZXBsKSB7XG4gIGRvbUhlbHBlci5wYXJlbnQoZWwpLnJlcGxhY2VDaGlsZChlbFRvUmVwbCwgZWwpO1xuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuY2xvbmUgPSBmdW5jdGlvbihlbCkge1xuICByZXR1cm4gYWRkRChlbC5jbG9uZU5vZGUodHJ1ZSkpO1xufTtcblxuZG9tSGVscGVyLm9uID0gZnVuY3Rpb24oZWwsIHR5cGUsIGhhbmRsZXIpIHtcbiAgaWYgKGVsID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVsLmFkZEV2ZW50TGlzdGVuZXIgIT0gbnVsbCkge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKGVsLmF0dGFjaEV2ZW50ICE9IG51bGwpIHtcbiAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XG4gIH0gZWxzZSB7XG4gICAgZWxbJ29uJyArIHR5cGVdID0gaGFuZGxlcjtcbiAgfVxuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIub2ZmID0gZnVuY3Rpb24oZWwsIHR5cGUsIGhhbmRsZXIpIHtcbiAgaWYgKGVsID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIgIT0gbnVsbCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKGVsLmRldGFjaEV2ZW50ICE9IG51bGwpIHtcbiAgICBlbC5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGVsWydvbicgKyB0eXBlXTtcbiAgfVxuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuZW1pdCA9IGZ1bmN0aW9uKGVsLCB0eXBlKSB7XG4gIHZhciBldnQ7XG4gIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICBldnQuaW5pdEV2ZW50KHR5cGUsIHRydWUsIGZhbHNlKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChldnQpO1xuICByZXR1cm4gZXZ0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkb21IZWxwZXI7XG5cblxufSx7fV19LHt9LFsxXSkoMSlcbn0pOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIHdpbmRvdyA9IHJlcXVpcmUoXCJnbG9iYWwvd2luZG93XCIpXG52YXIgb25jZSA9IHJlcXVpcmUoXCJvbmNlXCIpXG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCJpcy1mdW5jdGlvblwiKVxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoXCJwYXJzZS1oZWFkZXJzXCIpXG52YXIgeHRlbmQgPSByZXF1aXJlKFwieHRlbmRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVYSFJcbmNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCBub29wXG5jcmVhdGVYSFIuWERvbWFpblJlcXVlc3QgPSBcIndpdGhDcmVkZW50aWFsc1wiIGluIChuZXcgY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0KCkpID8gY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0IDogd2luZG93LlhEb21haW5SZXF1ZXN0XG5cbmZvckVhY2hBcnJheShbXCJnZXRcIiwgXCJwdXRcIiwgXCJwb3N0XCIsIFwicGF0Y2hcIiwgXCJoZWFkXCIsIFwiZGVsZXRlXCJdLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBjcmVhdGVYSFJbbWV0aG9kID09PSBcImRlbGV0ZVwiID8gXCJkZWxcIiA6IG1ldGhvZF0gPSBmdW5jdGlvbih1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIG9wdGlvbnMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICAgICAgcmV0dXJuIF9jcmVhdGVYSFIob3B0aW9ucylcbiAgICB9XG59KVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRvcihhcnJheVtpXSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKXtcbiAgICBmb3IodmFyIGkgaW4gb2JqKXtcbiAgICAgICAgaWYob2JqLmhhc093blByb3BlcnR5KGkpKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHBhcmFtcyA9IHVyaVxuXG4gICAgaWYgKGlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zXG4gICAgICAgIGlmICh0eXBlb2YgdXJpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSB7dXJpOnVyaX1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcyA9IHh0ZW5kKG9wdGlvbnMsIHt1cmk6IHVyaX0pXG4gICAgfVxuXG4gICAgcGFyYW1zLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICByZXR1cm4gcGFyYW1zXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVhIUih1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgb3B0aW9ucyA9IGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaylcbiAgICByZXR1cm4gX2NyZWF0ZVhIUihvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlWEhSKG9wdGlvbnMpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrXG4gICAgaWYodHlwZW9mIGNhbGxiYWNrID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2FsbGJhY2sgYXJndW1lbnQgbWlzc2luZ1wiKVxuICAgIH1cbiAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spXG5cbiAgICBmdW5jdGlvbiByZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIGxvYWRGdW5jKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICAgIC8vIENocm9tZSB3aXRoIHJlcXVlc3RUeXBlPWJsb2IgdGhyb3dzIGVycm9ycyBhcnJvdW5kIHdoZW4gZXZlbiB0ZXN0aW5nIGFjY2VzcyB0byByZXNwb25zZVRleHRcbiAgICAgICAgdmFyIGJvZHkgPSB1bmRlZmluZWRcblxuICAgICAgICBpZiAoeGhyLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlXG4gICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgIXhoci5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VUZXh0IHx8IHhoci5yZXNwb25zZVhNTFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSnNvbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib2R5XG4gICAgfVxuXG4gICAgdmFyIGZhaWx1cmVSZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBib2R5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaSxcbiAgICAgICAgICAgICAgICByYXdSZXF1ZXN0OiB4aHJcbiAgICAgICAgICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yRnVuYyhldnQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICAgICAgaWYoIShldnQgaW5zdGFuY2VvZiBFcnJvcikpe1xuICAgICAgICAgICAgZXZ0ID0gbmV3IEVycm9yKFwiXCIgKyAoZXZ0IHx8IFwiVW5rbm93biBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKSApXG4gICAgICAgIH1cbiAgICAgICAgZXZ0LnN0YXR1c0NvZGUgPSAwXG4gICAgICAgIGNhbGxiYWNrKGV2dCwgZmFpbHVyZVJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSAmIHByb2Nlc3MgdGhlIHJlc3BvbnNlIGluIGEgc3BlY2lhbCByZXNwb25zZSBvYmplY3RcbiAgICBmdW5jdGlvbiBsb2FkRnVuYygpIHtcbiAgICAgICAgaWYgKGFib3J0ZWQpIHJldHVyblxuICAgICAgICB2YXIgc3RhdHVzXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKG9wdGlvbnMudXNlWERSICYmIHhoci5zdGF0dXM9PT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vSUU4IENPUlMgR0VUIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgZG9lc24ndCBoYXZlIGEgc3RhdHVzIGZpZWxkLCBidXQgYm9keSBpcyBmaW5lXG4gICAgICAgICAgICBzdGF0dXMgPSAyMDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICh4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cylcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBmYWlsdXJlUmVzcG9uc2VcbiAgICAgICAgdmFyIGVyciA9IG51bGxcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSAwKXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IGdldEJvZHkoKSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKXsgLy9yZW1lbWJlciB4aHIgY2FuIGluIGZhY3QgYmUgWERSIGZvciBDT1JTIGluIElFXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnIgPSBuZXcgRXJyb3IoXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXG5cbiAgICB9XG5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgfHwgbnVsbFxuXG4gICAgaWYgKCF4aHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29ycyB8fCBvcHRpb25zLnVzZVhEUikge1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YRG9tYWluUmVxdWVzdCgpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5XG4gICAgdmFyIGFib3J0ZWRcbiAgICB2YXIgdXJpID0geGhyLnVybCA9IG9wdGlvbnMudXJpIHx8IG9wdGlvbnMudXJsXG4gICAgdmFyIG1ldGhvZCA9IHhoci5tZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCBcIkdFVFwiXG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHkgfHwgb3B0aW9ucy5kYXRhIHx8IG51bGxcbiAgICB2YXIgaGVhZGVycyA9IHhoci5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9XG4gICAgdmFyIHN5bmMgPSAhIW9wdGlvbnMuc3luY1xuICAgIHZhciBpc0pzb24gPSBmYWxzZVxuICAgIHZhciB0aW1lb3V0VGltZXJcblxuICAgIGlmIChcImpzb25cIiBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlzSnNvbiA9IHRydWVcbiAgICAgICAgaGVhZGVyc1tcImFjY2VwdFwiXSB8fCBoZWFkZXJzW1wiQWNjZXB0XCJdIHx8IChoZWFkZXJzW1wiQWNjZXB0XCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCIpIC8vRG9uJ3Qgb3ZlcnJpZGUgZXhpc3RpbmcgYWNjZXB0IGhlYWRlciBkZWNsYXJlZCBieSB1c2VyXG4gICAgICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIgJiYgbWV0aG9kICE9PSBcIkhFQURcIikge1xuICAgICAgICAgICAgaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSB8fCBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdIHx8IChoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCIpIC8vRG9uJ3Qgb3ZlcnJpZGUgZXhpc3RpbmcgYWNjZXB0IGhlYWRlciBkZWNsYXJlZCBieSB1c2VyXG4gICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5qc29uKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5c3RhdGVjaGFuZ2VcbiAgICB4aHIub25sb2FkID0gbG9hZEZ1bmNcbiAgICB4aHIub25lcnJvciA9IGVycm9yRnVuY1xuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIElFIG11c3QgZGllXG4gICAgfVxuICAgIHhoci5vbnRpbWVvdXQgPSBlcnJvckZ1bmNcbiAgICB4aHIub3BlbihtZXRob2QsIHVyaSwgIXN5bmMsIG9wdGlvbnMudXNlcm5hbWUsIG9wdGlvbnMucGFzc3dvcmQpXG4gICAgLy9oYXMgdG8gYmUgYWZ0ZXIgb3BlblxuICAgIGlmKCFzeW5jKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdGlvbnMud2l0aENyZWRlbnRpYWxzXG4gICAgfVxuICAgIC8vIENhbm5vdCBzZXQgdGltZW91dCB3aXRoIHN5bmMgcmVxdWVzdFxuICAgIC8vIG5vdCBzZXR0aW5nIHRpbWVvdXQgb24gdGhlIHhociBvYmplY3QsIGJlY2F1c2Ugb2Ygb2xkIHdlYmtpdHMgZXRjLiBub3QgaGFuZGxpbmcgdGhhdCBjb3JyZWN0bHlcbiAgICAvLyBib3RoIG5wbSdzIHJlcXVlc3QgYW5kIGpxdWVyeSAxLnggdXNlIHRoaXMga2luZCBvZiB0aW1lb3V0LCBzbyB0aGlzIGlzIGJlaW5nIGNvbnNpc3RlbnRcbiAgICBpZiAoIXN5bmMgJiYgb3B0aW9ucy50aW1lb3V0ID4gMCApIHtcbiAgICAgICAgdGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWJvcnRlZD10cnVlLy9JRTkgbWF5IHN0aWxsIGNhbGwgcmVhZHlzdGF0ZWNoYW5nZVxuICAgICAgICAgICAgeGhyLmFib3J0KFwidGltZW91dFwiKVxuICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoXCJYTUxIdHRwUmVxdWVzdCB0aW1lb3V0XCIpXG4gICAgICAgICAgICBlLmNvZGUgPSBcIkVUSU1FRE9VVFwiXG4gICAgICAgICAgICBlcnJvckZ1bmMoZSlcbiAgICAgICAgfSwgb3B0aW9ucy50aW1lb3V0IClcbiAgICB9XG5cbiAgICBpZiAoeGhyLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgICAgZm9yKGtleSBpbiBoZWFkZXJzKXtcbiAgICAgICAgICAgIGlmKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaGVhZGVycyAmJiAhaXNFbXB0eShvcHRpb25zLmhlYWRlcnMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhlYWRlcnMgY2Fubm90IGJlIHNldCBvbiBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3RcIilcbiAgICB9XG5cbiAgICBpZiAoXCJyZXNwb25zZVR5cGVcIiBpbiBvcHRpb25zKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZVxuICAgIH1cblxuICAgIGlmIChcImJlZm9yZVNlbmRcIiBpbiBvcHRpb25zICYmXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLmJlZm9yZVNlbmQgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVNlbmQoeGhyKVxuICAgIH1cblxuICAgIHhoci5zZW5kKGJvZHkpXG5cbiAgICByZXR1cm4geGhyXG5cblxufVxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsImlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvblxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZuKSB7XG4gIHZhciBzdHJpbmcgPSB0b1N0cmluZy5jYWxsKGZuKVxuICByZXR1cm4gc3RyaW5nID09PSAnW29iamVjdCBGdW5jdGlvbl0nIHx8XG4gICAgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiBzdHJpbmcgIT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB8fFxuICAgICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAvLyBJRTggYW5kIGJlbG93XG4gICAgIChmbiA9PT0gd2luZG93LnNldFRpbWVvdXQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuYWxlcnQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuY29uZmlybSB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5wcm9tcHQpKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gb25jZVxuXG5vbmNlLnByb3RvID0gb25jZShmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdvbmNlJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb25jZSh0aGlzKVxuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59KVxuXG5mdW5jdGlvbiBvbmNlIChmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSByZXR1cm5cbiAgICBjYWxsZWQgPSB0cnVlXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxufVxuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdpcy1mdW5jdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaFxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG5cbmZ1bmN0aW9uIGZvckVhY2gobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oaXRlcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzXG4gICAgfVxuICAgIFxuICAgIGlmICh0b1N0cmluZy5jYWxsKGxpc3QpID09PSAnW29iamVjdCBBcnJheV0nKVxuICAgICAgICBmb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZSBpZiAodHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnKVxuICAgICAgICBmb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2VcbiAgICAgICAgZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgaSkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoU3RyaW5nKHN0cmluZywgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIC8vIG5vIHN1Y2ggdGhpbmcgYXMgYSBzcGFyc2Ugc3RyaW5nLlxuICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHN0cmluZy5jaGFyQXQoaSksIGksIHN0cmluZylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hPYmplY3Qob2JqZWN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGsgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgaykpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRyaW07XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59XG5cbmV4cG9ydHMubGVmdCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn07XG4iLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJ3RyaW0nKVxuICAsIGZvckVhY2ggPSByZXF1aXJlKCdmb3ItZWFjaCcpXG4gICwgaXNBcnJheSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICBpZiAoIWhlYWRlcnMpXG4gICAgcmV0dXJuIHt9XG5cbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgZm9yRWFjaChcbiAgICAgIHRyaW0oaGVhZGVycykuc3BsaXQoJ1xcbicpXG4gICAgLCBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHJvdy5pbmRleE9mKCc6JylcbiAgICAgICAgICAsIGtleSA9IHRyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICwgdmFsdWUgPSB0cmltKHJvdy5zbGljZShpbmRleCArIDEpKVxuXG4gICAgICAgIGlmICh0eXBlb2YocmVzdWx0W2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHJlc3VsdFtrZXldKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBbIHJlc3VsdFtrZXldLCB2YWx1ZSBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgKVxuXG4gIHJldHVybiByZXN1bHRcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
