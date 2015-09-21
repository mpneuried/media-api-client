(function() {
  var Base, Client, File, FileView, _defauktKeys, _defaults, _k, _v, dom, utils,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dom = require("domel");

  utils = require("./utils");

  Base = require("./base");

  File = require("./file");

  FileView = require("./fileview");

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
      this.onFinish = bind(this.onFinish, this);
      this.fileNew = bind(this.fileNew, this);
      this.fileError = bind(this.fileError, this);
      this.fileDone = bind(this.fileDone, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.abortAll = bind(this.abortAll, this);
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
      if ((this.options["content-disposition"] != null) && !utils.isString(this.options["content-disposition"])) {
        this._error(null, "invalid-content-disposition");
        return;
      }
      if ((this.options.acl != null) && !utils.isString(this.options.acl) && ((ref4 = this.options.acl) !== "public-read" && ref4 !== "authenticated-read")) {
        this._error(null, "invalid-acl");
        return;
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
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr != null ? xhr.upload : void 0) {
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

    Client.prototype.fileDone = function(file) {
      this.idx_finished++;
      this._checkFinish();
    };

    Client.prototype.fileError = function(file, err) {
      console.error("FILE-ERROR", file, err);
      this.idx_finished++;
      this._checkFinish();
    };

    Client.prototype.fileNew = function(file) {
      var _fileview;
      if (this.res != null) {
        _fileview = new FileView(file, this, this.options);
        this.res.d.append(_fileview.render());
      }
    };

    Client.prototype.onFinish = function() {
      this.el.d.removeClass(this.options.cssprocess);
    };

    Client.prototype._checkFinish = function() {
      if (this.idx_finished >= this.idx_started) {
        this.emit("finish");
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
      "invalid-ttl": "for the option `ttl` only a positiv number is allowed",
      "invalid-tags": "for the option `tags` only an array of strings is allowed",
      "invalid-properties": "for the option `properties` only an object is allowed",
      "invalid-content-disposition": "for the option `content-disposition` only an string like: `attachment; filename=friendly_filename.pdf` is allowed",
      "invalid-acl": "the option acl only accepts the string `public-read` or `authenticated-read`"
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

}).call(this);
