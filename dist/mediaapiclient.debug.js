/*
 * Media-API-Client 1.3.0 ( 2016-02-24 )
 * https://github.com/mpneuried/media-api-client/tree/1.3.0
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
    var files, ref, ref1, ref2, ref3, ref4, ref5;
    evnt.preventDefault();
    if (!this.enabled) {
      return;
    }
    if (this.options.maxcount <= 0 || this.idx_started < this.options.maxcount) {
      this.el.d.removeClass(this.options.csshover);
      this.el.d.addClass(this.options.cssprocess);
      files = ((ref = evnt.target) != null ? ref.files : void 0) || ((ref1 = evnt.originalEvent) != null ? (ref2 = ref1.target) != null ? ref2.files : void 0 : void 0) || ((ref3 = evnt.dataTransfer) != null ? ref3.files : void 0) || ((ref4 = evnt.originalEvent) != null ? (ref5 = ref4.dataTransfer) != null ? ref5.files : void 0 : void 0);
      this.upload(files);
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
        console.error("get sign error", err);
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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

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
    var m;
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
  } else {
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

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWF0aGlhc3BldGVyL3Byb2plY3RzL21lZGlhLWFwaS1jbGllbnQvX3NyYy9saWIvYmFzZS5jb2ZmZWUiLCIvVXNlcnMvbWF0aGlhc3BldGVyL3Byb2plY3RzL21lZGlhLWFwaS1jbGllbnQvX3NyYy9saWIvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvcHJvamVjdHMvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9maWxlLmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvcHJvamVjdHMvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9maWxldmlldy5jb2ZmZWUiLCIvVXNlcnMvbWF0aGlhc3BldGVyL3Byb2plY3RzL21lZGlhLWFwaS1jbGllbnQvX3NyYy9saWIvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvbWF0aGlhc3BldGVyL3Byb2plY3RzL21lZGlhLWFwaS1jbGllbnQvX3NyYy9saWIvdXRpbHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2RvbWVsL2xpYi9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMveGhyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIm5vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMveHRlbmQvaW1tdXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxJQUFBO0VBQUE7Ozs7QUFBTTs7Ozs7Ozs7aUJBQ0wsTUFBQSxHQUFRLFNBQUUsRUFBRixFQUFNLEdBQU4sRUFBVyxJQUFYO0FBQ1AsUUFBQTtJQUFBLElBQUcsQ0FBSSxDQUFFLEdBQUEsWUFBZSxLQUFqQixDQUFQO01BQ0MsSUFBQSxHQUFXLElBQUEsS0FBQSxDQUFPLEdBQVA7TUFDWCxJQUFJLENBQUMsSUFBTCxHQUFZO0FBQ1o7UUFDQyxJQUFJLENBQUMsT0FBTCxHQUFlLElBQUMsQ0FBQSxNQUFRLENBQUEsR0FBQSxDQUFULElBQWtCLE1BRGxDO09BQUEscUJBSEQ7S0FBQSxNQUFBO01BTUMsSUFBQSxHQUFPLElBTlI7O0lBUUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFZLE9BQVosQ0FBcUIsQ0FBQyxNQUF6QjtNQUNDLElBQUMsQ0FBQSxJQUFELENBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUREO0tBQUEsTUFBQTtNQUdDLE9BQU8sQ0FBQyxLQUFSLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUhEOztJQUtBLElBQU8sVUFBUDtBQUNDLFlBQU0sS0FEUDtLQUFBLE1BQUE7TUFHQyxFQUFBLENBQUksSUFBSixFQUhEOztFQWRPOzs7O0dBRFUsT0FBQSxDQUFRLFFBQVI7O0FBcUJuQixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ3JCakIsSUFBQSw4RUFBQTtFQUFBOzs7OztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVMsT0FBVDs7QUFDTixHQUFBLEdBQU0s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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBCYXNlIGV4dGVuZHMgcmVxdWlyZSgnZXZlbnRzJylcblx0X2Vycm9yOiAoIGNiLCBlcnIsIGRhdGEgKT0+XG5cdFx0aWYgbm90ICggZXJyIGluc3RhbmNlb2YgRXJyb3IgKVxuXHRcdFx0X2VyciA9IG5ldyBFcnJvciggZXJyIClcblx0XHRcdF9lcnIubmFtZSA9IGVyclxuXHRcdFx0dHJ5XG5cdFx0XHRcdF9lcnIubWVzc2FnZSA9IEBFUlJPUlNbIGVyciBdIG9yIFwiIC0gXCJcblx0XHRlbHNlXG5cdFx0XHRfZXJyID0gZXJyXG5cblx0XHRpZiBAbGlzdGVuZXJzKCBcImVycm9yXCIgKS5sZW5ndGhcblx0XHRcdEBlbWl0KCBcImVycm9yXCIsIF9lcnIsIGRhdGEgKVxuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IoIF9lcnIsIGRhdGEgKVxuXG5cdFx0aWYgbm90IGNiP1xuXHRcdFx0dGhyb3cgX2VyclxuXHRcdGVsc2Vcblx0XHRcdGNiKCBfZXJyIClcblx0XHRyZXR1cm5cblx0XHRcbm1vZHVsZS5leHBvcnRzID0gQmFzZVxuIiwiZG9tID0gcmVxdWlyZSggXCJkb21lbFwiIClcbnhociA9IHJlcXVpcmUoIFwieGhyXCIgKVxuXG51dGlscyA9IHJlcXVpcmUoIFwiLi91dGlsc1wiIClcbkJhc2UgPSByZXF1aXJlKCBcIi4vYmFzZVwiIClcbkZpbGUgPSByZXF1aXJlKCBcIi4vZmlsZVwiIClcbkZpbGVWaWV3ID0gcmVxdWlyZSggXCIuL2ZpbGV2aWV3XCIgKVxuXG5fZGVmYXVsdHMgPVxuXHRob3N0OiBudWxsXG5cdGRvbWFpbjogbnVsbFxuXHRhY2Nlc3NrZXk6IG51bGxcblx0a2V5cHJlZml4OiBcImNsaWVudHVwbG9hZFwiXG5cdGF1dG9zdGFydDogdHJ1ZVxuXHRyZXF1ZXN0U2lnbkZuOiBudWxsXG5cdHJlc3VsdFRlbXBsYXRlRm46IG51bGxcblx0bWF4c2l6ZTogMFxuXHRtYXhjb3VudDogMFxuXHR3aWR0aDogbnVsbFxuXHRoZWlnaHQ6IG51bGxcblx0YWNjZXB0OiBudWxsXG5cdHR0bDogMFxuXHRhY2w6IFwicHVibGljLXJlYWRcIlxuXHRwcm9wZXJ0aWVzOiBudWxsXG5cdHRhZ3M6IG51bGxcblx0XCJjb250ZW50LWRpc3Bvc2l0aW9uXCI6IG51bGxcblx0Y3NzZHJvcHBhYmxlOiBcImRyb3BhYmxlXCJcblx0Y3NzaG92ZXI6IFwiaG92ZXJcIlxuXHRjc3Nwcm9jZXNzOiBcInByb2Nlc3NcIlxuXHRjc3NkaXNhYmxlZDogXCJkaXNhYmxlZFwiXG5cbl9kZWZhdWt0S2V5cyA9IGZvciBfaywgX3Ygb2YgX2RlZmF1bHRzXG5cdF9rXG5cbmNsYXNzIENsaWVudCBleHRlbmRzIEJhc2Vcblx0dmVyc2lvbjogXCJAQHZlcnNpb25cIlxuXG5cdF9yZ3hIb3N0OiAvaHR0cHM/OlxcL1xcL1teXFwvJFxcc10rL2lcblxuXHRjb25zdHJ1Y3RvcjogKCBkcmFnLCBlbHJlc3VsdHMsIG9wdGlvbnMgPSB7fSApLT5cblx0XHRzdXBlclxuXHRcdFxuXHRcdEBlbmFibGVkID0gdHJ1ZVxuXHRcdEB1c2VGaWxlQVBJID0gZmFsc2Vcblx0XHRcblx0XHRAb24oIFwiZmlsZS5uZXdcIiwgQGZpbGVOZXcgKVxuXG5cdFx0QG9uKCBcImZpbGUuZG9uZVwiLCBAZmlsZURvbmUgKVxuXHRcdEBvbiggXCJmaWxlLmVycm9yXCIsIEBmaWxlRXJyb3IgKVxuXHRcdEBvbiggXCJmaWxlLmludmFsaWRcIiwgQGZpbGVFcnJvciApXG5cdFx0QG9uKCBcImZpbGUuYWJvcnRlZFwiLCBAZmlsZUVycm9yIClcblx0XHRAb24oIFwiZmluaXNoXCIsIEBvbkZpbmlzaCApXG5cdFx0QHdpdGhpbl9lbnRlciA9IGZhbHNlXG5cblxuXHRcdEBlbCA9IEBfdmFsaWRhdGVFbCggZHJhZywgXCJkcmFnXCIgKVxuXHRcdEBzZWwgPSBAZWwuZC5maW5kKCBcImlucHV0I3sgb3B0aW9ucy5pbnB1dGNsYXNzIG9yIFwiXCIgfVt0eXBlPSdmaWxlJ11cIiwgdHJ1ZSApXG5cdFx0aWYgbm90IEBzZWw/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3Npbmctc2VsZWN0LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRAZm9ybW5hbWUgPSBAc2VsLmdldEF0dHJpYnV0ZSggXCJuYW1lXCIgKVxuXG5cdFx0aWYgZWxyZXN1bHRzP1xuXHRcdFx0QHJlcyA9IEBfdmFsaWRhdGVFbCggZWxyZXN1bHRzLCBcInJlc3VsdFwiIClcblxuXG5cdFx0X2h0bWxEYXRhID0gQGVsLmQuZGF0YSgpXG5cdFx0QG9wdGlvbnMgPSB1dGlscy5hc3NpZ24oIHt9LCBfZGVmYXVsdHMsIF9odG1sRGF0YSwgb3B0aW9ucyBvciB7fSApXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuaG9zdD8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3NpbmctaG9zdFwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IEBfcmd4SG9zdC50ZXN0KCBAb3B0aW9ucy5ob3N0IClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC1ob3N0XCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuZG9tYWluPy5sZW5ndGhcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy1kb21haW5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5hY2Nlc3NrZXk/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJtaXNzaW5nLWFjY2Vzc2tleVwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQ/XG5cdFx0XHRfbXhjbnQgPSBwYXJzZUludCggQG9wdGlvbnMubWF4Y291bnQsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhjbnQgKVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9kZWZhdWx0cy5tYXhjb3VudFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9teGNudFxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgaXNudCAxXG5cdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJtdWx0aXBsZVwiLCBcIm11bHRpcGxlXCIgKVxuXG5cdFx0aWYgQG9wdGlvbnMubWF4c2l6ZT9cblx0XHRcdF9teHN6ID0gcGFyc2VJbnQoIEBvcHRpb25zLm1heHNpemUsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhzeiApXG5cdFx0XHRcdEBvcHRpb25zLm1heHNpemUgPSBfZGVmYXVsdHMubWF4c2l6ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhzaXplID0gX214c3pcblxuXHRcdGlmIEBvcHRpb25zLnJlcXVlc3RTaWduRm4/IGFuZCB0eXBlb2YgQG9wdGlvbnMucmVxdWVzdFNpZ25GbiBpc250IFwiZnVuY3Rpb25cIlxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXJlcXVlc3RTaWduZm5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnR0bD8gYW5kIG5vdCB1dGlscy5pc0ludCggQG9wdGlvbnMudHRsIClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC10dGxcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlIGlmIEBvcHRpb25zLnR0bD9cblx0XHRcdEBvcHRpb25zLnR0bCA9IHBhcnNlSW50KCBAb3B0aW9ucy50dGwsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBAb3B0aW9ucy50dGwgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdHRsXCIgKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnRhZ3M/IGFuZCB1dGlscy5pc0FycmF5KCBAb3B0aW9ucy50YWdzIClcblx0XHRcdGZvciBfdGFnIGluIEBvcHRpb25zLnRhZ3Mgd2hlbiBub3QgdXRpbHMuaXNTdHJpbmcoIF90YWcgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdGFnc1wiIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0ZWxzZSBpZiBAb3B0aW9ucy50YWdzP1xuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXRhZ3NcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnByb3BlcnRpZXM/IGFuZCBub3QgdXRpbHMuaXNPYmplY3QoIEBvcHRpb25zLnByb3BlcnRpZXMgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXByb3BlcnRpZXNcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnF1YWxpdHk/IGFuZCAoIG5vdCB1dGlscy5pc0ludCggQG9wdGlvbnMucXVhbGl0eSApIG9yIEBvcHRpb25zLnF1YWxpdHkgPCAwIG9yIEBvcHRpb25zLnF1YWxpdHkgPiAxMDAgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXF1YWxpdHlcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSApXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtY29udGVudC1kaXNwb3NpdGlvblwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMuYWNsPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9ucy5hY2wgKSBhbmQgQG9wdGlvbnMuYWNsIG5vdCBpbiBbIFwicHVibGljLXJlYWRcIiwgXCJhdXRoZW50aWNhdGVkLXJlYWRcIiBdXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtYWNsXCIgKVxuXHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRpZiBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuPyBhbmQgdXRpbHMuaXNGdW5jdGlvbiggQG9wdGlvbnMucmVxdWVzdFNpZ25GbiApXG5cdFx0XHRAX3NpZ24gPSBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuXG5cdFx0ZWxzZVxuXHRcdFx0QF9zaWduID0gQF9kZWZhdWx0UmVxdWVzdFNpZ25hdHVyZVxuXG5cdFx0X2lucEFjY2VwdCA9IEBzZWwuZ2V0QXR0cmlidXRlKCBcImFjY2VwdFwiIClcblx0XHRpZiBAb3B0aW9ucy5hY2NlcHQ/IG9yIF9pbnBBY2NlcHQ/XG5cdFx0XHRfaHRtbCA9IF9pbnBBY2NlcHQ/LnNwbGl0KCBcIixcIiApIG9yIFtdXG5cdFx0XHRfb3B0ID0gQG9wdGlvbnMuYWNjZXB0Py5zcGxpdCggXCIsXCIgKSBvciBbXVxuXHRcdFx0aWYgX2h0bWw/Lmxlbmd0aFxuXHRcdFx0XHRAb3B0aW9ucy5hY2NlcHQgPSBfaHRtbFxuXHRcdFx0ZWxzZSBpZiBfb3B0Py5sZW5ndGhcblx0XHRcdFx0QHNlbC5zZXRBdHRyaWJ1dGUoIFwiYWNjZXB0XCIsIEBvcHRpb25zLmFjY2VwdCApXG5cdFx0XHRAb3B0aW9ucy5hY2NlcHRSdWxlcyA9IEBnZW5lcmF0ZUFjY2VwdFJ1bGVzKCBAb3B0aW9ucy5hY2NlcHQgKVxuXG5cdFx0QGluaXRpYWxpemUoKVxuXHRcdEBpZHhfc3RhcnRlZCA9IDBcblx0XHRAaWR4X2ZpbmlzaGVkID0gMFxuXHRcdEBjb3VudF9sYXN0X2ZpbmlzaGVkID0gMFxuXG5cdFx0QG9uIFwiZmlsZS51cGxvYWRcIiwgQGZpbGVTdGFydGVkXG5cblx0XHRAX2N1cnJlbnRQcm9ncmVzcyA9IHt9XG5cdFx0QG9uIFwiZmlsZS5wcm9ncmVzc1wiLCBAZmlsZVByb2dyZXNzXG5cblx0XHRAZWwuZC5kYXRhKCBcIm1lZGlhYXBpY2xpZW50XCIsIEAgKVxuXHRcdHJldHVyblxuXG5cdGdlbmVyYXRlQWNjZXB0UnVsZXM6ICggYWNjZXB0ICktPlxuXHRcdF9ydWxlcyA9IFtdXG5cblx0XHRmb3IgX3J1bGUgaW4gYWNjZXB0XG5cdFx0XHRpZiBfcnVsZS5pbmRleE9mKCBcIi9cIiApID49IDBcblx0XHRcdFx0X3J1bGVzLnB1c2ggKCAtPlxuXHRcdFx0XHRcdF9yZWdleCA9IG5ldyBSZWdFeHAoIFwiI3tfcnVsZS5yZXBsYWNlKCBcIipcIiwgXCJcXFxcdytcIiApfSRcIiwgXCJpXCIgKVxuXHRcdFx0XHRcdHJldHVybiAoIGZpbGUgKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3JlZ2V4LnRlc3QoIGZpbGUudHlwZSApXG5cdFx0XHRcdFx0KSgpXG5cdFx0XHRlbHNlIGlmIF9ydWxlLmluZGV4T2YoIFwiLlwiICkgPj0gMFxuXHRcdFx0XHRfcnVsZXMucHVzaCAoIC0+XG5cdFx0XHRcdFx0X3JlZ2V4ID0gbmV3IFJlZ0V4cCggXCIje19ydWxlLnJlcGxhY2UoIFwiLlwiLCBcIlxcXFwuXCIgKX0kXCIsIFwiaVwiIClcblx0XHRcdFx0XHRyZXR1cm4gKCBmaWxlICktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIF9yZWdleC50ZXN0KCBmaWxlLm5hbWUgKVxuXHRcdFx0XHRcdCkoKVxuXHRcdFx0ZWxzZSBpZiBfcnVsZSBpcyBcIipcIlxuXHRcdFx0XHRfcnVsZXMucHVzaCAoKCBmaWxlICktPiB0cnVlIClcblx0XHRyZXR1cm4gX3J1bGVzXG5cblx0aW5pdGlhbGl6ZTogPT5cblx0XHRpZiB3aW5kb3cuRmlsZSBhbmQgd2luZG93LkZpbGVMaXN0IGFuZCB3aW5kb3cuRmlsZVJlYWRlclxuXHRcdFx0QHNlbC5kLm9uKCBcImNoYW5nZVwiLCBAb25TZWxlY3QgKVxuXHRcdFx0QHVzZUZpbGVBUEkgPSB0cnVlXG5cdFx0XHRAaW5pdEZpbGVBUEkoKVxuXHRcdGVsc2Vcblx0XHRcdCMgVE9ETyBpbXBsZW1lbnQgSUU5IEZhbGxiYWNrXHRcdFxuXHRcdHJldHVyblxuXG5cdGluaXRGaWxlQVBJOiA9PlxuXHRcdF94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXHRcdFxuXHRcdGlmIF94aHI/LnVwbG9hZFxuXHRcdFx0QGVsLm9uZHJhZ292ZXIgPSBAb25Ib3ZlclxuXHRcdFx0QGVsLm9uZHJhZ2xlYXZlID0gQG9uTGVhdmVcblx0XHRcdEBlbC5vbmRyb3AgPSBAb25TZWxlY3Rcblx0XHRcdFxuXHRcdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc2Ryb3BwYWJsZSApXG5cdFx0ZWxzZVxuXHRcdHJldHVyblxuXG5cdG9uU2VsZWN0OiAoIGV2bnQgKT0+XG5cdFx0ZXZudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0aWYgbm90IEBlbmFibGVkXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBAb3B0aW9ucy5tYXhjb3VudCA8PSAwIG9yIEBpZHhfc3RhcnRlZCA8IEBvcHRpb25zLm1heGNvdW50XG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc3Byb2Nlc3MgKVxuXG5cdFx0XHRmaWxlcyA9IGV2bnQudGFyZ2V0Py5maWxlcyBvciBldm50Lm9yaWdpbmFsRXZlbnQ/LnRhcmdldD8uZmlsZXMgb3IgZXZudC5kYXRhVHJhbnNmZXI/LmZpbGVzIG9yIGV2bnQub3JpZ2luYWxFdmVudD8uZGF0YVRyYW5zZmVyPy5maWxlc1xuXHRcdFx0QHVwbG9hZCggZmlsZXMgKVxuXHRcdGVsc2Vcblx0XHRcdEBlbC5kLnJlbW92ZUNsYXNzKCBAb3B0aW9ucy5jc3Nob3ZlciApXG5cdFx0XHRAZGlzYWJsZSgpXG5cdFx0cmV0dXJuXG5cblx0b25Ib3ZlcjogKCBldm50ICk9PlxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0QGVtaXQoIFwiZmlsZS5ob3ZlclwiIClcblx0XHRAd2l0aGluX2VudGVyID0gdHJ1ZVxuXHRcdHNldFRpbWVvdXQoICggPT4gQHdpdGhpbl9lbnRlciA9IGZhbHNlICksIDApXG5cdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc2hvdmVyIClcblx0XHRyZXR1cm5cblxuXHRvbk92ZXI6ICggZXZudCApPT5cblx0XHRldm50LnByZXZlbnREZWZhdWx0KClcblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXG5cdG9uTGVhdmU6ICggZXZudCApPT5cblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBAd2l0aGluX2VudGVyXG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdHJldHVyblxuXG5cdHVwbG9hZDogKCBmaWxlcyApPT5cblx0XHRAc2V0TWF4TGlzdGVuZXJzKCBmaWxlcy5sZW5ndGggKSBpZiBmaWxlcy5sZW5ndGggPiAxMFxuXHRcdGlmIEB1c2VGaWxlQVBJXG5cdFx0XHRmb3IgZmlsZSwgaWR4IGluIGZpbGVzIHdoZW4gQGVuYWJsZWRcblx0XHRcdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPD0gMCBvciBAaWR4X3N0YXJ0ZWQgPCBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0XHRcdEBpZHhfc3RhcnRlZCsrXG5cdFx0XHRcdFx0bmV3IEZpbGUoIGZpbGUsIEBpZHhfc3RhcnRlZCwgQCwgQG9wdGlvbnMgKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXHRcblx0ZGVsZXRlRmlsZTogKCBrZXksIHJldiwgY2IgKT0+XG5cdFx0XG5cdFx0X3VybCA9IEBvcHRpb25zLmhvc3QgKyBAb3B0aW9ucy5kb21haW4gKyBcIi8je2tleX0/cmV2aXNpb249I3tyZXZ9XCJcblx0XHRcblx0XHRAc2lnbiB7IHVybDogX3VybCwga2V5OiBrZXkgfSwgKCBlcnIsIHN1cmwsIHNpZ25hdHVyZSApPT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0eGhyKCB7XG5cdFx0XHRcdHVybDogc3VybFxuXHRcdFx0XHRtZXRob2Q6IFwiREVMRVRFXCJcblx0XHRcdH0sICggZXJyLCByZXNwLCBib2R5ICk9PlxuXHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0Y2IoIG51bGwsIGJvZHkgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXHRcblx0c2lnbjogKCBvcHQsIGNiICk9PlxuXHRcdF9vcHQgPSB1dGlscy5hc3NpZ24oIHt9LCB7IGRvbWFpbjogQG9wdGlvbnMuZG9tYWluLCBhY2Nlc3NrZXk6IEBvcHRpb25zLmFjY2Vzc2tleSwganNvbjogbnVsbCwgdXJsOiBudWxsLCBrZXk6IG51bGwgfSwgb3B0IClcblx0XHRpZiBub3QgX29wdC51cmw/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggY2IsIFwiaW52YWxpZC1zaWduLXVybFwiIClcblx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBfb3B0LmtleT8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBjYiwgXCJpbnZhbGlkLXNpZ24ta2V5XCIgKVxuXHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRAX3NpZ24gX29wdC5kb21haW4sIF9vcHQuYWNjZXNza2V5LCBfb3B0LnVybCwgX29wdC5rZXksIF9vcHQuanNvbiwgKCBlcnIsIHNpZ25hdHVyZSApLT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRjYiggZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRfc3VybCA9IF9vcHQudXJsXG5cdFx0XHRpZiBfc3VybC5pbmRleE9mKCBcIj9cIiApID49IDBcblx0XHRcdFx0X3N1cmwgKz0gXCImXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0X3N1cmwgKz0gXCI/XCJcblx0XHRcdF9zdXJsICs9ICggXCJzaWduYXR1cmU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIHNpZ25hdHVyZSApIClcblx0XHRcdGNiKCBudWxsLCBfc3VybCwgc2lnbmF0dXJlIClcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXHRcdFxuXHRfZGVmYXVsdFJlcXVlc3RTaWduYXR1cmU6ICggZG9tYWluLCBhY2Nlc3NrZXksIG1hZGlhYXBpdXJsLCBrZXksIGpzb24sIGNiICk9PlxuXHRcdFxuXHRcdF91cmwgPSBAb3B0aW9ucy5ob3N0ICsgZG9tYWluICsgXCIvc2lnbi9cIiArIGFjY2Vzc2tleVxuXHRcdFxuXHRcdF94aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRcblx0XHRkYXRhID0gbmV3IEZvcm1EYXRhKClcblx0XHRkYXRhLmFwcGVuZCggXCJ1cmxcIiwgbWFkaWFhcGl1cmwgKVxuXHRcdGRhdGEuYXBwZW5kKCBcImtleVwiLCBrZXkgKVxuXHRcdGlmIGpzb24/XG5cdFx0XHRkYXRhLmFwcGVuZCggXCJqc29uXCIsIEpTT04uc3RyaW5naWZ5KCBqc29uICkgKVxuXHRcdHhocigge1xuXHRcdFx0eGhyOiBfeGhyXG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiXG5cdFx0XHR1cmw6IF91cmxcblx0XHRcdGJvZHk6IGRhdGFcblx0XHR9LCAoIGVyciwgcmVzcCwgc2lnbmF0dXJlICktPlxuXHRcdFx0aWYgZXJyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJnZXQgc2lnbiBlcnJvclwiLCBlcnJcblx0XHRcdFx0Y2IoIGVyciApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0Y2IoIG51bGwsIHNpZ25hdHVyZSApXG5cdFx0XHRyZXR1cm5cblx0XHQpXG5cdFx0cmV0dXJuXG5cblx0YWJvcnRBbGw6ID0+XG5cdFx0QGVtaXQgXCJhYm9ydEFsbFwiXG5cdFx0cmV0dXJuXG5cblx0ZGlzYWJsZTogPT5cblx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIgKVxuXHRcdEBlbC5kLmFkZENsYXNzKCBAb3B0aW9ucy5jc3NkaXNhYmxlZCApXG5cdFx0QGVuYWJsZWQgPSBmYWxzZVxuXHRcdHJldHVyblxuXG5cdGVuYWJsZTogPT5cblx0XHRAc2VsLnJlbW92ZUF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiIClcblx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzZGlzYWJsZWQgKVxuXHRcdEBlbmFibGVkID0gdHJ1ZVxuXHRcdHJldHVyblxuXG5cdGZpbGVOZXc6ICggZmlsZSApPT5cblx0XHRpZiBAcmVzP1xuXHRcdFx0X2ZpbGV2aWV3ID0gbmV3IEZpbGVWaWV3KCBmaWxlLCBALCBAb3B0aW9ucyApXG5cdFx0XHRAcmVzLmQuYXBwZW5kKCBfZmlsZXZpZXcucmVuZGVyKCkgKVxuXHRcdHJldHVyblxuXG5cdGZpbGVTdGFydGVkOiAoIGZpbGUgKT0+XG5cdFx0QF9jdXJyZW50UHJvZ3Jlc3NbIGZpbGUuaWR4IF0gPSAwXG5cdFx0aWYgQF9ydW5uaW5nXG5cdFx0XHRyZXR1cm5cblx0XHRAX3J1bm5pbmcgPSB0cnVlXG5cdFx0QGVtaXQoIFwic3RhcnRcIiApXG5cdFx0cmV0dXJuXG5cblx0ZmlsZVByb2dyZXNzOiAoIGZpbGUsIHByZWNlbnQgKT0+XG5cdFx0aWYgbm90IEBfY3VycmVudFByb2dyZXNzWyBmaWxlLmlkeCBdPyBvciBAX2N1cnJlbnRQcm9ncmVzc1sgZmlsZS5pZHggXSA+PSAwXG5cdFx0XHRAX2N1cnJlbnRQcm9ncmVzc1sgZmlsZS5pZHggXSA9IHByZWNlbnRcblxuXHRcdEBfY2FsY1Byb2dyZXNzKClcblx0XHRyZXR1cm5cblxuXHRmaWxlRXJyb3I6ICggZmlsZSwgZXJyICk9PlxuXHRcdGlmIEBsaXN0ZW5lcnMoIFwiZXJyb3JcIiApLmxlbmd0aFxuXHRcdFx0QGVtaXQoIFwiZXJyb3JcIiwgZXJyLCBmaWxlIClcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yIFwiRklMRS1FUlJPUlwiLCBmaWxlLCBlcnJcblx0XHRpZiBub3QgZmlsZS5fZXJyb3JlZFxuXHRcdFx0QF9jdXJyZW50UHJvZ3Jlc3NbIGZpbGUuaWR4IF0gPSAtMVxuXHRcdFx0QGlkeF9maW5pc2hlZCsrXG5cdFx0XHRAX2NoZWNrRmluaXNoKClcblx0XHRmaWxlLl9lcnJvcmVkID0gdHJ1ZVxuXG5cdFx0cmV0dXJuXG5cblx0ZmlsZURvbmU6ICggZmlsZSApPT5cblx0XHRAX2N1cnJlbnRQcm9ncmVzc1sgZmlsZS5pZHggXSA9IDEwMFxuXHRcdEBpZHhfZmluaXNoZWQrK1xuXHRcdEBfY2hlY2tGaW5pc2goKVxuXHRcdHJldHVyblxuXG5cdG9uRmluaXNoOiA9PlxuXHRcdEBlbC5kLnJlbW92ZUNsYXNzKCBAb3B0aW9ucy5jc3Nwcm9jZXNzIClcblx0XHRyZXR1cm5cblxuXHRfY2FsY1Byb2dyZXNzOiA9PlxuXHRcdF9ydW5uaW5nID0gMFxuXHRcdF93YWl0aW5nID0gMFxuXHRcdF9kb25lID0gMFxuXHRcdF9mYWlsZWQgPSAwXG5cdFx0X3ByZWNDdW11ID0gMFxuXHRcdF9jb3VudCA9IDBcblxuXHRcdGZvciBfaWR4LCBwcmVjIG9mIEBfY3VycmVudFByb2dyZXNzXG5cdFx0XHRfY291bnQrK1xuXHRcdFx0aWYgcHJlYyA8IDBcblx0XHRcdFx0X2ZhaWxlZCsrXG5cdFx0XHRcdF9wcmVjQ3VtdSArPSAxMDBcblx0XHRcdFx0Y29udGludWVcblx0XHRcdGlmIHByZWMgaXMgMFxuXHRcdFx0XHRfd2FpdGluZysrXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBwcmVjIDwgMTAwXG5cdFx0XHRcdF9ydW5uaW5nKytcblx0XHRcdFx0X3ByZWNDdW11ICs9IHByZWNcblx0XHRcdFx0Y29udGludWVcblx0XHRcdGlmIHByZWMgaXMgMTAwXG5cdFx0XHRcdF9kb25lKytcblx0XHRcdFx0X3ByZWNDdW11ICs9IDEwMFxuXG5cdFx0QGVtaXQoIFwicHJvZ3Jlc3NcIiwgX3ByZWNDdW11L19jb3VudCwgWyBfd2FpdGluZywgX3J1bm5pbmcsIF9kb25lLCBfZmFpbGVkIF0sIF9jb3VudCApXG5cdFx0cmV0dXJuXG5cblx0X2NoZWNrRmluaXNoOiA9PlxuXHRcdGlmIEBpZHhfZmluaXNoZWQgPj0gQGlkeF9zdGFydGVkXG5cdFx0XHRAX3J1bm5pbmcgPSBmYWxzZVxuXHRcdFx0QF9jdXJyZW50UHJvZ3Jlc3MgPSB7fVxuXHRcdFx0QGVtaXQoIFwiZmluaXNoXCIsIEBpZHhfZmluaXNoZWQgLSBAY291bnRfbGFzdF9maW5pc2hlZCApXG5cdFx0XHRAY291bnRfbGFzdF9maW5pc2hlZCA9IEBpZHhfZmluaXNoZWRcblx0XHRcdGlmIEBvcHRpb25zLm1heGNvdW50ID4gMCBhbmQgQGlkeF9zdGFydGVkID49IEBvcHRpb25zLm1heGNvdW50XG5cdFx0XHRcdEBkaXNhYmxlKClcblx0XHRyZXR1cm5cblxuXHRfdmFsaWRhdGVFbDogKCBlbCwgdHlwZSApPT5cblx0XHRpZiBub3QgZWw/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3NpbmctI3t0eXBlfS1lbFwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0c3dpdGNoIHR5cGVvZiBlbFxuXHRcdFx0d2hlbiBcInN0cmluZ1wiXG5cdFx0XHRcdF9lbCA9IGRvbSggZWwsIG51bGwsIHRydWUgKVxuXHRcdFx0d2hlbiBcIm9iamVjdFwiXG5cdFx0XHRcdGlmIGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRfZWwgPSBkb20uZG9tZWwoIGVsIClcblxuXHRcdGlmIG5vdCBfZWw/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtI3t0eXBlfS1lbFwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0cmV0dXJuIF9lbFxuXG5cdFxuXG5cdEVSUk9SUzpcblx0XHRcIm1pc3Npbmctc2VsZWN0LWVsXCI6IFwiTWlzc2luZyBzZWxlY3QgZWxlbWVudC4gUGxlYXNlIGRlZmluZSBhIHZhbGlkIGVsZW1lbnQgYXMgYSBTZWxlY3RvciwgRE9NLW5vZGVcIlxuXHRcdFwiaW52YWxpZC1zZWxlY3QtZWxcIjogXCJJbnZhbGlkIHNlbGVjdCBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJtaXNzaW5nLWRyYWctZWxcIjogXCJNaXNzaW5nIGRyYWcgZWxlbWVudC4gUGxlYXNlIGRlZmluZSBhIHZhbGlkIGVsZW1lbnQgYXMgYSBTZWxlY3RvciwgRE9NLW5vZGVcIlxuXHRcdFwiaW52YWxpZC1kcmFnLWVsXCI6IFwiSW52YWxpZCBkcmFnIGVsZW1lbnQuIFBsZWFzZSBkZWZpbmUgYSB2YWxpZCBlbGVtZW50IGFzIGEgU2VsZWN0b3IsIERPTS1ub2RlXCJcblx0XHRcIm1pc3NpbmctaG9zdFwiOiBcIk1pc3NpbmcgaG9zdC4gWW91IGhhdmUgdG8gZGVmaWVuIGEgaG9zdCBhcyB1cmwgc3RhcnRpbmcgd2l0aCBgaHR0cDovL2Agb3IgYGh0dHBzOi8vYC5cIlxuXHRcdFwiaW52YWxpZC1ob3N0XCI6IFwiSW52YWxpZCBob3N0LiBZb3UgaGF2ZSB0byBkZWZpZW4gYSBob3N0IGFzIHVybCBzdGFydGluZyB3aXRoIGBodHRwOi8vYCBvciBgaHR0cHM6Ly9gLlwiXG5cdFx0XCJtaXNzaW5nLWRvbWFpblwiOiBcIk1pc3NpbmcgZG9tYWluLiBZb3UgaGF2ZSB0byBkZWZpbmUgYSBkb21haW4uXCJcblx0XHRcIm1pc3NpbmctYWNjZXNza2V5XCI6IFwiTWlzc2luZyBhY2Nlc3NrZXkuIFlvdSBoYXZlIHRvIGRlZmluZSBhIGFjY2Vzc2tleS5cIlxuXHRcdFwibWlzc2luZy1rZXlwcmVmaXhcIjogXCJNaXNzaW5nIGtleXByZWZpeC4gWW91IGhhdmUgdG8gZGVmaW5lIGEga2V5cHJlZml4LlwiXG5cdFx0XCJpbnZhbGlkLXNpZ24tdXJsXCI6IFwicGxlYXNlIGRlZmluZSBhIGB1cmxgIHRvIHNpZ24gdGhlIHJlcXVlc3RcIlxuXHRcdFwiaW52YWxpZC1zaWduLWtleVwiOiBcInBsZWFzZSBkZWZpbmUgYSBga2V5YCB0byBzaWduIHRoZSByZXF1ZXN0XCJcblx0XHRcImludmFsaWQtdHRsXCI6IFwiZm9yIHRoZSBvcHRpb24gYHR0bGAgb25seSBhIHBvc2l0aXYgbnVtYmVyIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC10YWdzXCI6IFwiZm9yIHRoZSBvcHRpb24gYHRhZ3NgIG9ubHkgYW4gYXJyYXkgb2Ygc3RyaW5ncyBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtcHJvcGVydGllc1wiOiBcImZvciB0aGUgb3B0aW9uIGBwcm9wZXJ0aWVzYCBvbmx5IGFuIG9iamVjdCBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtY29udGVudC1kaXNwb3NpdGlvblwiOiBcImZvciB0aGUgb3B0aW9uIGBjb250ZW50LWRpc3Bvc2l0aW9uYCBvbmx5IGFuIHN0cmluZyBsaWtlOiBgYXR0YWNobWVudDsgZmlsZW5hbWU9ZnJpZW5kbHlfZmlsZW5hbWUucGRmYCBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtYWNsXCI6IFwidGhlIG9wdGlvbiBhY2wgb25seSBhY2NlcHRzIHRoZSBzdHJpbmcgYHB1YmxpYy1yZWFkYCBvciBgYXV0aGVudGljYXRlZC1yZWFkYFwiXG5cdFx0XCJpbnZhbGlkLXF1YWxpdHlcIjogXCJ0aGUgb3B0aW9uIHF1YWxpdHkgaGFzIHRvIGJlIGEgaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDEwMFwiXG5cbkNsaWVudC5kZWZhdWx0cyA9ICggb3B0aW9ucyApLT5cblx0Zm9yIF9rLCBfdiBvZiBvcHRpb25zIHdoZW4gX2sgaW4gX2RlZmF1a3RLZXlzXG5cdFx0X2RlZmF1bHRzWyBfayBdID0gX3Zcblx0cmV0dXJuIF9kZWZhdWx0c1xuXHRcbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50XG4iLCJ4aHIgPSByZXF1aXJlKCBcInhoclwiIClcblxuY2xhc3MgRmlsZSBleHRlbmRzIHJlcXVpcmUoXCIuL2Jhc2VcIilcblxuXHRzdGF0ZXM6IFsgXCJuZXdcIiwgXCJzdGFydFwiLCBcInNpZ25lZFwiLCBcInVwbG9hZFwiLCBcInByb2dyZXNzXCIsIFwiZG9uZVwiLCBcImludmFsaWRcIiwgXCJlcnJvclwiLCBcImFib3J0ZWRcIiBdXG5cblx0Y29uc3RydWN0b3I6ICggQGZpbGUsIEBpZHgsIEBjbGllbnQsIEBvcHRpb25zICktPlxuXHRcdHN1cGVyXG5cdFx0QHN0YXRlID0gMFxuXHRcdEB2YWxpZGF0aW9uID0gW11cblxuXHRcdEBrZXkgPSBAb3B0aW9ucy5rZXlwcmVmaXggKyBcIl9cIiArIEBnZXROYW1lKCkucmVwbGFjZSggQF9yZ3hGaWxlMktleSwgXCJcIiApICsgXCJfXCIgKyBAX25vdygpICsgXCJfXCIgKyBAaWR4XG5cblx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5uZXdcIiwgQCApXG5cdFx0QGNsaWVudC5vbiBcImFib3J0QWxsXCIsIEBhYm9ydFxuXG5cdFx0QG9uKCBcInN0YXJ0XCIsIEBzdGFydCApXG5cdFx0QG9uKCBcInNpZ25lZFwiLCBAX3VwbG9hZCApXG5cblx0XHRpZiBub3QgQG9wdGlvbnMua2V5cHJlZml4Py5sZW5ndGhcblx0XHRcdEBvcHRpb25zLmtleXByZWZpeCA9IFwiY2xpZW50dXBsb2FkXCJcblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5hdXRvc3RhcnQ/XG5cdFx0XHRAb3B0aW9ucy5hdXRvc3RhcnQgPSB0cnVlXG5cblx0XHRAX3ZhbGlkYXRlKClcblxuXHRcdGlmIEBvcHRpb25zLmF1dG9zdGFydFxuXHRcdFx0QGVtaXQgXCJzdGFydFwiXG5cdFx0cmV0dXJuXG5cblx0c3RhcnQ6ID0+XG5cdFx0aWYgQHN0YXRlIDw9IDBcblx0XHRcdEBfc2V0U3RhdGUoIDEgKVxuXHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUudXBsb2FkXCIsIEAgKVxuXHRcdFx0QF9zaWduKClcblx0XHRyZXR1cm4gQFxuXHRcblx0YWJvcnQ6ID0+XG5cdFx0aWYgQHN0YXRlIDw9IDRcblx0XHRcdEBfc2V0U3RhdGUoIDggKVxuXHRcdFx0QHJlcXVlc3RVcGxvYWQ/LmFib3J0KClcblx0XHRcdEBlbWl0IFwiYWJvcnRlZFwiXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5hYm9ydGVkXCIsIEAgKVxuXHRcdHJldHVybiBAXG5cdFxuXHRnZXRTdGF0ZTogPT5cblx0XHRyZXR1cm4gQHN0YXRlc1sgQHN0YXRlIF1cblxuXHRnZXRSZXN1bHQ6ID0+XG5cdFx0aWYgQHN0YXRlIGlzIDUgYW5kIEBkYXRhP1xuXHRcdFx0cmV0dXJuIHsgdXJsOiBAZGF0YS51cmwsIGhhc2g6IEBkYXRhLmZpbGVoYXNoLCBrZXk6IEBkYXRhLmtleSwgdHlwZTogQGRhdGEuY29udGVudF90eXBlIH1cblx0XHRyZXR1cm4gbnVsbFxuXG5cdGdldFByb2dyZXNzOiAoIGFzRmFjdG9yID0gZmFsc2UgKT0+XG5cdFx0aWYgQHN0YXRlIDwgNFxuXHRcdFx0X2ZhYyA9IDBcblx0XHRlbHNlIGlmIEBzdGF0ZSA+IDRcblx0XHRcdF9mYWMgPSAxXG5cdFx0ZWxzZVxuXHRcdFx0X2ZhYyA9IEBwcm9ncmVzc1N0YXRlXG5cblx0XHRpZiBhc0ZhY3RvclxuXHRcdFx0cmV0dXJuIF9mYWNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gTWF0aC5yb3VuZCggX2ZhYyAqIDEwMCApXG5cblx0Z2V0TmFtZTogPT5cblx0XHRyZXR1cm4gQGZpbGUubmFtZVxuXG5cdGdldFR5cGU6ID0+XG5cdFx0cmV0dXJuIEBmaWxlLnR5cGVcblxuXHRnZXREYXRhOiA9PlxuXHRcdF9yZXQgPVxuXHRcdFx0bmFtZTogQGNsaWVudC5mb3JtbmFtZVxuXHRcdFx0ZmlsZW5hbWU6IEBnZXROYW1lKClcblx0XHRcdGlkeDogQGlkeFxuXHRcdFx0c3RhdGU6IEBnZXRTdGF0ZSgpXG5cdFx0XHRwcm9ncmVzczogQGdldFByb2dyZXNzKClcblx0XHRcdHJlc3VsdDogQGdldFJlc3VsdCgpXG5cdFx0XHRvcHRpb25zOiBAb3B0aW9uc1xuXHRcdFx0aW52YWxpZF9yZWFzb246IEB2YWxpZGF0aW9uXG5cdFx0XHRlcnJvcjogQGVycm9yXG5cdFx0cmV0dXJuIF9yZXRcblxuXHRfc2V0U3RhdGU6ICggc3RhdGUgKT0+XG5cdFx0aWYgc3RhdGUgPiBAc3RhdGVcblx0XHRcdEBzdGF0ZSA9IHN0YXRlXG5cdFx0XHRAZW1pdCggXCJzdGF0ZVwiLCBAZ2V0U3RhdGUoKSApXG5cblx0XHQjIGRldGFjaCB0aGUgZmlsZSBmcm9tIHRoZSBjbGllbnRcblx0XHRpZiBAc3RhdGUgPj0gQHN0YXRlcy5pbmRleE9mKCBcImRvbmVcIiApXG5cdFx0XHRAY2xpZW50LnJlbW92ZUxpc3RlbmVyIFwiYWJvcnRBbGxcIiwgQGFib3J0XG5cdFx0cmV0dXJuIHN0YXRlXG5cblx0X3ZhbGlkYXRlOiA9PlxuXHRcdF9zaXplID0gQGZpbGUuc2l6ZSAvIDEwMjRcblx0XHRpZiBAb3B0aW9ucy5tYXhzaXplID4gMCBhbmQgQG9wdGlvbnMubWF4c2l6ZSA8IF9zaXplXG5cdFx0XHRAdmFsaWRhdGlvbi5wdXNoIFwibWF4c2l6ZVwiXG5cblx0XHRpZiBAb3B0aW9ucy5hY2NlcHRSdWxlcz8ubGVuZ3RoIGFuZCBub3QgQF90ZXN0TWltZSggQG9wdGlvbnMuYWNjZXB0UnVsZXMgKVxuXHRcdFx0QHZhbGlkYXRpb24ucHVzaCBcImFjY2VwdFwiXG5cblx0XHRpZiBAdmFsaWRhdGlvbi5sZW5ndGhcblx0XHRcdEBfc2V0U3RhdGUoIDYgKVxuXHRcdFx0QGVtaXQoIFwiaW52YWxpZFwiLCBAdmFsaWRhdGlvbiApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5pbnZhbGlkXCIsIEAsIEB2YWxpZGF0aW9uIClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiB0cnVlXG5cblx0X3Rlc3RNaW1lOiAoIGFjY2VwdFJ1bGVzICk9PlxuXHRcdGZvciBfcnVsZSBpbiBhY2NlcHRSdWxlc1xuXHRcdFx0aWYgX3J1bGUoIEBmaWxlIClcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRyZXR1cm4gZmFsc2VcblxuXHRfbm93OiAtPlxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCBEYXRlLm5vdygpIC8gMTAwMCApXG5cblx0X3JneEZpbGUyS2V5OiAvKFteQS1aYS16MC05XSkvaWdcblx0X3NpZ246ID0+XG5cdFx0X25hbWUgPSBAZ2V0TmFtZSgpXG5cdFx0X2NvbnRlbnRfdHlwZSA9IEBnZXRUeXBlKClcblx0XHRpZiBAc3RhdGUgPiAxXG5cdFx0XHRyZXR1cm5cblx0XHRAdXJsID0gQG9wdGlvbnMuaG9zdCArIEBvcHRpb25zLmRvbWFpbiArIFwiL1wiICsgQGtleVxuXHRcdEBqc29uID1cblx0XHRcdGJsb2I6IHRydWVcblx0XHRcdGFjbDogQG9wdGlvbnMuYWNsXG5cdFx0XHR0dGw6IEBvcHRpb25zLnR0bFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0ZmlsZW5hbWU6IF9uYW1lXG5cblx0XHRAanNvbi53aWR0aCA9IEBvcHRpb25zLndpZHRoIGlmIEBvcHRpb25zLndpZHRoP1xuXHRcdEBqc29uLmhlaWdodCA9IEBvcHRpb25zLmhlaWdodCBpZiBAb3B0aW9ucy5oZWlnaHQ/XG5cdFx0QGpzb24ucXVhbGl0eSA9IEBvcHRpb25zLnF1YWxpdHkgaWYgQG9wdGlvbnMucXVhbGl0eT9cblx0XHRcblx0XHRAanNvbi50YWdzID0gQG9wdGlvbnMudGFncyBpZiBAb3B0aW9ucy50YWdzP1xuXHRcdEBqc29uLnByb3BlcnRpZXMgPSBAb3B0aW9ucy5wcm9wZXJ0aWVzIGlmIEBvcHRpb25zLnByb3BlcnRpZXM/XG5cdFx0QGpzb25bIFwiY29udGVudC1kaXNwb3NpdGlvblwiIF0gPSBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSBpZiBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXT9cblxuXHRcdEBqc29uLmNvbnRlbnRfdHlwZSA9IF9jb250ZW50X3R5cGUgaWYgX2NvbnRlbnRfdHlwZT8ubGVuZ3RoXG5cblx0XHRAZW1pdCggXCJjb250ZW50XCIsIEBrZXksIEBqc29uIClcblx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5jb250ZW50XCIsIEAsIEBrZXksIEBqc29uIClcblx0XHRcblx0XHRAY2xpZW50LnNpZ24uY2FsbCBALCB7IHVybDogQHVybCwga2V5OiBAa2V5LCBqc29uOiBAanNvbiB9LCAoIGVyciwgQHVybCApPT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRAZXJyb3IgPSBlcnJcblx0XHRcdFx0QF9zZXRTdGF0ZSggNyApXG5cdFx0XHRcdEBlbWl0KCBcImVycm9yXCIsIGVyciApXG5cdFx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmVycm9yXCIsIEAsIGVyciApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcblx0XHRcdEBfc2V0U3RhdGUoIDIgKVxuXHRcdFx0QGVtaXQoIFwic2lnbmVkXCIgKVxuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuXG5cblx0X3VwbG9hZDogPT5cblx0XHRpZiBAc3RhdGUgPiAyXG5cdFx0XHRyZXR1cm5cblx0XHRAX3NldFN0YXRlKCAzIClcblx0XHRkYXRhID0gbmV3IEZvcm1EYXRhKClcblx0XHRkYXRhLmFwcGVuZCggXCJKU09OXCIsIEpTT04uc3RyaW5naWZ5KCBAanNvbiApIClcblx0XHRkYXRhLmFwcGVuZCggXCJibG9iXCIsIEBmaWxlIClcblx0XHRcblx0XHRfeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG5cdFx0X3hoci51cGxvYWQ/LmFkZEV2ZW50TGlzdGVuZXIoIFwicHJvZ3Jlc3NcIiwgQF9oYW5kbGVQcm9ncmVzcygpLCBmYWxzZSApXG5cdFx0X3hoci5hZGRFdmVudExpc3RlbmVyKCBcInByb2dyZXNzXCIsIEBfaGFuZGxlUHJvZ3Jlc3MoKSwgZmFsc2UgKVxuXHRcdF94aHIuX2lzZmlsZSA9IHRydWVcblx0XHRcblx0XHRAcmVxdWVzdFVwbG9hZCA9IHhocigge1xuXHRcdFx0eGhyOiBfeGhyXG5cdFx0XHR1cmw6IEB1cmxcblx0XHRcdG1ldGhvZDogXCJQT1NUXCJcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9LCAoIGVyciwgcmVzcCwgYm9keSApPT5cblx0XHRcdCNjb25zb2xlLmxvZyBcInJlcXVlc3RVcGxvYWRcIiwgZXJyLCByZXNwLCBib2R5XG5cdFx0XHRpZiBlcnJcblx0XHRcdFx0QF9zZXRTdGF0ZSggNyApXG5cdFx0XHRcdEBwcm9ncmVzc1N0YXRlID0gMFxuXHRcdFx0XHRAZXJyb3IgPSBlcnJcblx0XHRcdFx0QGVtaXQoIFwiZXJyb3JcIiwgZXJyIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0X2RhdGEgPSBKU09OLnBhcnNlKCBib2R5IClcblx0XHRcdGlmIHJlc3Auc3RhdHVzQ29kZSA+PSAzMDBcblx0XHRcdFx0QF9zZXRTdGF0ZSggNyApXG5cdFx0XHRcdEBwcm9ncmVzc1N0YXRlID0gMFxuXHRcdFx0XHRAZXJyb3IgPSBfZGF0YVxuXHRcdFx0XHRAZW1pdCggXCJlcnJvclwiLCBfZGF0YSApXG5cdFx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmVycm9yXCIsIEAsIF9kYXRhIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRcdEBkYXRhID0gX2RhdGE/LnJvd3NbIDAgXVxuXHRcdFx0QHByb2dyZXNzU3RhdGUgPSAxXG5cdFx0XHRAX3NldFN0YXRlKCA1IClcblx0XHRcdEBlbWl0KCBcImRvbmVcIiwgQGRhdGEgKVxuXHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZG9uZVwiLCBAIClcblx0XHRcdHJldHVyblxuXHRcdClcblx0XHRyZXR1cm5cblxuXHRfaGFuZGxlUHJvZ3Jlc3M6ID0+XG5cdFx0cmV0dXJuICggZXZudCApPT5cblx0XHRcdGlmIG5vdCBldm50LnRhcmdldC5tZXRob2Q/XG5cdFx0XHRcdEBwcm9ncmVzc1N0YXRlID0gZXZudC5sb2FkZWQvZXZudC50b3RhbFxuXHRcdFx0XHRAX3NldFN0YXRlKCA0IClcblx0XHRcdFx0X3Byb2dyZXNzID0gQGdldFByb2dyZXNzKClcblx0XHRcdFx0QGVtaXQoIFwicHJvZ3Jlc3NcIiwgX3Byb2dyZXNzLCBldm50IClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUucHJvZ3Jlc3NcIiwgQCwgX3Byb2dyZXNzIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZXR1cm5cblx0XHRcbm1vZHVsZS5leHBvcnRzID0gRmlsZVxuIiwiZG9tID0gcmVxdWlyZSggXCJkb21lbFwiIClcblxuY2xhc3MgRmlsZVZpZXcgZXh0ZW5kcyByZXF1aXJlKFwiLi9iYXNlXCIpXG5cdGNvbnN0cnVjdG9yOiAoIEBmaWxlT2JqLCBAY2xpZW50LCBAb3B0aW9ucyApLT5cblx0XHRzdXBlclxuXHRcdFxuXHRcdGlmIEBvcHRpb25zLnJlc3VsdFRlbXBsYXRlRm4/IGFuZCB0eXBlb2YgQG9wdGlvbnMucmVzdWx0VGVtcGxhdGVGbiBpcyBcImZ1bmN0aW9uXCJcblx0XHRcdEB0ZW1wbGF0ZSA9IEBvcHRpb25zLnJlc3VsdFRlbXBsYXRlRm5cblx0XHRlbHNlXG5cdFx0XHRAdGVtcGxhdGUgPSBAX2RlZmF1bHRUZW1wbGF0ZVxuXHRcdFxuXHRcdGlmIEBvcHRpb25zLmNzc2ZpbGVlbGVtZW50P1xuXHRcdFx0QHJlc3VsdENsYXNzID0gQG9wdGlvbnMuY3NzZmlsZWVsZW1lbnRcblx0XHRlbHNlXG5cdFx0XHRAcmVzdWx0Q2xhc3MgPSBcImZpbGUgY29sLXNtLTYgY29sLW1kLTRcIlxuXG5cdFx0QGZpbGVPYmoub24oIFwicHJvZ3Jlc3NcIiwgQHVwZGF0ZSgpIClcblx0XHRAZmlsZU9iai5vbiggXCJkb25lXCIsIEB1cGRhdGUoKSApXG5cdFx0QGZpbGVPYmoub24oIFwiZXJyb3JcIiwgQHVwZGF0ZSgpIClcblx0XHRAZmlsZU9iai5vbiggXCJpbnZhbGlkXCIsIEB1cGRhdGUoKSApXG5cdFx0cmV0dXJuXG5cblx0cmVuZGVyOiA9PlxuXHRcdEBlbCA9IGRvbS5jcmVhdGUoIFwiZGl2XCIsIHsgY2xhc3M6IEByZXN1bHRDbGFzcyB9IClcblx0XHRAZWwuaW5uZXJIVE1MID0gQHRlbXBsYXRlKCBAZmlsZU9iai5nZXREYXRhKCkgKVxuXHRcdHJldHVybiBAZWxcblxuXHR1cGRhdGU6ID0+XG5cdFx0cmV0dXJuICggZXZudCApPT5cblx0XHRcdEBlbC5pbm5lckhUTUwgPSBAdGVtcGxhdGUoIEBmaWxlT2JqLmdldERhdGEoKSApXG5cdFx0XHRyZXR1cm5cblxuXHRfZGVmYXVsdFRlbXBsYXRlOiAoIGRhdGEgKS0+XG5cdFx0X2h0bWwgPSBcIlwiXCJcblx0PGRpdiBjbGFzcz1cInRodW1ibmFpbCBzdGF0ZS0jeyBkYXRhLnN0YXRlIH1cIj5cblx0XHQ8Yj4jeyBkYXRhLmZpbGVuYW1lfTwvYj5cblx0XHRcIlwiXCJcblx0XHRzd2l0Y2ggZGF0YS5zdGF0ZVxuXHRcdFx0d2hlbiBcInByb2dyZXNzXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiI3tkYXRhLnByb2dyZXNzfVwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6ICN7ZGF0YS5wcm9ncmVzc30lO1wiPlxuXHRcdFx0XHRcdFx0PHNwYW4+I3tkYXRhLnByb2dyZXNzfSU8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdHdoZW4gXCJkb25lXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXN1bHRcIj5cblx0XHRcdFx0XHQ8YSBocmVmPVwiI3tkYXRhLnJlc3VsdC51cmx9XCIgdGFyZ2V0PVwiX25ld1wiPkZlcnRpZyEgKCAje2RhdGEucmVzdWx0LmtleX0gKTwvYT5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHRcdGZvciBfaywgX3Ygb2YgZGF0YS5yZXN1bHRcblx0XHRcdFx0XHRfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiN7ZGF0YS5uYW1lfV8jeyBkYXRhLmlkeCB9XyN7X2t9XCIgdmFsdWU9XCIje192fVwiPlxuXHRcdFx0XHRcdFwiXCJcIlxuXHRcdFx0XHRfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0d2hlbiBcImludmFsaWRcIlxuXHRcdFx0XHRfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJlc3VsdFwiPlxuXHRcdFx0XHRcdDxiPkludmFsaWQ8L2I+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0XHRmb3IgX3JlYXNvbiBpbiBkYXRhLmludmFsaWRfcmVhc29uXG5cdFx0XHRcdFx0c3dpdGNoIF9yZWFzb25cblx0XHRcdFx0XHRcdHdoZW4gXCJtYXhzaXplXCJcblx0XHRcdFx0XHRcdFx0X2h0bWwgKz0gXCI8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1lcnJvclxcXCI+RmlsZSB0b28gYmlnLiBPbmx5IGZpbGVzIHVudGlsICN7ZGF0YS5vcHRpb25zLm1heHNpemV9a2IgYXJlIGFsbG93ZWQuPC9kaXY+XCJcblx0XHRcdFx0XHRcdHdoZW4gXCJhY2NlcHRcIlxuXHRcdFx0XHRcdFx0XHRfaHRtbCArPSBcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWVycm9yXFxcIj5Xcm9uZyB0eXBlLiBPbmx5IGZpbGVzIG9mIHR5cGUgI3tkYXRhLm9wdGlvbnMuYWNjZXB0LmpvaW4oIFwiLCBcIiApfSBhcmUgYWxsb3dlZC48L2Rpdj5cIlxuXG5cdFx0XHRcdCBfaHRtbCArPSBcIlwiXCJcblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0d2hlbiBcImVycm9yXCJcblx0XHRcdFx0X2h0bWwgKz0gXCI8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1lcnJvclxcXCI+QW4gRXJyb3Igb2NjdXJlZC48L2Rpdj5cIlxuXG5cdFx0XHR3aGVuIFwiYWJvcnRlZFwiXG5cdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPlVwbG9hZCBhYm9ydGVkLjwvZGl2PlwiXG5cblx0XHRfaHRtbCArPSBcIlwiXCJcblx0PC9kaXY+XG5cdFx0XCJcIlwiXG5cdFx0cmV0dXJuIF9odG1sXG5cdFx0XG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVWaWV3XG4iLCJCYXNlID0gcmVxdWlyZSggXCIuL2Jhc2VcIiApXG5GaWxlID0gcmVxdWlyZSggXCIuL2ZpbGVcIiApXG5GaWxlVmlldyA9IHJlcXVpcmUoIFwiLi9maWxldmlld1wiIClcblxuQ2xpZW50ID0gcmVxdWlyZSggXCIuL2NsaWVudFwiIClcbkNsaWVudC5CYXNlID0gQmFzZVxuQ2xpZW50LkZpbGUgPSBGaWxlXG5DbGllbnQuRmlsZVZpZXcgPSBGaWxlVmlld1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudFxuIiwiaXNPYmplY3QgPSAoIHZyICktPlxuXHRyZXR1cm4gKCB2ciBpc250IG51bGwgYW5kIHR5cGVvZiB2ciBpcyAnb2JqZWN0JyApXG5cbmlzQXJyYXkgPSAoIHZyICktPlxuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2ciApIGlzICdbb2JqZWN0IEFycmF5XSdcblxuaXNTdHJpbmcgPSAoIHZyICktPlxuXHRyZXR1cm4gdHlwZW9mIHZyIGlzICdzdHJpbmcnIG9yIHZyIGluc3RhbmNlb2YgU3RyaW5nXG5cbl9pbnRSZWdleCA9IC9eXFxkKyQvXG5pc0ludCA9ICggdnIgKS0+XG5cdHJldHVybiBfaW50UmVnZXgudGVzdCggdnIgKVxuXG5pc0Z1bmN0aW9uID0gKCBvYmplY3QgKS0+XG5cdHJldHVybiB0eXBlb2Yob2JqZWN0KSBpcyAnZnVuY3Rpb24nXG5cbmFzc2lnbiA9ICggdGdydCwgc3Jjcy4uLiApLT5cblx0Zm9yIHNyYyBpbiBzcmNzXG5cdFx0aWYgaXNPYmplY3QoIHNyYyApXG5cdFx0XHRmb3IgX2ssIF92IG9mIHNyY1xuXHRcdFx0XHR0Z3J0WyBfayBdID0gX3Zcblx0cmV0dXJuIHRncnRcblx0XG5tb2R1bGUuZXhwb3J0cyA9XG5cdGlzQXJyYXk6IGlzQXJyYXlcblx0aXNPYmplY3Q6IGlzT2JqZWN0XG5cdGlzU3RyaW5nOiBpc1N0cmluZ1xuXHRpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uXG5cdGlzSW50OiBpc0ludFxuXHRhc3NpZ246IGFzc2lnblxuIiwiKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuZG9tZWwgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgYWRkRCwgYWRkRFdyYXAsIGRvbUhlbHBlciwgaXNTdHJpbmcsIG5vbkF1dG9BdHRhY2gsXG4gIHNsaWNlID0gW10uc2xpY2UsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuaXNTdHJpbmcgPSBmdW5jdGlvbih2cikge1xuICByZXR1cm4gdHlwZW9mIHZyID09PSAnc3RyaW5nJyB8fCB2ciBpbnN0YW5jZW9mIFN0cmluZztcbn07XG5cbm5vbkF1dG9BdHRhY2ggPSBbXCJkb21lbFwiLCBcImNyZWF0ZVwiLCBcImJ5Q2xhc3NcIiwgXCJieUlkXCJdO1xuXG5hZGREV3JhcCA9IGZ1bmN0aW9uKGZuLCBlbCwgZWxJZHgpIHtcbiAgaWYgKGVsSWR4ID09IG51bGwpIHtcbiAgICBlbElkeCA9IDA7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzO1xuICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICBhcmdzLnNwbGljZShlbElkeCwgMCwgZWwpO1xuICAgIHJldHVybiBmbi5hcHBseShkb21IZWxwZXIsIGFyZ3MpO1xuICB9O1xufTtcblxuYWRkRCA9IGZ1bmN0aW9uKGVsLCBrZXkpIHtcbiAgdmFyIGosIGxlbiwgbmFtZUZuLCByZWY7XG4gIGlmIChrZXkgPT0gbnVsbCkge1xuICAgIGtleSA9IFwiZFwiO1xuICB9XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG4gIGlmIChlbFtrZXldICE9IG51bGwpIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cbiAgZWxba2V5XSA9IHt9O1xuICByZWYgPSBPYmplY3Qua2V5cyhkb21IZWxwZXIpO1xuICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBuYW1lRm4gPSByZWZbal07XG4gICAgaWYgKGluZGV4T2YuY2FsbChub25BdXRvQXR0YWNoLCBuYW1lRm4pIDwgMCkge1xuICAgICAgZWxba2V5XVtuYW1lRm5dID0gYWRkRFdyYXAoZG9tSGVscGVyW25hbWVGbl0sIGVsKTtcbiAgICB9XG4gIH1cbiAgZWxba2V5XS5maW5kID0gYWRkRFdyYXAoZG9tSGVscGVyLCBlbCwgMSk7XG4gIGVsW2tleV0uYnlJZCA9IGFkZERXcmFwKGRvbUhlbHBlci5ieUlkLCBlbCwgMSk7XG4gIGVsW2tleV0uYnlDbGFzcyA9IGFkZERXcmFwKGRvbUhlbHBlci5ieUNsYXNzLCBlbCwgMSk7XG4gIHJldHVybiBlbDtcbn07XG5cblxuLypcblx0XG5cdERPTSBoZWxwZXJzXG4gKi9cblxuZG9tSGVscGVyID0gZnVuY3Rpb24oc2VsLCBjb250ZXh0LCBvbmx5Rmlyc3QpIHtcbiAgdmFyIF9lbCwgX3Jlc3VsdHMsIF9zZWwsIF9zZWxzLCByZWY7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cbiAgaWYgKG9ubHlGaXJzdCA9PSBudWxsKSB7XG4gICAgb25seUZpcnN0ID0gZmFsc2U7XG4gIH1cbiAgX3NlbHMgPSBzZWwuc3BsaXQoXCIgXCIpO1xuICBpZiAoX3NlbHMuZXZlcnkoKGZ1bmN0aW9uKHNlbCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIChyZWYgPSBzZWxbMF0pID09PSBcIi5cIiB8fCByZWYgPT09IFwiI1wiO1xuICB9KSkpIHtcbiAgICB3aGlsZSAoX3NlbHMubGVuZ3RoKSB7XG4gICAgICBpZiAoKF9zZWwgPSAocmVmID0gX3NlbHMuc3BsaWNlKDAsIDEpKSAhPSBudWxsID8gcmVmWzBdIDogdm9pZCAwKSkge1xuICAgICAgICBzd2l0Y2ggKF9zZWxbMF0pIHtcbiAgICAgICAgICBjYXNlIFwiLlwiOlxuICAgICAgICAgICAgY29udGV4dCA9IGRvbUhlbHBlci5ieUNsYXNzKF9zZWwsIGNvbnRleHQsIG9ubHlGaXJzdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiI1wiOlxuICAgICAgICAgICAgY29udGV4dCA9IGRvbUhlbHBlci5ieUlkKF9zZWwsIGNvbnRleHQsIG9ubHlGaXJzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbiAgX3Jlc3VsdHMgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKTtcbiAgaWYgKG9ubHlGaXJzdCkge1xuICAgIHJldHVybiBhZGREKF9yZXN1bHRzICE9IG51bGwgPyBfcmVzdWx0c1swXSA6IHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBfcmVzdWx0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgX2VsID0gX3Jlc3VsdHNbal07XG4gICAgICByZXN1bHRzLnB1c2goYWRkRChfZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0pKCk7XG59O1xuXG5kb21IZWxwZXIuZG9tZWwgPSBmdW5jdGlvbihlbCkge1xuICBpZiAoZWwgIT0gbnVsbCkge1xuICAgIHJldHVybiBhZGREKGVsKTtcbiAgfVxufTtcblxuZG9tSGVscGVyLmNyZWF0ZSA9IGZ1bmN0aW9uKHRhZywgYXR0cmlidXRlcykge1xuICB2YXIgX2VsLCBfaywgX3Y7XG4gIGlmICh0YWcgPT0gbnVsbCkge1xuICAgIHRhZyA9IFwiRElWXCI7XG4gIH1cbiAgaWYgKGF0dHJpYnV0ZXMgPT0gbnVsbCkge1xuICAgIGF0dHJpYnV0ZXMgPSB7fTtcbiAgfVxuICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGZvciAoX2sgaW4gYXR0cmlidXRlcykge1xuICAgIF92ID0gYXR0cmlidXRlc1tfa107XG4gICAgX2VsLnNldEF0dHJpYnV0ZShfaywgX3YpO1xuICB9XG4gIHJldHVybiBhZGREKF9lbCk7XG59O1xuXG5kb21IZWxwZXIuZGF0YSA9IGZ1bmN0aW9uKGVsLCBrZXksIHZhbCkge1xuICBpZiAoKGVsICE9IG51bGwgPyBlbC5kYXRhc2V0IDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBhZGREKGVsKTtcbiAgfVxuICBpZiAoKGtleSAhPSBudWxsKSAmJiAodmFsICE9IG51bGwpKSB7XG4gICAgZWwuZGF0YXNldFtrZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGVsLmRhdGFzZXRba2V5XTtcbiAgfVxuICByZXR1cm4gZWwuZGF0YXNldDtcbn07XG5cbmRvbUhlbHBlci5hdHRyID0gZnVuY3Rpb24oZWwsIGtleSwgdmFsKSB7XG4gIGlmICgoa2V5ICE9IG51bGwpICYmICh2YWwgIT0gbnVsbCkpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgZWwuZ2V0QXR0cmlidXRlKGtleSk7XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmJ5Q2xhc3MgPSBmdW5jdGlvbihfY2wsIGNvbnRleHQsIG9ubHlGaXJzdCkge1xuICB2YXIgX2VsLCBfcmVzdWx0cztcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIGNvbnRleHQgPSBkb2N1bWVudDtcbiAgfVxuICBpZiAob25seUZpcnN0ID09IG51bGwpIHtcbiAgICBvbmx5Rmlyc3QgPSBmYWxzZTtcbiAgfVxuICBpZiAoX2NsWzBdID09PSBcIi5cIikge1xuICAgIF9jbCA9IF9jbC5zbGljZSgxKTtcbiAgfVxuICBfcmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShfY2wpO1xuICBpZiAob25seUZpcnN0KSB7XG4gICAgcmV0dXJuIGFkZEQoX3Jlc3VsdHMgIT0gbnVsbCA/IF9yZXN1bHRzWzBdIDogdm9pZCAwKTtcbiAgfVxuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IF9yZXN1bHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBfZWwgPSBfcmVzdWx0c1tqXTtcbiAgICAgIHJlc3VsdHMucHVzaChhZGREKF9lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSkoKTtcbn07XG5cbmRvbUhlbHBlci5ieUlkID0gZnVuY3Rpb24oX2lkLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cbiAgaWYgKF9pZFswXSA9PT0gXCIjXCIpIHtcbiAgICBfaWQgPSBfaWQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGFkZEQoY29udGV4dC5nZXRFbGVtZW50QnlJZChfaWQpKTtcbn07XG5cbmRvbUhlbHBlci5sYXN0ID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBpZHg7XG4gIGlkeCA9IGVsLmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgaWYgKGRvbUhlbHBlci5pcyhlbC5jaGlsZE5vZGVzW2lkeF0sIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGFkZEQoZWwuY2hpbGROb2Rlc1tpZHhdKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZHgtLTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRvbUhlbHBlci5wYXJlbnQgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIF9jdXJzb3I7XG4gIGlmIChzZWxlY3RvciA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGFkZEQoZWwucGFyZW50Tm9kZSk7XG4gIH1cbiAgX2N1cnNvciA9IGVsO1xuICB3aGlsZSAoX2N1cnNvci5wYXJlbnROb2RlICE9IG51bGwpIHtcbiAgICBfY3Vyc29yID0gX2N1cnNvci5wYXJlbnROb2RlO1xuICAgIGlmIChkb21IZWxwZXIuaXMoX2N1cnNvciwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gYWRkRChfY3Vyc29yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kb21IZWxwZXIuZmlyc3QgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGNoaWxkLCBpZHgsIGosIGxlbiwgcmVmO1xuICBpZHggPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gIHJlZiA9IGVsLmNoaWxkTm9kZXM7XG4gIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIGNoaWxkID0gcmVmW2pdO1xuICAgIGlmIChkb21IZWxwZXIuaXMoY2hpbGQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGFkZEQoY2hpbGQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRvbUhlbHBlci5jaGlsZHJlbiA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgY2hpbGQsIGNoaWxkcmVuLCBpZHgsIGosIGxlbiwgcmVmO1xuICBjaGlsZHJlbiA9IFtdO1xuICBpZHggPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gIHJlZiA9IGVsLmNoaWxkTm9kZXM7XG4gIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIGNoaWxkID0gcmVmW2pdO1xuICAgIGlmIChkb21IZWxwZXIuaXMoY2hpbGQsIHNlbGVjdG9yKSkge1xuICAgICAgY2hpbGRyZW4ucHVzaChhZGREKGNoaWxkKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjaGlsZHJlbjtcbn07XG5cbmRvbUhlbHBlci5jb3VudENoaWxkcmVuID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBkb21IZWxwZXIuY2hpbGRyZW4oZWwsIHNlbGVjdG9yKS5sZW5ndGg7XG59O1xuXG5kb21IZWxwZXIuaXMgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKHNlbGVjdG9yWzBdID09PSBcIi5cIikge1xuICAgIHJldHVybiBkb21IZWxwZXIuaGFzQ2xhc3MoZWwsIHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgfVxuICBpZiAoc2VsZWN0b3JbMF0gPT09IFwiI1wiKSB7XG4gICAgcmV0dXJuIGRvbUhlbHBlci5oYXNJZChlbCwgc2VsZWN0b3Iuc2xpY2UoMSkpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmRvbUhlbHBlci5oYXNDbGFzcyA9IGZ1bmN0aW9uKGVsLCBjbGFzc25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKGVsLmNsYXNzTGlzdCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc25hbWUpO1xuICB9XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLmNsYXNzTmFtZSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaW5kZXhPZi5jYWxsKChlbCAhPSBudWxsID8gKHJlZiA9IGVsLmNsYXNzTmFtZSkgIT0gbnVsbCA/IHJlZi5zcGxpdChcIiBcIikgOiB2b2lkIDAgOiB2b2lkIDApIHx8IFtdLCBjbGFzc25hbWUpID49IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5kb21IZWxwZXIuaGlkZSA9IGZ1bmN0aW9uKGVsKSB7XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLnN0eWxlIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuc2hvdyA9IGZ1bmN0aW9uKGVsLCBkaXNwbGF5KSB7XG4gIGlmIChkaXNwbGF5ID09IG51bGwpIHtcbiAgICBkaXNwbGF5ID0gXCJibG9ja1wiO1xuICB9XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLnN0eWxlIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5hZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzbmFtZSkge1xuICB2YXIgX2NsYXNzbmFtZXM7XG4gIGlmICh0aGlzLmhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgX2NsYXNzbmFtZXMgPSBlbGVtZW50LmNsYXNzTmFtZTtcbiAgaWYgKCFfY2xhc3NuYW1lcy5sZW5ndGgpIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzbmFtZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbWVudC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc25hbWU7XG4gIHJldHVybiBhZGREKGVsZW1lbnQpO1xufTtcblxuZG9tSGVscGVyLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NuYW1lKSB7XG4gIHZhciBfY2xhc3NuYW1lcywgcnhwO1xuICBpZiAoIXRoaXMuaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NuYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBfY2xhc3NuYW1lcyA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuICByeHAgPSBuZXcgUmVnRXhwKFwiXFxcXHM/XFxcXGJcIiArIGNsYXNzbmFtZSArIFwiXFxcXGJcIiwgXCJnXCIpO1xuICBfY2xhc3NuYW1lcyA9IF9jbGFzc25hbWVzLnJlcGxhY2UocnhwLCBcIlwiKTtcbiAgZWxlbWVudC5jbGFzc05hbWUgPSBfY2xhc3NuYW1lcztcbiAgcmV0dXJuIGFkZEQoZWxlbWVudCk7XG59O1xuXG5kb21IZWxwZXIuaGFzSWQgPSBmdW5jdGlvbihlbCwgaWQpIHtcbiAgaWYgKChlbCAhPSBudWxsID8gZWwuaWQgOiB2b2lkIDApID09PSBpZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmRvbUhlbHBlci5hcHBlbmQgPSBmdW5jdGlvbihlbCwgaHRtbCkge1xuICB2YXIgX2hkaXYsIGNoaWxkLCBqLCBrLCBsZW4sIGxlbjEsIHJlZjtcbiAgaWYgKGlzU3RyaW5nKGh0bWwpKSB7XG4gICAgX2hkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfaGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJlZiA9IF9oZGl2LmNoaWxkTm9kZXM7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBjaGlsZCA9IHJlZltqXTtcbiAgICAgIGlmICgoY2hpbGQgIT0gbnVsbCA/IGNoaWxkLnRhZ05hbWUgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChodG1sIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIHtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gaHRtbC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIGNoaWxkID0gaHRtbFtrXTtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaHRtbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICBlbC5hcHBlbmRDaGlsZChodG1sKTtcbiAgfVxuICByZXR1cm4gYWRkRChlbCk7XG59O1xuXG5kb21IZWxwZXIucHJlcGVuZCA9IGZ1bmN0aW9uKGVsLCBodG1sKSB7XG4gIHZhciBfZmlyc3RDaCwgX2hkaXYsIF9sYXRlc3RGaXJzdCwgY2hpbGQsIGosIHJlZiwgcmVmMTtcbiAgX2ZpcnN0Q2ggPSAocmVmID0gZWwuY2hpbGROb2RlcykgIT0gbnVsbCA/IHJlZlswXSA6IHZvaWQgMDtcbiAgaWYgKF9maXJzdENoID09IG51bGwpIHtcbiAgICBkb21IZWxwZXIuYXBwZW5kKGVsLCBodG1sKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX2hkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgX2hkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgX2xhdGVzdEZpcnN0ID0gX2ZpcnN0Q2g7XG4gIHJlZjEgPSBfaGRpdi5jaGlsZE5vZGVzO1xuICBmb3IgKGogPSByZWYxLmxlbmd0aCAtIDE7IGogPj0gMDsgaiArPSAtMSkge1xuICAgIGNoaWxkID0gcmVmMVtqXTtcbiAgICBpZiAoISgoY2hpbGQgIT0gbnVsbCA/IGNoaWxkLnRhZ05hbWUgOiB2b2lkIDApICE9IG51bGwpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZWwuaW5zZXJ0QmVmb3JlKGNoaWxkLCBfbGF0ZXN0Rmlyc3QpO1xuICAgIF9sYXRlc3RGaXJzdCA9IGNoaWxkO1xuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5yZW1vdmUgPSBmdW5jdGlvbihlbCkge1xuICB2YXIgaTtcbiAgaWYgKGVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIGVsLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSB7XG4gICAgaSA9IGVsLmxlbmd0aCAtIDE7XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKGVsW2ldICYmIGVsW2ldLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgZWxbaV0ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbFtpXSk7XG4gICAgICB9XG4gICAgICBpLS07XG4gICAgfVxuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5yZXBsYWNlV2l0aCA9IGZ1bmN0aW9uKGVsLCBlbFRvUmVwbCkge1xuICBkb21IZWxwZXIucGFyZW50KGVsKS5yZXBsYWNlQ2hpbGQoZWxUb1JlcGwsIGVsKTtcbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmNsb25lID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIGFkZEQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbn07XG5cbmRvbUhlbHBlci5vbiA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBoYW5kbGVyKSB7XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbC5hZGRFdmVudExpc3RlbmVyICE9IG51bGwpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgfSBlbHNlIGlmIChlbC5hdHRhY2hFdmVudCAhPSBudWxsKSB7XG4gICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsWydvbicgKyB0eXBlXSA9IGhhbmRsZXI7XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLm9mZiA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBoYW5kbGVyKSB7XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbC5yZW1vdmVFdmVudExpc3RlbmVyICE9IG51bGwpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgfSBlbHNlIGlmIChlbC5kZXRhY2hFdmVudCAhPSBudWxsKSB7XG4gICAgZWwuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBlbFsnb24nICsgdHlwZV07XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmVtaXQgPSBmdW5jdGlvbihlbCwgdHlwZSkge1xuICB2YXIgZXZ0O1xuICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZ0LmluaXRFdmVudCh0eXBlLCB0cnVlLCBmYWxzZSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgcmV0dXJuIGV2dDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tSGVscGVyO1xuXG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIG9uY2UgPSByZXF1aXJlKFwib25jZVwiKVxudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKFwiaXMtZnVuY3Rpb25cIilcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKFwicGFyc2UtaGVhZGVyc1wiKVxudmFyIHh0ZW5kID0gcmVxdWlyZShcInh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlWEhSXG5jcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgbm9vcFxuY3JlYXRlWEhSLlhEb21haW5SZXF1ZXN0ID0gXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiAobmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpKSA/IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA6IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuXG5mb3JFYWNoQXJyYXkoW1wiZ2V0XCIsIFwicHV0XCIsIFwicG9zdFwiLCBcInBhdGNoXCIsIFwiaGVhZFwiLCBcImRlbGV0ZVwiXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgY3JlYXRlWEhSW21ldGhvZCA9PT0gXCJkZWxldGVcIiA/IFwiZGVsXCIgOiBtZXRob2RdID0gZnVuY3Rpb24odXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgICBvcHRpb25zID0gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgICBvcHRpb25zLm1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgICAgIHJldHVybiBfY3JlYXRlWEhSKG9wdGlvbnMpXG4gICAgfVxufSlcblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvcikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0b3IoYXJyYXlbaV0pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iail7XG4gICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBwYXJhbXMgPSB1cmlcblxuICAgIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgICAgICBpZiAodHlwZW9mIHVyaSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcGFyYW1zID0ge3VyaTp1cml9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMgPSB4dGVuZChvcHRpb25zLCB7dXJpOiB1cml9KVxuICAgIH1cblxuICAgIHBhcmFtcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHBhcmFtc1xufVxuXG5mdW5jdGlvbiBjcmVhdGVYSFIodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIG9wdGlvbnMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgcmV0dXJuIF9jcmVhdGVYSFIob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVhIUihvcHRpb25zKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFja1xuICAgIGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbGxiYWNrIGFyZ3VtZW50IG1pc3NpbmdcIilcbiAgICB9XG4gICAgY2FsbGJhY2sgPSBvbmNlKGNhbGxiYWNrKVxuXG4gICAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBsb2FkRnVuYygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgICAgICAvLyBDaHJvbWUgd2l0aCByZXF1ZXN0VHlwZT1ibG9iIHRocm93cyBlcnJvcnMgYXJyb3VuZCB3aGVuIGV2ZW4gdGVzdGluZyBhY2Nlc3MgdG8gcmVzcG9uc2VUZXh0XG4gICAgICAgIHZhciBib2R5ID0gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgKHhoci5yZXNwb25zZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVxuICAgICAgICB9IGVsc2UgaWYgKHhoci5yZXNwb25zZVR5cGUgPT09IFwidGV4dFwiIHx8ICF4aHIucmVzcG9uc2VUeXBlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlVGV4dCB8fCB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0pzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9keVxuICAgIH1cblxuICAgIHZhciBmYWlsdXJlUmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgYm9keTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvckZ1bmMoZXZ0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKCEoZXZ0IGluc3RhbmNlb2YgRXJyb3IpKXtcbiAgICAgICAgICAgIGV2dCA9IG5ldyBFcnJvcihcIlwiICsgKGV2dCB8fCBcIlVua25vd24gWE1MSHR0cFJlcXVlc3QgRXJyb3JcIikgKVxuICAgICAgICB9XG4gICAgICAgIGV2dC5zdGF0dXNDb2RlID0gMFxuICAgICAgICBjYWxsYmFjayhldnQsIGZhaWx1cmVSZXNwb25zZSlcbiAgICB9XG5cbiAgICAvLyB3aWxsIGxvYWQgdGhlIGRhdGEgJiBwcm9jZXNzIHRoZSByZXNwb25zZSBpbiBhIHNwZWNpYWwgcmVzcG9uc2Ugb2JqZWN0XG4gICAgZnVuY3Rpb24gbG9hZEZ1bmMoKSB7XG4gICAgICAgIGlmIChhYm9ydGVkKSByZXR1cm5cbiAgICAgICAgdmFyIHN0YXR1c1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgICAgICBpZihvcHRpb25zLnVzZVhEUiAmJiB4aHIuc3RhdHVzPT09dW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL0lFOCBDT1JTIEdFVCBzdWNjZXNzZnVsIHJlc3BvbnNlIGRvZXNuJ3QgaGF2ZSBhIHN0YXR1cyBmaWVsZCwgYnV0IGJvZHkgaXMgZmluZVxuICAgICAgICAgICAgc3RhdHVzID0gMjAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAoeGhyLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHhoci5zdGF0dXMpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3BvbnNlID0gZmFpbHVyZVJlc3BvbnNlXG4gICAgICAgIHZhciBlcnIgPSBudWxsXG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gMCl7XG4gICAgICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBib2R5OiBnZXRCb2R5KCksXG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgIHVybDogdXJpLFxuICAgICAgICAgICAgICAgIHJhd1JlcXVlc3Q6IHhoclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycyl7IC8vcmVtZW1iZXIgeGhyIGNhbiBpbiBmYWN0IGJlIFhEUiBmb3IgQ09SUyBpbiBJRVxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMgPSBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyID0gbmV3IEVycm9yKFwiSW50ZXJuYWwgWE1MSHR0cFJlcXVlc3QgRXJyb3JcIilcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3BvbnNlLCByZXNwb25zZS5ib2R5KVxuXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG9wdGlvbnMueGhyIHx8IG51bGxcblxuICAgIGlmICgheGhyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvcnMgfHwgb3B0aW9ucy51c2VYRFIpIHtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWERvbWFpblJlcXVlc3QoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleVxuICAgIHZhciBhYm9ydGVkXG4gICAgdmFyIHVyaSA9IHhoci51cmwgPSBvcHRpb25zLnVyaSB8fCBvcHRpb25zLnVybFxuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YSB8fCBudWxsXG4gICAgdmFyIGhlYWRlcnMgPSB4aHIuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fVxuICAgIHZhciBzeW5jID0gISFvcHRpb25zLnN5bmNcbiAgICB2YXIgaXNKc29uID0gZmFsc2VcbiAgICB2YXIgdGltZW91dFRpbWVyXG5cbiAgICBpZiAoXCJqc29uXCIgaW4gb3B0aW9ucykge1xuICAgICAgICBpc0pzb24gPSB0cnVlXG4gICAgICAgIGhlYWRlcnNbXCJhY2NlcHRcIl0gfHwgaGVhZGVyc1tcIkFjY2VwdFwiXSB8fCAoaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiICYmIG1ldGhvZCAhPT0gXCJIRUFEXCIpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSB8fCAoaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuanNvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeXN0YXRlY2hhbmdlXG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGdW5jXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvckZ1bmNcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICB4aHIub250aW1lb3V0ID0gZXJyb3JGdW5jXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmksICFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKVxuICAgIC8vaGFzIHRvIGJlIGFmdGVyIG9wZW5cbiAgICBpZighc3luYykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFvcHRpb25zLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgICAvLyBDYW5ub3Qgc2V0IHRpbWVvdXQgd2l0aCBzeW5jIHJlcXVlc3RcbiAgICAvLyBub3Qgc2V0dGluZyB0aW1lb3V0IG9uIHRoZSB4aHIgb2JqZWN0LCBiZWNhdXNlIG9mIG9sZCB3ZWJraXRzIGV0Yy4gbm90IGhhbmRsaW5nIHRoYXQgY29ycmVjdGx5XG4gICAgLy8gYm90aCBucG0ncyByZXF1ZXN0IGFuZCBqcXVlcnkgMS54IHVzZSB0aGlzIGtpbmQgb2YgdGltZW91dCwgc28gdGhpcyBpcyBiZWluZyBjb25zaXN0ZW50XG4gICAgaWYgKCFzeW5jICYmIG9wdGlvbnMudGltZW91dCA+IDAgKSB7XG4gICAgICAgIHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFib3J0ZWQ9dHJ1ZS8vSUU5IG1heSBzdGlsbCBjYWxsIHJlYWR5c3RhdGVjaGFuZ2VcbiAgICAgICAgICAgIHhoci5hYm9ydChcInRpbWVvdXRcIilcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKFwiWE1MSHR0cFJlcXVlc3QgdGltZW91dFwiKVxuICAgICAgICAgICAgZS5jb2RlID0gXCJFVElNRURPVVRcIlxuICAgICAgICAgICAgZXJyb3JGdW5jKGUpXG4gICAgICAgIH0sIG9wdGlvbnMudGltZW91dCApXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmhlYWRlcnMgJiYgIWlzRW1wdHkob3B0aW9ucy5oZWFkZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpXG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG5cbiAgICBpZiAoXCJiZWZvcmVTZW5kXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG5cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb25cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChmbikge1xuICB2YXIgc3RyaW5nID0gdG9TdHJpbmcuY2FsbChmbilcbiAgcmV0dXJuIHN0cmluZyA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fFxuICAgICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgc3RyaW5nICE9PSAnW29iamVjdCBSZWdFeHBdJykgfHxcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgLy8gSUU4IGFuZCBiZWxvd1xuICAgICAoZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmFsZXJ0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmNvbmZpcm0gfHxcbiAgICAgIGZuID09PSB3aW5kb3cucHJvbXB0KSlcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGl0ZXJhdG9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBjb250ZXh0ID0gdGhpc1xuICAgIH1cbiAgICBcbiAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJylcbiAgICAgICAgZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJylcbiAgICAgICAgZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlXG4gICAgICAgIGZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksIGkpKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrIGluIG9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpO1xufTtcblxuZXhwb3J0cy5yaWdodCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuICAsIGlzQXJyYXkgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgLCBrZXkgPSB0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAsIHZhbHVlID0gdHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSlcblxuICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gWyByZXN1bHRba2V5XSwgdmFsdWUgXVxuICAgICAgICB9XG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59IiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiJdfQ==
