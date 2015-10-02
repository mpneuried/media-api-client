(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MediaApiClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
  return addD(el);
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
  return addD(el);
};

domHelper.empty = function(el) {
  el.innerHTML = "";
  return addD(el);
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

},{}],2:[function(_dereq_,module,exports){
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

  Base.prototype._error = function(cb, err) {
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
    if (cb == null) {
      throw _err;
    } else {
      cb(_err);
    }
  };

  return Base;

})(_dereq_('events'));

module.exports = Base;


},{"events":8}],3:[function(_dereq_,module,exports){
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
    this.onFinish = bind(this.onFinish, this);
    this.fileNew = bind(this.fileNew, this);
    this.fileError = bind(this.fileError, this);
    this.fileDone = bind(this.fileDone, this);
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
    if ((this.options["content-disposition"] != null) && !utils.isString(this.options["content-disposition"])) {
      this._error(null, "invalid-content-disposition");
      return;
    }
    if ((this.options.acl != null) && !utils.isString(this.options.acl) && ((ref4 = this.options.acl) !== "public-read" && ref4 !== "authenticated-read")) {
      this._error(null, "invalid-acl");
      return;
    }
    if ((this.options.requestSignFn != null) && _.isFunction(this.options.requestSignFn)) {
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
    "invalid-sign-url": "please define a `url` to sign the request",
    "invalid-sign-key": "please define a `key` to sign the request",
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


},{"./base":2,"./file":4,"./fileview":5,"./utils":7,"domel":1,"xhr":9}],4:[function(_dereq_,module,exports){
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
        if (evnt.target.method == null) {
          _this.progressState = evnt.loaded / evnt.total;
          _this._setState(4);
          _this.emit("progress", _this.getProgress(), evnt);
          return;
        }
      };
    })(this);
  };

  return File;

})(_dereq_("./base"));

module.exports = File;


},{"./base":2,"xhr":9}],5:[function(_dereq_,module,exports){
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


},{"./base":2,"domel":1}],6:[function(_dereq_,module,exports){
var Base, Client, File, FileView;

Base = _dereq_("./base");

File = _dereq_("./file");

FileView = _dereq_("./fileview");

Client = _dereq_("./client");

Client.Base = Base;

Client.File = File;

Client.FileView = FileView;

module.exports = Client;


},{"./base":2,"./client":3,"./file":4,"./fileview":5}],7:[function(_dereq_,module,exports){
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
var parseHeaders = _dereq_("parse-headers")



module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest


function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function createXHR(options, callback) {
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

    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

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
    var body = options.body || options.data
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

},{"global/window":10,"once":11,"parse-headers":15}],10:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
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

},{"is-function":13}],13:[function(_dereq_,module,exports){
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

},{}],14:[function(_dereq_,module,exports){

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
},{"for-each":12,"trim":14}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9kb21lbC9saWIvbWFpbi5qcyIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9iYXNlLmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9jbGllbnQuY29mZmVlIiwiL1VzZXJzL21hdGhpYXNwZXRlci9Qcm9qZWt0ZS9tZWRpYS1hcGktY2xpZW50L19zcmMvbGliL2ZpbGUuY29mZmVlIiwiL1VzZXJzL21hdGhpYXNwZXRlci9Qcm9qZWt0ZS9tZWRpYS1hcGktY2xpZW50L19zcmMvbGliL2ZpbGV2aWV3LmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9tYWluLmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi91dGlscy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9ub2RlX21vZHVsZXMvaXMtZnVuY3Rpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmRvbWVsID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGFkZEQsIGFkZERXcmFwLCBkb21IZWxwZXIsIGlzU3RyaW5nLCBub25BdXRvQXR0YWNoLFxuICBzbGljZSA9IFtdLnNsaWNlLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbmlzU3RyaW5nID0gZnVuY3Rpb24odnIpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ciA9PT0gJ3N0cmluZycgfHwgdnIgaW5zdGFuY2VvZiBTdHJpbmc7XG59O1xuXG5ub25BdXRvQXR0YWNoID0gW1wiZG9tZWxcIiwgXCJjcmVhdGVcIiwgXCJieUNsYXNzXCIsIFwiYnlJZFwiXTtcblxuYWRkRFdyYXAgPSBmdW5jdGlvbihmbiwgZWwsIGVsSWR4KSB7XG4gIGlmIChlbElkeCA9PSBudWxsKSB7XG4gICAgZWxJZHggPSAwO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncztcbiAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgYXJncy5zcGxpY2UoZWxJZHgsIDAsIGVsKTtcbiAgICByZXR1cm4gZm4uYXBwbHkoZG9tSGVscGVyLCBhcmdzKTtcbiAgfTtcbn07XG5cbmFkZEQgPSBmdW5jdGlvbihlbCwga2V5KSB7XG4gIHZhciBqLCBsZW4sIG5hbWVGbiwgcmVmO1xuICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICBrZXkgPSBcImRcIjtcbiAgfVxuICBpZiAoZWwgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbDtcbiAgfVxuICBpZiAoZWxba2V5XSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG4gIGVsW2tleV0gPSB7fTtcbiAgcmVmID0gT2JqZWN0LmtleXMoZG9tSGVscGVyKTtcbiAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgbmFtZUZuID0gcmVmW2pdO1xuICAgIGlmIChpbmRleE9mLmNhbGwobm9uQXV0b0F0dGFjaCwgbmFtZUZuKSA8IDApIHtcbiAgICAgIGVsW2tleV1bbmFtZUZuXSA9IGFkZERXcmFwKGRvbUhlbHBlcltuYW1lRm5dLCBlbCk7XG4gICAgfVxuICB9XG4gIGVsW2tleV0uZmluZCA9IGFkZERXcmFwKGRvbUhlbHBlciwgZWwsIDEpO1xuICBlbFtrZXldLmJ5SWQgPSBhZGREV3JhcChkb21IZWxwZXIuYnlJZCwgZWwsIDEpO1xuICBlbFtrZXldLmJ5Q2xhc3MgPSBhZGREV3JhcChkb21IZWxwZXIuYnlDbGFzcywgZWwsIDEpO1xuICByZXR1cm4gZWw7XG59O1xuXG5cbi8qXG5cdFxuXHRET00gaGVscGVyc1xuICovXG5cbmRvbUhlbHBlciA9IGZ1bmN0aW9uKHNlbCwgY29udGV4dCwgb25seUZpcnN0KSB7XG4gIHZhciBfZWwsIF9yZXN1bHRzLCBfc2VsLCBfc2VscywgcmVmO1xuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgY29udGV4dCA9IGRvY3VtZW50O1xuICB9XG4gIGlmIChvbmx5Rmlyc3QgPT0gbnVsbCkge1xuICAgIG9ubHlGaXJzdCA9IGZhbHNlO1xuICB9XG4gIF9zZWxzID0gc2VsLnNwbGl0KFwiIFwiKTtcbiAgaWYgKF9zZWxzLmV2ZXJ5KChmdW5jdGlvbihzZWwpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiAocmVmID0gc2VsWzBdKSA9PT0gXCIuXCIgfHwgcmVmID09PSBcIiNcIjtcbiAgfSkpKSB7XG4gICAgd2hpbGUgKF9zZWxzLmxlbmd0aCkge1xuICAgICAgaWYgKChfc2VsID0gKHJlZiA9IF9zZWxzLnNwbGljZSgwLCAxKSkgIT0gbnVsbCA/IHJlZlswXSA6IHZvaWQgMCkpIHtcbiAgICAgICAgc3dpdGNoIChfc2VsWzBdKSB7XG4gICAgICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgICAgIGNvbnRleHQgPSBkb21IZWxwZXIuYnlDbGFzcyhfc2VsLCBjb250ZXh0LCBvbmx5Rmlyc3QpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgICAgIGNvbnRleHQgPSBkb21IZWxwZXIuYnlJZChfc2VsLCBjb250ZXh0LCBvbmx5Rmlyc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG4gIF9yZXN1bHRzID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbCk7XG4gIGlmIChvbmx5Rmlyc3QpIHtcbiAgICByZXR1cm4gYWRkRChfcmVzdWx0cyAhPSBudWxsID8gX3Jlc3VsdHNbMF0gOiB2b2lkIDApO1xuICB9XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuID0gX3Jlc3VsdHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIF9lbCA9IF9yZXN1bHRzW2pdO1xuICAgICAgcmVzdWx0cy5wdXNoKGFkZEQoX2VsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9KSgpO1xufTtcblxuZG9tSGVscGVyLmRvbWVsID0gZnVuY3Rpb24oZWwpIHtcbiAgaWYgKGVsICE9IG51bGwpIHtcbiAgICByZXR1cm4gYWRkRChlbCk7XG4gIH1cbn07XG5cbmRvbUhlbHBlci5jcmVhdGUgPSBmdW5jdGlvbih0YWcsIGF0dHJpYnV0ZXMpIHtcbiAgdmFyIF9lbCwgX2ssIF92O1xuICBpZiAodGFnID09IG51bGwpIHtcbiAgICB0YWcgPSBcIkRJVlwiO1xuICB9XG4gIGlmIChhdHRyaWJ1dGVzID09IG51bGwpIHtcbiAgICBhdHRyaWJ1dGVzID0ge307XG4gIH1cbiAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBmb3IgKF9rIGluIGF0dHJpYnV0ZXMpIHtcbiAgICBfdiA9IGF0dHJpYnV0ZXNbX2tdO1xuICAgIF9lbC5zZXRBdHRyaWJ1dGUoX2ssIF92KTtcbiAgfVxuICByZXR1cm4gYWRkRChfZWwpO1xufTtcblxuZG9tSGVscGVyLmRhdGEgPSBmdW5jdGlvbihlbCwga2V5LCB2YWwpIHtcbiAgaWYgKChlbCAhPSBudWxsID8gZWwuZGF0YXNldCA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gYWRkRChlbCk7XG4gIH1cbiAgaWYgKChrZXkgIT0gbnVsbCkgJiYgKHZhbCAhPSBudWxsKSkge1xuICAgIGVsLmRhdGFzZXRba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIHJldHVybiBlbC5kYXRhc2V0W2tleV07XG4gIH1cbiAgcmV0dXJuIGVsLmRhdGFzZXQ7XG59O1xuXG5kb21IZWxwZXIuYXR0ciA9IGZ1bmN0aW9uKGVsLCBrZXksIHZhbCkge1xuICBpZiAoKGtleSAhPSBudWxsKSAmJiAodmFsICE9IG51bGwpKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIGVsLmdldEF0dHJpYnV0ZShrZXkpO1xuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5ieUNsYXNzID0gZnVuY3Rpb24oX2NsLCBjb250ZXh0LCBvbmx5Rmlyc3QpIHtcbiAgdmFyIF9lbCwgX3Jlc3VsdHM7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cbiAgaWYgKG9ubHlGaXJzdCA9PSBudWxsKSB7XG4gICAgb25seUZpcnN0ID0gZmFsc2U7XG4gIH1cbiAgaWYgKF9jbFswXSA9PT0gXCIuXCIpIHtcbiAgICBfY2wgPSBfY2wuc2xpY2UoMSk7XG4gIH1cbiAgX3Jlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoX2NsKTtcbiAgaWYgKG9ubHlGaXJzdCkge1xuICAgIHJldHVybiBhZGREKF9yZXN1bHRzICE9IG51bGwgPyBfcmVzdWx0c1swXSA6IHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBfcmVzdWx0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgX2VsID0gX3Jlc3VsdHNbal07XG4gICAgICByZXN1bHRzLnB1c2goYWRkRChfZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0pKCk7XG59O1xuXG5kb21IZWxwZXIuYnlJZCA9IGZ1bmN0aW9uKF9pZCwgY29udGV4dCkge1xuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgY29udGV4dCA9IGRvY3VtZW50O1xuICB9XG4gIGlmIChfaWRbMF0gPT09IFwiI1wiKSB7XG4gICAgX2lkID0gX2lkLnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBhZGREKGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoX2lkKSk7XG59O1xuXG5kb21IZWxwZXIubGFzdCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgaWR4O1xuICBpZHggPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpZHggPj0gMCkge1xuICAgIGlmIChkb21IZWxwZXIuaXMoZWwuY2hpbGROb2Rlc1tpZHhdLCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBhZGREKGVsLmNoaWxkTm9kZXNbaWR4XSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWR4LS07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kb21IZWxwZXIucGFyZW50ID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBfY3Vyc29yO1xuICBpZiAoc2VsZWN0b3IgPT0gbnVsbCkge1xuICAgIHJldHVybiBhZGREKGVsLnBhcmVudE5vZGUpO1xuICB9XG4gIF9jdXJzb3IgPSBlbDtcbiAgd2hpbGUgKF9jdXJzb3IucGFyZW50Tm9kZSAhPSBudWxsKSB7XG4gICAgX2N1cnNvciA9IF9jdXJzb3IucGFyZW50Tm9kZTtcbiAgICBpZiAoZG9tSGVscGVyLmlzKF9jdXJzb3IsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGFkZEQoX2N1cnNvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZG9tSGVscGVyLmZpcnN0ID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBjaGlsZCwgaWR4LCBqLCBsZW4sIHJlZjtcbiAgaWR4ID0gZWwuY2hpbGROb2Rlcy5sZW5ndGggLSAxO1xuICByZWYgPSBlbC5jaGlsZE5vZGVzO1xuICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBjaGlsZCA9IHJlZltqXTtcbiAgICBpZiAoZG9tSGVscGVyLmlzKGNoaWxkLCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBhZGREKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kb21IZWxwZXIuY2hpbGRyZW4gPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGNoaWxkLCBjaGlsZHJlbiwgaWR4LCBqLCBsZW4sIHJlZjtcbiAgY2hpbGRyZW4gPSBbXTtcbiAgaWR4ID0gZWwuY2hpbGROb2Rlcy5sZW5ndGggLSAxO1xuICByZWYgPSBlbC5jaGlsZE5vZGVzO1xuICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBjaGlsZCA9IHJlZltqXTtcbiAgICBpZiAoZG9tSGVscGVyLmlzKGNoaWxkLCBzZWxlY3RvcikpIHtcbiAgICAgIGNoaWxkcmVuLnB1c2goYWRkRChjaGlsZCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2hpbGRyZW47XG59O1xuXG5kb21IZWxwZXIuY291bnRDaGlsZHJlbiA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICByZXR1cm4gZG9tSGVscGVyLmNoaWxkcmVuKGVsLCBzZWxlY3RvcikubGVuZ3RoO1xufTtcblxuZG9tSGVscGVyLmlzID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIGlmIChzZWxlY3RvclswXSA9PT0gXCIuXCIpIHtcbiAgICByZXR1cm4gZG9tSGVscGVyLmhhc0NsYXNzKGVsLCBzZWxlY3Rvci5zbGljZSgxKSk7XG4gIH1cbiAgaWYgKHNlbGVjdG9yWzBdID09PSBcIiNcIikge1xuICAgIHJldHVybiBkb21IZWxwZXIuaGFzSWQoZWwsIHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5kb21IZWxwZXIuaGFzQ2xhc3MgPSBmdW5jdGlvbihlbCwgY2xhc3NuYW1lKSB7XG4gIHZhciByZWY7XG4gIGlmIChlbC5jbGFzc0xpc3QgIT0gbnVsbCkge1xuICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NuYW1lKTtcbiAgfVxuICBpZiAoKGVsICE9IG51bGwgPyBlbC5jbGFzc05hbWUgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGluZGV4T2YuY2FsbCgoZWwgIT0gbnVsbCA/IChyZWYgPSBlbC5jbGFzc05hbWUpICE9IG51bGwgPyByZWYuc3BsaXQoXCIgXCIpIDogdm9pZCAwIDogdm9pZCAwKSB8fCBbXSwgY2xhc3NuYW1lKSA+PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZG9tSGVscGVyLmhpZGUgPSBmdW5jdGlvbihlbCkge1xuICBpZiAoKGVsICE9IG51bGwgPyBlbC5zdHlsZSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLnNob3cgPSBmdW5jdGlvbihlbCwgZGlzcGxheSkge1xuICBpZiAoZGlzcGxheSA9PSBudWxsKSB7XG4gICAgZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgfVxuICBpZiAoKGVsICE9IG51bGwgPyBlbC5zdHlsZSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGVsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuYWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtZW50LCBjbGFzc25hbWUpIHtcbiAgdmFyIF9jbGFzc25hbWVzO1xuICBpZiAodGhpcy5oYXNDbGFzcyhlbGVtZW50LCBjbGFzc25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9jbGFzc25hbWVzID0gZWxlbWVudC5jbGFzc05hbWU7XG4gIGlmICghX2NsYXNzbmFtZXMubGVuZ3RoKSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc25hbWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW1lbnQuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xhc3NuYW1lO1xuICByZXR1cm4gYWRkRChlbGVtZW50KTtcbn07XG5cbmRvbUhlbHBlci5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzbmFtZSkge1xuICB2YXIgX2NsYXNzbmFtZXMsIHJ4cDtcbiAgaWYgKCF0aGlzLmhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgX2NsYXNzbmFtZXMgPSBlbGVtZW50LmNsYXNzTmFtZTtcbiAgcnhwID0gbmV3IFJlZ0V4cChcIlxcXFxzP1xcXFxiXCIgKyBjbGFzc25hbWUgKyBcIlxcXFxiXCIsIFwiZ1wiKTtcbiAgX2NsYXNzbmFtZXMgPSBfY2xhc3NuYW1lcy5yZXBsYWNlKHJ4cCwgXCJcIik7XG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gX2NsYXNzbmFtZXM7XG4gIHJldHVybiBhZGREKGVsZW1lbnQpO1xufTtcblxuZG9tSGVscGVyLmhhc0lkID0gZnVuY3Rpb24oZWwsIGlkKSB7XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLmlkIDogdm9pZCAwKSA9PT0gaWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5kb21IZWxwZXIuYXBwZW5kID0gZnVuY3Rpb24oZWwsIGh0bWwpIHtcbiAgdmFyIF9oZGl2LCBjaGlsZCwgaiwgaywgbGVuLCBsZW4xLCByZWY7XG4gIGlmIChpc1N0cmluZyhodG1sKSkge1xuICAgIF9oZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX2hkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZWYgPSBfaGRpdi5jaGlsZE5vZGVzO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgY2hpbGQgPSByZWZbal07XG4gICAgICBpZiAoKGNoaWxkICE9IG51bGwgPyBjaGlsZC50YWdOYW1lIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaHRtbCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSB7XG4gICAgZm9yIChrID0gMCwgbGVuMSA9IGh0bWwubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICBjaGlsZCA9IGh0bWxba107XG4gICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgZWwuYXBwZW5kQ2hpbGQoaHRtbCk7XG4gIH1cbiAgcmV0dXJuIGFkZEQoZWwpO1xufTtcblxuZG9tSGVscGVyLnByZXBlbmQgPSBmdW5jdGlvbihlbCwgaHRtbCkge1xuICB2YXIgX2ZpcnN0Q2gsIF9oZGl2LCBfbGF0ZXN0Rmlyc3QsIGNoaWxkLCBqLCByZWYsIHJlZjE7XG4gIF9maXJzdENoID0gKHJlZiA9IGVsLmNoaWxkTm9kZXMpICE9IG51bGwgPyByZWZbMF0gOiB2b2lkIDA7XG4gIGlmIChfZmlyc3RDaCA9PSBudWxsKSB7XG4gICAgZG9tSGVscGVyLmFwcGVuZChlbCwgaHRtbCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9oZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIF9oZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gIF9sYXRlc3RGaXJzdCA9IF9maXJzdENoO1xuICByZWYxID0gX2hkaXYuY2hpbGROb2RlcztcbiAgZm9yIChqID0gcmVmMS5sZW5ndGggLSAxOyBqID49IDA7IGogKz0gLTEpIHtcbiAgICBjaGlsZCA9IHJlZjFbal07XG4gICAgaWYgKCEoKGNoaWxkICE9IG51bGwgPyBjaGlsZC50YWdOYW1lIDogdm9pZCAwKSAhPSBudWxsKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGVsLmluc2VydEJlZm9yZShjaGlsZCwgX2xhdGVzdEZpcnN0KTtcbiAgICBfbGF0ZXN0Rmlyc3QgPSBjaGlsZDtcbiAgfVxuICByZXR1cm4gYWRkRChlbCk7XG59O1xuXG5kb21IZWxwZXIucmVtb3ZlID0gZnVuY3Rpb24oZWwpIHtcbiAgdmFyIGk7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICBlbC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbikge1xuICAgIGkgPSBlbC5sZW5ndGggLSAxO1xuICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgIGlmIChlbFtpXSAmJiBlbFtpXS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIGVsW2ldLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxbaV0pO1xuICAgICAgfVxuICAgICAgaS0tO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWRkRChlbCk7XG59O1xuXG5kb21IZWxwZXIuZW1wdHkgPSBmdW5jdGlvbihlbCkge1xuICBlbC5pbm5lckhUTUwgPSBcIlwiO1xuICByZXR1cm4gYWRkRChlbCk7XG59O1xuXG5kb21IZWxwZXIucmVwbGFjZVdpdGggPSBmdW5jdGlvbihlbCwgZWxUb1JlcGwpIHtcbiAgZG9tSGVscGVyLnBhcmVudChlbCkucmVwbGFjZUNoaWxkKGVsVG9SZXBsLCBlbCk7XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5jbG9uZSA9IGZ1bmN0aW9uKGVsKSB7XG4gIHJldHVybiBhZGREKGVsLmNsb25lTm9kZSh0cnVlKSk7XG59O1xuXG5kb21IZWxwZXIub24gPSBmdW5jdGlvbihlbCwgdHlwZSwgaGFuZGxlcikge1xuICBpZiAoZWwgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZWwuYWRkRXZlbnRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAoZWwuYXR0YWNoRXZlbnQgIT0gbnVsbCkge1xuICAgIGVsLmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCBoYW5kbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBlbFsnb24nICsgdHlwZV0gPSBoYW5kbGVyO1xuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5vZmYgPSBmdW5jdGlvbihlbCwgdHlwZSwgaGFuZGxlcikge1xuICBpZiAoZWwgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAoZWwuZGV0YWNoRXZlbnQgIT0gbnVsbCkge1xuICAgIGVsLmRldGFjaEV2ZW50KCdvbicgKyB0eXBlLCBoYW5kbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgZWxbJ29uJyArIHR5cGVdO1xuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5lbWl0ID0gZnVuY3Rpb24oZWwsIHR5cGUpIHtcbiAgdmFyIGV2dDtcbiAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2dC5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgZmFsc2UpO1xuICBlbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIHJldHVybiBldnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUhlbHBlcjtcblxuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwiY2xhc3MgQmFzZSBleHRlbmRzIHJlcXVpcmUoJ2V2ZW50cycpXG5cdF9lcnJvcjogKCBjYiwgZXJyICk9PlxuXHRcdGlmIG5vdCAoIGVyciBpbnN0YW5jZW9mIEVycm9yIClcblx0XHRcdF9lcnIgPSBuZXcgRXJyb3IoIGVyciApXG5cdFx0XHRfZXJyLm5hbWUgPSBlcnJcblx0XHRcdHRyeVxuXHRcdFx0XHRfZXJyLm1lc3NhZ2UgPSBARVJST1JTWyBlcnIgXSBvciBcIiAtIFwiXG5cdFx0ZWxzZVxuXHRcdFx0X2VyciA9IGVyclxuXG5cdFx0aWYgbm90IGNiP1xuXHRcdFx0dGhyb3cgX2VyclxuXHRcdGVsc2Vcblx0XHRcdGNiKCBfZXJyIClcblx0XHRyZXR1cm5cblx0XHRcbm1vZHVsZS5leHBvcnRzID0gQmFzZVxuIiwiZG9tID0gcmVxdWlyZSggXCJkb21lbFwiIClcbnhociA9IHJlcXVpcmUoIFwieGhyXCIgKVxuXG51dGlscyA9IHJlcXVpcmUoIFwiLi91dGlsc1wiIClcbkJhc2UgPSByZXF1aXJlKCBcIi4vYmFzZVwiIClcbkZpbGUgPSByZXF1aXJlKCBcIi4vZmlsZVwiIClcbkZpbGVWaWV3ID0gcmVxdWlyZSggXCIuL2ZpbGV2aWV3XCIgKVxuXG5fZGVmYXVsdHMgPVxuXHRob3N0OiBudWxsXG5cdGRvbWFpbjogbnVsbFxuXHRhY2Nlc3NrZXk6IG51bGxcblx0a2V5cHJlZml4OiBcImNsaWVudHVwbG9hZFwiXG5cdGF1dG9zdGFydDogdHJ1ZVxuXHRyZXF1ZXN0U2lnbkZuOiBudWxsXG5cdHJlc3VsdFRlbXBsYXRlRm46IG51bGxcblx0bWF4c2l6ZTogMFxuXHRtYXhjb3VudDogMFxuXHR3aWR0aDogbnVsbFxuXHRoZWlnaHQ6IG51bGxcblx0YWNjZXB0OiBudWxsXG5cdHR0bDogMFxuXHRhY2w6IFwicHVibGljLXJlYWRcIlxuXHRwcm9wZXJ0aWVzOiBudWxsXG5cdHRhZ3M6IG51bGxcblx0XCJjb250ZW50LWRpc3Bvc2l0aW9uXCI6IG51bGxcblx0Y3NzZHJvcHBhYmxlOiBcImRyb3BhYmxlXCJcblx0Y3NzaG92ZXI6IFwiaG92ZXJcIlxuXHRjc3Nwcm9jZXNzOiBcInByb2Nlc3NcIlxuXHRjc3NkaXNhYmxlZDogXCJkaXNhYmxlZFwiXG5cbl9kZWZhdWt0S2V5cyA9IGZvciBfaywgX3Ygb2YgX2RlZmF1bHRzXG5cdF9rXG5cbmNsYXNzIENsaWVudCBleHRlbmRzIEJhc2Vcblx0dmVyc2lvbjogXCJAQHZlcnNpb25cIlxuXG5cdF9yZ3hIb3N0OiAvaHR0cHM/OlxcL1xcL1teXFwvJFxcc10rL2lcblxuXHRjb25zdHJ1Y3RvcjogKCBkcmFnLCBlbHJlc3VsdHMsIG9wdGlvbnMgPSB7fSApLT5cblx0XHRzdXBlclxuXHRcdFxuXHRcdEBlbmFibGVkID0gdHJ1ZVxuXHRcdEB1c2VGaWxlQVBJID0gZmFsc2Vcblx0XHRcblx0XHRAb24oIFwiZmlsZS5uZXdcIiwgQGZpbGVOZXcgKVxuXG5cdFx0QG9uKCBcImZpbGUuZG9uZVwiLCBAZmlsZURvbmUgKVxuXHRcdEBvbiggXCJmaWxlLmVycm9yXCIsIEBmaWxlRXJyb3IgKVxuXHRcdEBvbiggXCJmaWxlLmludmFsaWRcIiwgQGZpbGVFcnJvciApXG5cdFx0QG9uKCBcImZpbGUuYWJvcnRlZFwiLCBAZmlsZUVycm9yIClcblx0XHRAb24oIFwiZmluaXNoXCIsIEBvbkZpbmlzaCApXG5cdFx0QHdpdGhpbl9lbnRlciA9IGZhbHNlXG5cblxuXHRcdEBlbCA9IEBfdmFsaWRhdGVFbCggZHJhZywgXCJkcmFnXCIgKVxuXHRcdEBzZWwgPSBAZWwuZC5maW5kKCBcImlucHV0I3sgb3B0aW9ucy5pbnB1dGNsYXNzIG9yIFwiXCIgfVt0eXBlPSdmaWxlJ11cIiwgdHJ1ZSApXG5cdFx0aWYgbm90IEBzZWw/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3Npbmctc2VsZWN0LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRAZm9ybW5hbWUgPSBAc2VsLmdldEF0dHJpYnV0ZSggXCJuYW1lXCIgKVxuXG5cdFx0aWYgZWxyZXN1bHRzP1xuXHRcdFx0QHJlcyA9IEBfdmFsaWRhdGVFbCggZWxyZXN1bHRzLCBcInJlc3VsdFwiIClcblxuXG5cdFx0X2h0bWxEYXRhID0gQGVsLmQuZGF0YSgpXG5cdFx0QG9wdGlvbnMgPSB1dGlscy5hc3NpZ24oIHt9LCBfZGVmYXVsdHMsIF9odG1sRGF0YSwgb3B0aW9ucyBvciB7fSApXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuaG9zdD8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3NpbmctaG9zdFwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IEBfcmd4SG9zdC50ZXN0KCBAb3B0aW9ucy5ob3N0IClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC1ob3N0XCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuZG9tYWluPy5sZW5ndGhcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy1kb21haW5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5hY2Nlc3NrZXk/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJtaXNzaW5nLWFjY2Vzc2tleVwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQ/XG5cdFx0XHRfbXhjbnQgPSBwYXJzZUludCggQG9wdGlvbnMubWF4Y291bnQsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhjbnQgKVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9kZWZhdWx0cy5tYXhjb3VudFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9teGNudFxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgaXNudCAxXG5cdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJtdWx0aXBsZVwiLCBcIm11bHRpcGxlXCIgKVxuXG5cdFx0aWYgQG9wdGlvbnMubWF4c2l6ZT9cblx0XHRcdF9teHN6ID0gcGFyc2VJbnQoIEBvcHRpb25zLm1heHNpemUsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhzeiApXG5cdFx0XHRcdEBvcHRpb25zLm1heHNpemUgPSBfZGVmYXVsdHMubWF4c2l6ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhzaXplID0gX214c3pcblxuXHRcdGlmIEBvcHRpb25zLnJlcXVlc3RTaWduRm4/IGFuZCB0eXBlb2YgQG9wdGlvbnMucmVxdWVzdFNpZ25GbiBpc250IFwiZnVuY3Rpb25cIlxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXJlcXVlc3RTaWduZm5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnR0bD8gYW5kIG5vdCB1dGlscy5pc0ludCggQG9wdGlvbnMudHRsIClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC10dGxcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlIGlmIEBvcHRpb25zLnR0bD9cblx0XHRcdEBvcHRpb25zLnR0bCA9IHBhcnNlSW50KCBAb3B0aW9ucy50dGwsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBAb3B0aW9ucy50dGwgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdHRsXCIgKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnRhZ3M/IGFuZCB1dGlscy5pc0FycmF5KCBAb3B0aW9ucy50YWdzIClcblx0XHRcdGZvciBfdGFnIGluIEBvcHRpb25zLnRhZ3Mgd2hlbiBub3QgdXRpbHMuaXNTdHJpbmcoIF90YWcgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdGFnc1wiIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0ZWxzZSBpZiBAb3B0aW9ucy50YWdzP1xuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXRhZ3NcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnByb3BlcnRpZXM/IGFuZCBub3QgdXRpbHMuaXNPYmplY3QoIEBvcHRpb25zLnByb3BlcnRpZXMgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXByb3BlcnRpZXNcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSApXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtY29udGVudC1kaXNwb3NpdGlvblwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMuYWNsPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9ucy5hY2wgKSBhbmQgQG9wdGlvbnMuYWNsIG5vdCBpbiBbIFwicHVibGljLXJlYWRcIiwgXCJhdXRoZW50aWNhdGVkLXJlYWRcIiBdXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtYWNsXCIgKVxuXHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRpZiBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuPyBhbmQgXy5pc0Z1bmN0aW9uKCBAb3B0aW9ucy5yZXF1ZXN0U2lnbkZuIClcblx0XHRcdEBfc2lnbiA9IEBvcHRpb25zLnJlcXVlc3RTaWduRm5cblx0XHRlbHNlXG5cdFx0XHRAX3NpZ24gPSBAX2RlZmF1bHRSZXF1ZXN0U2lnbmF0dXJlXG5cblx0XHRfaW5wQWNjZXB0ID0gQHNlbC5nZXRBdHRyaWJ1dGUoIFwiYWNjZXB0XCIgKVxuXHRcdGlmIEBvcHRpb25zLmFjY2VwdD8gb3IgX2lucEFjY2VwdD9cblx0XHRcdF9odG1sID0gX2lucEFjY2VwdD8uc3BsaXQoIFwiLFwiICkgb3IgW11cblx0XHRcdF9vcHQgPSBAb3B0aW9ucy5hY2NlcHQ/LnNwbGl0KCBcIixcIiApIG9yIFtdXG5cdFx0XHRpZiBfaHRtbD8ubGVuZ3RoXG5cdFx0XHRcdEBvcHRpb25zLmFjY2VwdCA9IF9odG1sXG5cdFx0XHRlbHNlIGlmIF9vcHQ/Lmxlbmd0aFxuXHRcdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJhY2NlcHRcIiwgQG9wdGlvbnMuYWNjZXB0IClcblx0XHRcdEBvcHRpb25zLmFjY2VwdFJ1bGVzID0gQGdlbmVyYXRlQWNjZXB0UnVsZXMoIEBvcHRpb25zLmFjY2VwdCApXG5cblx0XHRAaW5pdGlhbGl6ZSgpXG5cdFx0QGlkeF9zdGFydGVkID0gMFxuXHRcdEBpZHhfZmluaXNoZWQgPSAwXG5cblx0XHRAZWwuZC5kYXRhKCBcIm1lZGlhYXBpY2xpZW50XCIsIEAgKVxuXHRcdHJldHVyblxuXG5cdGdlbmVyYXRlQWNjZXB0UnVsZXM6ICggYWNjZXB0ICktPlxuXHRcdF9ydWxlcyA9IFtdXG5cblx0XHRmb3IgX3J1bGUgaW4gYWNjZXB0XG5cdFx0XHRpZiBfcnVsZS5pbmRleE9mKCBcIi9cIiApID49IDBcblx0XHRcdFx0X3J1bGVzLnB1c2ggKCAtPlxuXHRcdFx0XHRcdF9yZWdleCA9IG5ldyBSZWdFeHAoIFwiI3tfcnVsZS5yZXBsYWNlKCBcIipcIiwgXCJcXFxcdytcIiApfSRcIiwgXCJpXCIgKVxuXHRcdFx0XHRcdHJldHVybiAoIGZpbGUgKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3JlZ2V4LnRlc3QoIGZpbGUudHlwZSApXG5cdFx0XHRcdFx0KSgpXG5cdFx0XHRlbHNlIGlmIF9ydWxlLmluZGV4T2YoIFwiLlwiICkgPj0gMFxuXHRcdFx0XHRfcnVsZXMucHVzaCAoIC0+XG5cdFx0XHRcdFx0X3JlZ2V4ID0gbmV3IFJlZ0V4cCggXCIje19ydWxlLnJlcGxhY2UoIFwiLlwiLCBcIlxcXFwuXCIgKX0kXCIsIFwiaVwiIClcblx0XHRcdFx0XHRyZXR1cm4gKCBmaWxlICktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIF9yZWdleC50ZXN0KCBmaWxlLm5hbWUgKVxuXHRcdFx0XHRcdCkoKVxuXHRcdFx0ZWxzZSBpZiBfcnVsZSBpcyBcIipcIlxuXHRcdFx0XHRfcnVsZXMucHVzaCAoKCBmaWxlICktPiB0cnVlIClcblx0XHRyZXR1cm4gX3J1bGVzXG5cblx0aW5pdGlhbGl6ZTogPT5cblx0XHRpZiB3aW5kb3cuRmlsZSBhbmQgd2luZG93LkZpbGVMaXN0IGFuZCB3aW5kb3cuRmlsZVJlYWRlclxuXHRcdFx0QHNlbC5kLm9uKCBcImNoYW5nZVwiLCBAb25TZWxlY3QgKVxuXHRcdFx0QHVzZUZpbGVBUEkgPSB0cnVlXG5cdFx0XHRAaW5pdEZpbGVBUEkoKVxuXHRcdGVsc2Vcblx0XHRcdCMgVE9ETyBpbXBsZW1lbnQgSUU5IEZhbGxiYWNrXHRcdFxuXHRcdHJldHVyblxuXG5cdGluaXRGaWxlQVBJOiA9PlxuXHRcdF94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXHRcdFxuXHRcdGlmIF94aHI/LnVwbG9hZFxuXHRcdFx0QGVsLm9uZHJhZ292ZXIgPSBAb25Ib3ZlclxuXHRcdFx0QGVsLm9uZHJhZ2xlYXZlID0gQG9uTGVhdmVcblx0XHRcdEBlbC5vbmRyb3AgPSBAb25TZWxlY3Rcblx0XHRcdFxuXHRcdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc2Ryb3BwYWJsZSApXG5cdFx0ZWxzZVxuXHRcdHJldHVyblxuXG5cdG9uU2VsZWN0OiAoIGV2bnQgKT0+XG5cdFx0ZXZudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0aWYgbm90IEBlbmFibGVkXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBAb3B0aW9ucy5tYXhjb3VudCA8PSAwIG9yIEBpZHhfc3RhcnRlZCA8IEBvcHRpb25zLm1heGNvdW50XG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc3Byb2Nlc3MgKVxuXG5cdFx0XHRmaWxlcyA9IGV2bnQudGFyZ2V0Py5maWxlcyBvciBldm50Lm9yaWdpbmFsRXZlbnQ/LnRhcmdldD8uZmlsZXMgb3IgZXZudC5kYXRhVHJhbnNmZXI/LmZpbGVzIG9yIGV2bnQub3JpZ2luYWxFdmVudD8uZGF0YVRyYW5zZmVyPy5maWxlc1xuXHRcdFx0QHVwbG9hZCggZmlsZXMgKVxuXHRcdGVsc2Vcblx0XHRcdEBlbC5kLnJlbW92ZUNsYXNzKCBAb3B0aW9ucy5jc3Nob3ZlciApXG5cdFx0XHRAZGlzYWJsZSgpXG5cdFx0cmV0dXJuXG5cblx0b25Ib3ZlcjogKCBldm50ICk9PlxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0QGVtaXQoIFwiZmlsZS5ob3ZlclwiIClcblx0XHRAd2l0aGluX2VudGVyID0gdHJ1ZVxuXHRcdHNldFRpbWVvdXQoICggPT4gQHdpdGhpbl9lbnRlciA9IGZhbHNlICksIDApXG5cdFx0QGVsLmQuYWRkQ2xhc3MoIEBvcHRpb25zLmNzc2hvdmVyIClcblx0XHRyZXR1cm5cblxuXHRvbk92ZXI6ICggZXZudCApPT5cblx0XHRldm50LnByZXZlbnREZWZhdWx0KClcblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdHJldHVyblxuXG5cdG9uTGVhdmU6ICggZXZudCApPT5cblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBAd2l0aGluX2VudGVyXG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdHJldHVyblxuXG5cdHVwbG9hZDogKCBmaWxlcyApPT5cblx0XHRpZiBAdXNlRmlsZUFQSVxuXHRcdFx0Zm9yIGZpbGUsIGlkeCBpbiBmaWxlcyB3aGVuIEBlbmFibGVkXG5cdFx0XHRcdGlmIEBvcHRpb25zLm1heGNvdW50IDw9IDAgb3IgQGlkeF9zdGFydGVkIDwgQG9wdGlvbnMubWF4Y291bnRcblx0XHRcdFx0XHRAaWR4X3N0YXJ0ZWQrK1xuXHRcdFx0XHRcdG5ldyBGaWxlKCBmaWxlLCBAaWR4X3N0YXJ0ZWQsIEAsIEBvcHRpb25zIClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBkaXNhYmxlKClcblx0XHRyZXR1cm5cblx0XG5cdGRlbGV0ZUZpbGU6ICgga2V5LCByZXYsIGNiICk9PlxuXHRcdFxuXHRcdF91cmwgPSBAb3B0aW9ucy5ob3N0ICsgQG9wdGlvbnMuZG9tYWluICsgXCIvI3trZXl9P3JldmlzaW9uPSN7cmV2fVwiXG5cdFx0XG5cdFx0QHNpZ24geyB1cmw6IF91cmwsIGtleToga2V5IH0sICggZXJyLCBzdXJsLCBzaWduYXR1cmUgKT0+XG5cdFx0XHRpZiBlcnJcblx0XHRcdFx0Y2IoIGVyciApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcblx0XHRcdHhocigge1xuXHRcdFx0XHR1cmw6IHN1cmxcblx0XHRcdFx0bWV0aG9kOiBcIkRFTEVURVwiXG5cdFx0XHR9LCAoIGVyciwgcmVzcCwgYm9keSApPT5cblx0XHRcdFx0aWYgZXJyXG5cdFx0XHRcdFx0Y2IoIGVyciApXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGNiKCBudWxsLCBib2R5IClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQpXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm5cblx0XG5cdHNpZ246ICggb3B0LCBjYiApPT5cblx0XHRfb3B0ID0gdXRpbHMuYXNzaWduKCB7fSwgeyBkb21haW46IEBvcHRpb25zLmRvbWFpbiwgYWNjZXNza2V5OiBAb3B0aW9ucy5hY2Nlc3NrZXksIGpzb246IG51bGwsIHVybDogbnVsbCwga2V5OiBudWxsIH0sIG9wdCApXG5cdFx0aWYgbm90IF9vcHQudXJsPy5sZW5ndGhcblx0XHRcdEBfZXJyb3IoIGNiLCBcImludmFsaWQtc2lnbi11cmxcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBub3QgX29wdC5rZXk/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggY2IsIFwiaW52YWxpZC1zaWduLWtleVwiIClcblx0XHRcdHJldHVyblxuXHRcdFx0XG5cdFx0QF9zaWduIF9vcHQuZG9tYWluLCBfb3B0LmFjY2Vzc2tleSwgX29wdC51cmwsIF9vcHQua2V5LCBfb3B0Lmpzb24sICggZXJyLCBzaWduYXR1cmUgKS0+XG5cdFx0XHRpZiBlcnJcblx0XHRcdFx0Y2IoIGVyciApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0X3N1cmwgPSBfb3B0LnVybFxuXHRcdFx0aWYgX3N1cmwuaW5kZXhPZiggXCI/XCIgKSA+PSAwXG5cdFx0XHRcdF9zdXJsICs9IFwiJlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF9zdXJsICs9IFwiP1wiXG5cdFx0XHRfc3VybCArPSAoIFwic2lnbmF0dXJlPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KCBzaWduYXR1cmUgKSApXG5cdFx0XHRjYiggbnVsbCwgX3N1cmwsIHNpZ25hdHVyZSApXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm5cblx0X2RlZmF1bHRSZXF1ZXN0U2lnbmF0dXJlOiAoIGRvbWFpbiwgYWNjZXNza2V5LCBtYWRpYWFwaXVybCwga2V5LCBqc29uLCBjYiApPT5cblx0XHRcblx0XHRfdXJsID0gQG9wdGlvbnMuaG9zdCArIGRvbWFpbiArIFwiL3NpZ24vXCIgKyBhY2Nlc3NrZXlcblx0XHRcblx0XHRfeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG5cdFx0XG5cdFx0ZGF0YSA9IG5ldyBGb3JtRGF0YSgpXG5cdFx0ZGF0YS5hcHBlbmQoIFwidXJsXCIsIG1hZGlhYXBpdXJsIClcblx0XHRkYXRhLmFwcGVuZCggXCJrZXlcIiwga2V5IClcblx0XHRpZiBqc29uP1xuXHRcdFx0ZGF0YS5hcHBlbmQoIFwianNvblwiLCBKU09OLnN0cmluZ2lmeSgganNvbiApIClcblx0XHR4aHIoIHtcblx0XHRcdHhocjogX3hoclxuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIlxuXHRcdFx0dXJsOiBfdXJsXG5cdFx0XHRib2R5OiBkYXRhXG5cdFx0fSwgKCBlcnIsIHJlc3AsIHNpZ25hdHVyZSApLT5cblx0XHRcdGlmIGVyclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZ2V0IHNpZ24gZXJyb3JcIiwgZXJyXG5cdFx0XHRcdGNiKCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNiKCBudWxsLCBzaWduYXR1cmUgKVxuXHRcdFx0cmV0dXJuXG5cdFx0KVxuXHRcdHJldHVyblxuXG5cdGFib3J0QWxsOiA9PlxuXHRcdEBlbWl0IFwiYWJvcnRBbGxcIlxuXHRcdHJldHVyblxuXG5cdGRpc2FibGU6ID0+XG5cdFx0QHNlbC5zZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiIClcblx0XHRAZWwuZC5hZGRDbGFzcyggQG9wdGlvbnMuY3NzZGlzYWJsZWQgKVxuXHRcdEBlbmFibGVkID0gZmFsc2Vcblx0XHRyZXR1cm5cblxuXHRlbmFibGU6ID0+XG5cdFx0QHNlbC5yZW1vdmVBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApXG5cdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc2Rpc2FibGVkIClcblx0XHRAZW5hYmxlZCA9IHRydWVcblx0XHRyZXR1cm5cblxuXHRmaWxlRG9uZTogKCBmaWxlICk9PlxuXHRcdEBpZHhfZmluaXNoZWQrK1xuXHRcdEBfY2hlY2tGaW5pc2goKVxuXHRcdHJldHVyblxuXG5cdGZpbGVFcnJvcjogKCBmaWxlLCBlcnIgKT0+XG5cdFx0Y29uc29sZS5lcnJvciBcIkZJTEUtRVJST1JcIiwgZmlsZSwgZXJyXG5cdFx0QGlkeF9maW5pc2hlZCsrXG5cdFx0QF9jaGVja0ZpbmlzaCgpXG5cdFx0cmV0dXJuXG5cblx0ZmlsZU5ldzogKCBmaWxlICk9PlxuXHRcdGlmIEByZXM/XG5cdFx0XHRfZmlsZXZpZXcgPSBuZXcgRmlsZVZpZXcoIGZpbGUsIEAsIEBvcHRpb25zIClcblx0XHRcdEByZXMuZC5hcHBlbmQoIF9maWxldmlldy5yZW5kZXIoKSApXG5cdFx0cmV0dXJuXG5cblx0b25GaW5pc2g6ID0+XG5cdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc3Byb2Nlc3MgKVxuXHRcdHJldHVyblxuXG5cdF9jaGVja0ZpbmlzaDogPT5cblx0XHRpZiBAaWR4X2ZpbmlzaGVkID49IEBpZHhfc3RhcnRlZFxuXHRcdFx0QGVtaXQoIFwiZmluaXNoXCIgKVxuXHRcdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPiAwIGFuZCBAaWR4X3N0YXJ0ZWQgPj0gQG9wdGlvbnMubWF4Y291bnRcblx0XHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXG5cdF92YWxpZGF0ZUVsOiAoIGVsLCB0eXBlICk9PlxuXHRcdGlmIG5vdCBlbD9cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy0je3R5cGV9LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRzd2l0Y2ggdHlwZW9mIGVsXG5cdFx0XHR3aGVuIFwic3RyaW5nXCJcblx0XHRcdFx0X2VsID0gZG9tKCBlbCwgbnVsbCwgdHJ1ZSApXG5cdFx0XHR3aGVuIFwib2JqZWN0XCJcblx0XHRcdFx0aWYgZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdF9lbCA9IGRvbS5kb21lbCggZWwgKVxuXG5cdFx0aWYgbm90IF9lbD9cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC0je3R5cGV9LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZXR1cm4gX2VsXG5cblx0XG5cblx0RVJST1JTOlxuXHRcdFwibWlzc2luZy1zZWxlY3QtZWxcIjogXCJNaXNzaW5nIHNlbGVjdCBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLXNlbGVjdC1lbFwiOiBcIkludmFsaWQgc2VsZWN0IGVsZW1lbnQuIFBsZWFzZSBkZWZpbmUgYSB2YWxpZCBlbGVtZW50IGFzIGEgU2VsZWN0b3IsIERPTS1ub2RlXCJcblx0XHRcIm1pc3NpbmctZHJhZy1lbFwiOiBcIk1pc3NpbmcgZHJhZyBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLWRyYWctZWxcIjogXCJJbnZhbGlkIGRyYWcgZWxlbWVudC4gUGxlYXNlIGRlZmluZSBhIHZhbGlkIGVsZW1lbnQgYXMgYSBTZWxlY3RvciwgRE9NLW5vZGVcIlxuXHRcdFwibWlzc2luZy1ob3N0XCI6IFwiTWlzc2luZyBob3N0LiBZb3UgaGF2ZSB0byBkZWZpZW4gYSBob3N0IGFzIHVybCBzdGFydGluZyB3aXRoIGBodHRwOi8vYCBvciBgaHR0cHM6Ly9gLlwiXG5cdFx0XCJpbnZhbGlkLWhvc3RcIjogXCJJbnZhbGlkIGhvc3QuIFlvdSBoYXZlIHRvIGRlZmllbiBhIGhvc3QgYXMgdXJsIHN0YXJ0aW5nIHdpdGggYGh0dHA6Ly9gIG9yIGBodHRwczovL2AuXCJcblx0XHRcIm1pc3NpbmctZG9tYWluXCI6IFwiTWlzc2luZyBkb21haW4uIFlvdSBoYXZlIHRvIGRlZmluZSBhIGRvbWFpbi5cIlxuXHRcdFwibWlzc2luZy1hY2Nlc3NrZXlcIjogXCJNaXNzaW5nIGFjY2Vzc2tleS4gWW91IGhhdmUgdG8gZGVmaW5lIGEgYWNjZXNza2V5LlwiXG5cdFx0XCJtaXNzaW5nLWtleXByZWZpeFwiOiBcIk1pc3Npbmcga2V5cHJlZml4LiBZb3UgaGF2ZSB0byBkZWZpbmUgYSBrZXlwcmVmaXguXCJcblx0XHRcImludmFsaWQtc2lnbi11cmxcIjogXCJwbGVhc2UgZGVmaW5lIGEgYHVybGAgdG8gc2lnbiB0aGUgcmVxdWVzdFwiXG5cdFx0XCJpbnZhbGlkLXNpZ24ta2V5XCI6IFwicGxlYXNlIGRlZmluZSBhIGBrZXlgIHRvIHNpZ24gdGhlIHJlcXVlc3RcIlxuXHRcdFwiaW52YWxpZC10dGxcIjogXCJmb3IgdGhlIG9wdGlvbiBgdHRsYCBvbmx5IGEgcG9zaXRpdiBudW1iZXIgaXMgYWxsb3dlZFwiXG5cdFx0XCJpbnZhbGlkLXRhZ3NcIjogXCJmb3IgdGhlIG9wdGlvbiBgdGFnc2Agb25seSBhbiBhcnJheSBvZiBzdHJpbmdzIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1wcm9wZXJ0aWVzXCI6IFwiZm9yIHRoZSBvcHRpb24gYHByb3BlcnRpZXNgIG9ubHkgYW4gb2JqZWN0IGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1jb250ZW50LWRpc3Bvc2l0aW9uXCI6IFwiZm9yIHRoZSBvcHRpb24gYGNvbnRlbnQtZGlzcG9zaXRpb25gIG9ubHkgYW4gc3RyaW5nIGxpa2U6IGBhdHRhY2htZW50OyBmaWxlbmFtZT1mcmllbmRseV9maWxlbmFtZS5wZGZgIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC1hY2xcIjogXCJ0aGUgb3B0aW9uIGFjbCBvbmx5IGFjY2VwdHMgdGhlIHN0cmluZyBgcHVibGljLXJlYWRgIG9yIGBhdXRoZW50aWNhdGVkLXJlYWRgXCJcblxuQ2xpZW50LmRlZmF1bHRzID0gKCBvcHRpb25zICktPlxuXHRmb3IgX2ssIF92IG9mIG9wdGlvbnMgd2hlbiBfayBpbiBfZGVmYXVrdEtleXNcblx0XHRfZGVmYXVsdHNbIF9rIF0gPSBfdlxuXHRyZXR1cm4gX2RlZmF1bHRzXG5cdFxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRcbiIsInhociA9IHJlcXVpcmUoIFwieGhyXCIgKVxuXG5jbGFzcyBGaWxlIGV4dGVuZHMgcmVxdWlyZShcIi4vYmFzZVwiKVxuXG5cdHN0YXRlczogWyBcIm5ld1wiLCBcInN0YXJ0XCIsIFwic2lnbmVkXCIsIFwidXBsb2FkXCIsIFwicHJvZ3Jlc3NcIiwgXCJkb25lXCIsIFwiaW52YWxpZFwiLCBcImVycm9yXCIsIFwiYWJvcnRlZFwiIF1cblxuXHRjb25zdHJ1Y3RvcjogKCBAZmlsZSwgQGlkeCwgQGNsaWVudCwgQG9wdGlvbnMgKS0+XG5cdFx0c3VwZXJcblx0XHRAc3RhdGUgPSAwXG5cdFx0QHZhbGlkYXRpb24gPSBbXVxuXG5cdFx0QGtleSA9IEBvcHRpb25zLmtleXByZWZpeCArIFwiX1wiICsgQGdldE5hbWUoKS5yZXBsYWNlKCBAX3JneEZpbGUyS2V5LCBcIlwiICkgKyBcIl9cIiArIEBfbm93KCkgKyBcIl9cIiArIEBpZHhcblxuXHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLm5ld1wiLCBAIClcblx0XHRAY2xpZW50Lm9uIFwiYWJvcnRBbGxcIiwgQGFib3J0XG5cblx0XHRAb24oIFwic3RhcnRcIiwgQHN0YXJ0IClcblx0XHRAb24oIFwic2lnbmVkXCIsIEBfdXBsb2FkIClcblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5rZXlwcmVmaXg/Lmxlbmd0aFxuXHRcdFx0QG9wdGlvbnMua2V5cHJlZml4ID0gXCJjbGllbnR1cGxvYWRcIlxuXG5cdFx0aWYgbm90IEBvcHRpb25zLmF1dG9zdGFydD9cblx0XHRcdEBvcHRpb25zLmF1dG9zdGFydCA9IHRydWVcblxuXHRcdEBfdmFsaWRhdGUoKVxuXG5cdFx0aWYgQG9wdGlvbnMuYXV0b3N0YXJ0XG5cdFx0XHRAZW1pdCBcInN0YXJ0XCJcblx0XHRyZXR1cm5cblxuXHRzdGFydDogPT5cblx0XHRpZiBAc3RhdGUgPD0gMFxuXHRcdFx0QF9zZXRTdGF0ZSggMSApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS51cGxvYWRcIiwgQCApXG5cdFx0XHRAX3NpZ24oKVxuXHRcdHJldHVybiBAXG5cdFxuXHRhYm9ydDogPT5cblx0XHRpZiBAc3RhdGUgPD0gNFxuXHRcdFx0QF9zZXRTdGF0ZSggOCApXG5cdFx0XHRAcmVxdWVzdFVwbG9hZD8uYWJvcnQoKVxuXHRcdFx0QGVtaXQgXCJhYm9ydGVkXCJcblx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmFib3J0ZWRcIiwgQCApXG5cdFx0cmV0dXJuIEBcblx0XG5cdGdldFN0YXRlOiA9PlxuXHRcdHJldHVybiBAc3RhdGVzWyBAc3RhdGUgXVxuXG5cdGdldFJlc3VsdDogPT5cblx0XHRpZiBAc3RhdGUgaXMgNSBhbmQgQGRhdGE/XG5cdFx0XHRyZXR1cm4geyB1cmw6IEBkYXRhLnVybCwgaGFzaDogQGRhdGEuZmlsZWhhc2gsIGtleTogQGRhdGEua2V5LCB0eXBlOiBAZGF0YS5jb250ZW50X3R5cGUgfVxuXHRcdHJldHVybiBudWxsXG5cblx0Z2V0UHJvZ3Jlc3M6ICggYXNGYWN0b3IgPSBmYWxzZSApPT5cblx0XHRpZiBAc3RhdGUgPCA0XG5cdFx0XHRfZmFjID0gMFxuXHRcdGVsc2UgaWYgQHN0YXRlID4gNFxuXHRcdFx0X2ZhYyA9IDFcblx0XHRlbHNlXG5cdFx0XHRfZmFjID0gQHByb2dyZXNzU3RhdGVcblxuXHRcdGlmIGFzRmFjdG9yXG5cdFx0XHRyZXR1cm4gX2ZhY1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKCBfZmFjICogMTAwIClcblxuXHRnZXROYW1lOiA9PlxuXHRcdHJldHVybiBAZmlsZS5uYW1lXG5cblx0Z2V0VHlwZTogPT5cblx0XHRyZXR1cm4gQGZpbGUudHlwZVxuXG5cdGdldERhdGE6ID0+XG5cdFx0X3JldCA9XG5cdFx0XHRuYW1lOiBAY2xpZW50LmZvcm1uYW1lXG5cdFx0XHRmaWxlbmFtZTogQGdldE5hbWUoKVxuXHRcdFx0aWR4OiBAaWR4XG5cdFx0XHRzdGF0ZTogQGdldFN0YXRlKClcblx0XHRcdHByb2dyZXNzOiBAZ2V0UHJvZ3Jlc3MoKVxuXHRcdFx0cmVzdWx0OiBAZ2V0UmVzdWx0KClcblx0XHRcdG9wdGlvbnM6IEBvcHRpb25zXG5cdFx0XHRpbnZhbGlkX3JlYXNvbjogQHZhbGlkYXRpb25cblx0XHRcdGVycm9yOiBAZXJyb3Jcblx0XHRyZXR1cm4gX3JldFxuXG5cdF9zZXRTdGF0ZTogKCBzdGF0ZSApPT5cblx0XHRpZiBzdGF0ZSA+IEBzdGF0ZVxuXHRcdFx0QHN0YXRlID0gc3RhdGVcblx0XHRcdEBlbWl0KCBcInN0YXRlXCIsIEBnZXRTdGF0ZSgpIClcblx0XHRyZXR1cm4gc3RhdGVcblxuXHRfdmFsaWRhdGU6ID0+XG5cdFx0X3NpemUgPSBAZmlsZS5zaXplIC8gMTAyNFxuXHRcdGlmIEBvcHRpb25zLm1heHNpemUgPiAwIGFuZCBAb3B0aW9ucy5tYXhzaXplIDwgX3NpemVcblx0XHRcdEB2YWxpZGF0aW9uLnB1c2ggXCJtYXhzaXplXCJcblxuXHRcdGlmIEBvcHRpb25zLmFjY2VwdFJ1bGVzPy5sZW5ndGggYW5kIG5vdCBAX3Rlc3RNaW1lKCBAb3B0aW9ucy5hY2NlcHRSdWxlcyApXG5cdFx0XHRAdmFsaWRhdGlvbi5wdXNoIFwiYWNjZXB0XCJcblxuXHRcdGlmIEB2YWxpZGF0aW9uLmxlbmd0aFxuXHRcdFx0QF9zZXRTdGF0ZSggNiApXG5cdFx0XHRAZW1pdCggXCJpbnZhbGlkXCIsIEB2YWxpZGF0aW9uIClcblx0XHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmludmFsaWRcIiwgQCwgQHZhbGlkYXRpb24gKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuXHRfdGVzdE1pbWU6ICggYWNjZXB0UnVsZXMgKT0+XG5cdFx0Zm9yIF9ydWxlIGluIGFjY2VwdFJ1bGVzXG5cdFx0XHRpZiBfcnVsZSggQGZpbGUgKVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cdF9ub3c6IC0+XG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIERhdGUubm93KCkgLyAxMDAwIClcblxuXHRfcmd4RmlsZTJLZXk6IC8oW15BLVphLXowLTldKS9pZ1xuXHRfc2lnbjogPT5cblx0XHRfbmFtZSA9IEBnZXROYW1lKClcblx0XHRfY29udGVudF90eXBlID0gQGdldFR5cGUoKVxuXHRcdGlmIEBzdGF0ZSA+IDFcblx0XHRcdHJldHVyblxuXHRcdEB1cmwgPSBAb3B0aW9ucy5ob3N0ICsgQG9wdGlvbnMuZG9tYWluICsgXCIvXCIgKyBAa2V5XG5cdFx0QGpzb24gPVxuXHRcdFx0YmxvYjogdHJ1ZVxuXHRcdFx0YWNsOiBAb3B0aW9ucy5hY2xcblx0XHRcdHR0bDogQG9wdGlvbnMudHRsXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRmaWxlbmFtZTogX25hbWVcblxuXHRcdEBqc29uLndpZHRoID0gQG9wdGlvbnMud2lkdGggaWYgQG9wdGlvbnMud2lkdGg/XG5cdFx0QGpzb24uaGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0IGlmIEBvcHRpb25zLmhlaWdodD9cblxuXHRcdEBqc29uLnRhZ3MgPSBAb3B0aW9ucy50YWdzIGlmIEBvcHRpb25zLnRhZ3M/XG5cdFx0QGpzb24ucHJvcGVydGllcyA9IEBvcHRpb25zLnByb3BlcnRpZXMgaWYgQG9wdGlvbnMucHJvcGVydGllcz9cblx0XHRAanNvblsgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSA9IEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdIGlmIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdP1xuXG5cdFx0QGpzb24uY29udGVudF90eXBlID0gX2NvbnRlbnRfdHlwZSBpZiBfY29udGVudF90eXBlPy5sZW5ndGhcblxuXHRcdEBlbWl0KCBcImNvbnRlbnRcIiwgQGtleSwgQGpzb24gKVxuXHRcdEBjbGllbnQuZW1pdCggXCJmaWxlLmNvbnRlbnRcIiwgQCwgQGtleSwgQGpzb24gKVxuXHRcdFxuXHRcdEBjbGllbnQuc2lnbi5jYWxsIEAsIHsgdXJsOiBAdXJsLCBrZXk6IEBrZXksIGpzb246IEBqc29uIH0sICggZXJyLCBAdXJsICk9PlxuXHRcdFx0aWYgZXJyXG5cdFx0XHRcdEBlcnJvciA9IGVyclxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QGVtaXQoIFwiZXJyb3JcIiwgZXJyIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgZXJyIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0QF9zZXRTdGF0ZSggMiApXG5cdFx0XHRAZW1pdCggXCJzaWduZWRcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm5cblxuXHRfdXBsb2FkOiA9PlxuXHRcdGlmIEBzdGF0ZSA+IDJcblx0XHRcdHJldHVyblxuXHRcdEBfc2V0U3RhdGUoIDMgKVxuXHRcdGRhdGEgPSBuZXcgRm9ybURhdGEoKVxuXHRcdGRhdGEuYXBwZW5kKCBcIkpTT05cIiwgSlNPTi5zdHJpbmdpZnkoIEBqc29uICkgKVxuXHRcdGRhdGEuYXBwZW5kKCBcImJsb2JcIiwgQGZpbGUgKVxuXHRcdFxuXHRcdF94aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRfeGhyLnVwbG9hZD8uYWRkRXZlbnRMaXN0ZW5lciggXCJwcm9ncmVzc1wiLCBAX2hhbmRsZVByb2dyZXNzKCksIGZhbHNlIClcblx0XHRfeGhyLmFkZEV2ZW50TGlzdGVuZXIoIFwicHJvZ3Jlc3NcIiwgQF9oYW5kbGVQcm9ncmVzcygpLCBmYWxzZSApXG5cdFx0X3hoci5faXNmaWxlID0gdHJ1ZVxuXHRcdFxuXHRcdEByZXF1ZXN0VXBsb2FkID0geGhyKCB7XG5cdFx0XHR4aHI6IF94aHJcblx0XHRcdHVybDogQHVybFxuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIlxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0sICggZXJyLCByZXNwLCBib2R5ICk9PlxuXHRcdFx0I2NvbnNvbGUubG9nIFwicmVxdWVzdFVwbG9hZFwiLCBlcnIsIHJlc3AsIGJvZHlcblx0XHRcdGlmIGVyclxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IGVyclxuXHRcdFx0XHRAZW1pdCggXCJlcnJvclwiLCBlcnIgKVxuXHRcdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5lcnJvclwiLCBALCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XG5cdFx0XHRfZGF0YSA9IEpTT04ucGFyc2UoIGJvZHkgKVxuXHRcdFx0aWYgcmVzcC5zdGF0dXNDb2RlID49IDMwMFxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IF9kYXRhXG5cdFx0XHRcdEBlbWl0KCBcImVycm9yXCIsIF9kYXRhIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgX2RhdGEgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFxuXHRcdFx0QGRhdGEgPSBfZGF0YT8ucm93c1sgMCBdXG5cdFx0XHRAcHJvZ3Jlc3NTdGF0ZSA9IDFcblx0XHRcdEBfc2V0U3RhdGUoIDUgKVxuXHRcdFx0QGVtaXQoIFwiZG9uZVwiLCBAZGF0YSApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5kb25lXCIsIEAgKVxuXHRcdFx0cmV0dXJuXG5cdFx0KVxuXHRcdHJldHVyblxuXG5cdF9oYW5kbGVQcm9ncmVzczogPT5cblx0XHRyZXR1cm4gKCBldm50ICk9PlxuXHRcdFx0aWYgbm90IGV2bnQudGFyZ2V0Lm1ldGhvZD9cblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSBldm50LmxvYWRlZC9ldm50LnRvdGFsXG5cdFx0XHRcdEBfc2V0U3RhdGUoIDQgKVxuXHRcdFx0XHRAZW1pdCggXCJwcm9ncmVzc1wiLCBAZ2V0UHJvZ3Jlc3MoKSwgZXZudCApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0cmV0dXJuXG5cdFx0XG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVcbiIsImRvbSA9IHJlcXVpcmUoIFwiZG9tZWxcIiApXG5cbmNsYXNzIEZpbGVWaWV3IGV4dGVuZHMgcmVxdWlyZShcIi4vYmFzZVwiKVxuXHRjb25zdHJ1Y3RvcjogKCBAZmlsZU9iaiwgQGNsaWVudCwgQG9wdGlvbnMgKS0+XG5cdFx0c3VwZXJcblx0XHRcblx0XHRpZiBAb3B0aW9ucy5yZXN1bHRUZW1wbGF0ZUZuPyBhbmQgdHlwZW9mIEBvcHRpb25zLnJlc3VsdFRlbXBsYXRlRm4gaXMgXCJmdW5jdGlvblwiXG5cdFx0XHRAdGVtcGxhdGUgPSBAb3B0aW9ucy5yZXN1bHRUZW1wbGF0ZUZuXG5cdFx0ZWxzZVxuXHRcdFx0QHRlbXBsYXRlID0gQF9kZWZhdWx0VGVtcGxhdGVcblx0XHRcblx0XHRpZiBAb3B0aW9ucy5jc3NmaWxlZWxlbWVudD9cblx0XHRcdEByZXN1bHRDbGFzcyA9IEBvcHRpb25zLmNzc2ZpbGVlbGVtZW50XG5cdFx0ZWxzZVxuXHRcdFx0QHJlc3VsdENsYXNzID0gXCJmaWxlIGNvbC1zbS02IGNvbC1tZC00XCJcblxuXHRcdEBmaWxlT2JqLm9uKCBcInByb2dyZXNzXCIsIEB1cGRhdGUoKSApXG5cdFx0QGZpbGVPYmoub24oIFwiZG9uZVwiLCBAdXBkYXRlKCkgKVxuXHRcdEBmaWxlT2JqLm9uKCBcImVycm9yXCIsIEB1cGRhdGUoKSApXG5cdFx0QGZpbGVPYmoub24oIFwiaW52YWxpZFwiLCBAdXBkYXRlKCkgKVxuXHRcdHJldHVyblxuXG5cdHJlbmRlcjogPT5cblx0XHRAZWwgPSBkb20uY3JlYXRlKCBcImRpdlwiLCB7IGNsYXNzOiBAcmVzdWx0Q2xhc3MgfSApXG5cdFx0QGVsLmlubmVySFRNTCA9IEB0ZW1wbGF0ZSggQGZpbGVPYmouZ2V0RGF0YSgpIClcblx0XHRyZXR1cm4gQGVsXG5cblx0dXBkYXRlOiA9PlxuXHRcdHJldHVybiAoIGV2bnQgKT0+XG5cdFx0XHRAZWwuaW5uZXJIVE1MID0gQHRlbXBsYXRlKCBAZmlsZU9iai5nZXREYXRhKCkgKVxuXHRcdFx0cmV0dXJuXG5cblx0X2RlZmF1bHRUZW1wbGF0ZTogKCBkYXRhICktPlxuXHRcdF9odG1sID0gXCJcIlwiXG5cdDxkaXYgY2xhc3M9XCJ0aHVtYm5haWwgc3RhdGUtI3sgZGF0YS5zdGF0ZSB9XCI+XG5cdFx0PGI+I3sgZGF0YS5maWxlbmFtZX08L2I+XG5cdFx0XCJcIlwiXG5cdFx0c3dpdGNoIGRhdGEuc3RhdGVcblx0XHRcdHdoZW4gXCJwcm9ncmVzc1wiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIiN7ZGF0YS5wcm9ncmVzc31cIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAje2RhdGEucHJvZ3Jlc3N9JTtcIj5cblx0XHRcdFx0XHRcdDxzcGFuPiN7ZGF0YS5wcm9ncmVzc30lPC9zcGFuPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHR3aGVuIFwiZG9uZVwiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzdWx0XCI+XG5cdFx0XHRcdFx0PGEgaHJlZj1cIiN7ZGF0YS5yZXN1bHQudXJsfVwiIHRhcmdldD1cIl9uZXdcIj5GZXJ0aWchICggI3tkYXRhLnJlc3VsdC5rZXl9ICk8L2E+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0XHRmb3IgX2ssIF92IG9mIGRhdGEucmVzdWx0XG5cdFx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCIje2RhdGEubmFtZX1fI3sgZGF0YS5pZHggfV8je19rfVwiIHZhbHVlPVwiI3tfdn1cIj5cblx0XHRcdFx0XHRcIlwiXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdHdoZW4gXCJpbnZhbGlkXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXN1bHRcIj5cblx0XHRcdFx0XHQ8Yj5JbnZhbGlkPC9iPlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdFx0Zm9yIF9yZWFzb24gaW4gZGF0YS5pbnZhbGlkX3JlYXNvblxuXHRcdFx0XHRcdHN3aXRjaCBfcmVhc29uXG5cdFx0XHRcdFx0XHR3aGVuIFwibWF4c2l6ZVwiXG5cdFx0XHRcdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPkZpbGUgdG9vIGJpZy4gT25seSBmaWxlcyB1bnRpbCAje2RhdGEub3B0aW9ucy5tYXhzaXplfWtiIGFyZSBhbGxvd2VkLjwvZGl2PlwiXG5cdFx0XHRcdFx0XHR3aGVuIFwiYWNjZXB0XCJcblx0XHRcdFx0XHRcdFx0X2h0bWwgKz0gXCI8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1lcnJvclxcXCI+V3JvbmcgdHlwZS4gT25seSBmaWxlcyBvZiB0eXBlICN7ZGF0YS5vcHRpb25zLmFjY2VwdC5qb2luKCBcIiwgXCIgKX0gYXJlIGFsbG93ZWQuPC9kaXY+XCJcblxuXHRcdFx0XHQgX2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdHdoZW4gXCJlcnJvclwiXG5cdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPkFuIEVycm9yIG9jY3VyZWQuPC9kaXY+XCJcblxuXHRcdFx0d2hlbiBcImFib3J0ZWRcIlxuXHRcdFx0XHRfaHRtbCArPSBcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWVycm9yXFxcIj5VcGxvYWQgYWJvcnRlZC48L2Rpdj5cIlxuXG5cdFx0X2h0bWwgKz0gXCJcIlwiXG5cdDwvZGl2PlxuXHRcdFwiXCJcIlxuXHRcdHJldHVybiBfaHRtbFxuXHRcdFxubW9kdWxlLmV4cG9ydHMgPSBGaWxlVmlld1xuIiwiQmFzZSA9IHJlcXVpcmUoIFwiLi9iYXNlXCIgKVxuRmlsZSA9IHJlcXVpcmUoIFwiLi9maWxlXCIgKVxuRmlsZVZpZXcgPSByZXF1aXJlKCBcIi4vZmlsZXZpZXdcIiApXG5cbkNsaWVudCA9IHJlcXVpcmUoIFwiLi9jbGllbnRcIiApXG5DbGllbnQuQmFzZSA9IEJhc2VcbkNsaWVudC5GaWxlID0gRmlsZVxuQ2xpZW50LkZpbGVWaWV3ID0gRmlsZVZpZXdcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRcbiIsImlzT2JqZWN0ID0gKCB2ciApLT5cblx0cmV0dXJuICggdnIgaXNudCBudWxsIGFuZCB0eXBlb2YgdnIgaXMgJ29iamVjdCcgKVxuXG5pc0FycmF5ID0gKCB2ciApLT5cblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdnIgKSBpcyAnW29iamVjdCBBcnJheV0nXG5cbmlzU3RyaW5nID0gKCB2ciApLT5cblx0cmV0dXJuIHR5cGVvZiB2ciBpcyAnc3RyaW5nJyBvciB2ciBpbnN0YW5jZW9mIFN0cmluZ1xuXG5faW50UmVnZXggPSAvXlxcZCskL1xuaXNJbnQgPSAoIHZyICktPlxuXHRyZXR1cm4gX2ludFJlZ2V4LnRlc3QoIHZyIClcblxuYXNzaWduID0gKCB0Z3J0LCBzcmNzLi4uICktPlxuXHRmb3Igc3JjIGluIHNyY3Ncblx0XHRpZiBpc09iamVjdCggc3JjIClcblx0XHRcdGZvciBfaywgX3Ygb2Ygc3JjXG5cdFx0XHRcdHRncnRbIF9rIF0gPSBfdlxuXHRyZXR1cm4gdGdydFxuXHRcbm1vZHVsZS5leHBvcnRzID1cblx0aXNBcnJheTogaXNBcnJheVxuXHRpc09iamVjdDogaXNPYmplY3Rcblx0aXNTdHJpbmc6IGlzU3RyaW5nXG5cdGlzSW50OiBpc0ludFxuXHRhc3NpZ246IGFzc2lnblxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgd2luZG93ID0gcmVxdWlyZShcImdsb2JhbC93aW5kb3dcIilcbnZhciBvbmNlID0gcmVxdWlyZShcIm9uY2VcIilcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKFwicGFyc2UtaGVhZGVyc1wiKVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVYSFJcbmNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCBub29wXG5jcmVhdGVYSFIuWERvbWFpblJlcXVlc3QgPSBcIndpdGhDcmVkZW50aWFsc1wiIGluIChuZXcgY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0KCkpID8gY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0IDogd2luZG93LlhEb21haW5SZXF1ZXN0XG5cblxuZnVuY3Rpb24gaXNFbXB0eShvYmope1xuICAgIGZvcih2YXIgaSBpbiBvYmope1xuICAgICAgICBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBjcmVhdGVYSFIob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiByZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIGxvYWRGdW5jKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICAgIC8vIENocm9tZSB3aXRoIHJlcXVlc3RUeXBlPWJsb2IgdGhyb3dzIGVycm9ycyBhcnJvdW5kIHdoZW4gZXZlbiB0ZXN0aW5nIGFjY2VzcyB0byByZXNwb25zZVRleHRcbiAgICAgICAgdmFyIGJvZHkgPSB1bmRlZmluZWRcblxuICAgICAgICBpZiAoeGhyLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlXG4gICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgIXhoci5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VUZXh0IHx8IHhoci5yZXNwb25zZVhNTFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSnNvbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib2R5XG4gICAgfVxuXG4gICAgdmFyIGZhaWx1cmVSZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBib2R5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaSxcbiAgICAgICAgICAgICAgICByYXdSZXF1ZXN0OiB4aHJcbiAgICAgICAgICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yRnVuYyhldnQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICAgICAgaWYoIShldnQgaW5zdGFuY2VvZiBFcnJvcikpe1xuICAgICAgICAgICAgZXZ0ID0gbmV3IEVycm9yKFwiXCIgKyAoZXZ0IHx8IFwiVW5rbm93biBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKSApXG4gICAgICAgIH1cbiAgICAgICAgZXZ0LnN0YXR1c0NvZGUgPSAwXG4gICAgICAgIGNhbGxiYWNrKGV2dCwgZmFpbHVyZVJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSAmIHByb2Nlc3MgdGhlIHJlc3BvbnNlIGluIGEgc3BlY2lhbCByZXNwb25zZSBvYmplY3RcbiAgICBmdW5jdGlvbiBsb2FkRnVuYygpIHtcbiAgICAgICAgaWYgKGFib3J0ZWQpIHJldHVyblxuICAgICAgICB2YXIgc3RhdHVzXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKG9wdGlvbnMudXNlWERSICYmIHhoci5zdGF0dXM9PT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vSUU4IENPUlMgR0VUIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgZG9lc24ndCBoYXZlIGEgc3RhdHVzIGZpZWxkLCBidXQgYm9keSBpcyBmaW5lXG4gICAgICAgICAgICBzdGF0dXMgPSAyMDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICh4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cylcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBmYWlsdXJlUmVzcG9uc2VcbiAgICAgICAgdmFyIGVyciA9IG51bGxcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSAwKXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IGdldEJvZHkoKSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKXsgLy9yZW1lbWJlciB4aHIgY2FuIGluIGZhY3QgYmUgWERSIGZvciBDT1JTIGluIElFXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnIgPSBuZXcgRXJyb3IoXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXG5cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgb3B0aW9ucyA9IHsgdXJpOiBvcHRpb25zIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbGxiYWNrIGFyZ3VtZW50IG1pc3NpbmdcIilcbiAgICB9XG4gICAgY2FsbGJhY2sgPSBvbmNlKGNhbGxiYWNrKVxuXG4gICAgdmFyIHhociA9IG9wdGlvbnMueGhyIHx8IG51bGxcblxuICAgIGlmICgheGhyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvcnMgfHwgb3B0aW9ucy51c2VYRFIpIHtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWERvbWFpblJlcXVlc3QoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleVxuICAgIHZhciBhYm9ydGVkXG4gICAgdmFyIHVyaSA9IHhoci51cmwgPSBvcHRpb25zLnVyaSB8fCBvcHRpb25zLnVybFxuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YVxuICAgIHZhciBoZWFkZXJzID0geGhyLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB2YXIgc3luYyA9ICEhb3B0aW9ucy5zeW5jXG4gICAgdmFyIGlzSnNvbiA9IGZhbHNlXG4gICAgdmFyIHRpbWVvdXRUaW1lclxuXG4gICAgaWYgKFwianNvblwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaXNKc29uID0gdHJ1ZVxuICAgICAgICBoZWFkZXJzW1wiYWNjZXB0XCJdIHx8IGhlYWRlcnNbXCJBY2NlcHRcIl0gfHwgKGhlYWRlcnNbXCJBY2NlcHRcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gXCJHRVRcIiAmJiBtZXRob2QgIT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gfHwgKGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlzdGF0ZWNoYW5nZVxuICAgIHhoci5vbmxvYWQgPSBsb2FkRnVuY1xuICAgIHhoci5vbmVycm9yID0gZXJyb3JGdW5jXG4gICAgLy8gSUU5IG11c3QgaGF2ZSBvbnByb2dyZXNzIGJlIHNldCB0byBhIHVuaXF1ZSBmdW5jdGlvbi5cbiAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSUUgbXVzdCBkaWVcbiAgICB9XG4gICAgeGhyLm9udGltZW91dCA9IGVycm9yRnVuY1xuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJpLCAhc3luYywgb3B0aW9ucy51c2VybmFtZSwgb3B0aW9ucy5wYXNzd29yZClcbiAgICAvL2hhcyB0byBiZSBhZnRlciBvcGVuXG4gICAgaWYoIXN5bmMpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHNcbiAgICB9XG4gICAgLy8gQ2Fubm90IHNldCB0aW1lb3V0IHdpdGggc3luYyByZXF1ZXN0XG4gICAgLy8gbm90IHNldHRpbmcgdGltZW91dCBvbiB0aGUgeGhyIG9iamVjdCwgYmVjYXVzZSBvZiBvbGQgd2Via2l0cyBldGMuIG5vdCBoYW5kbGluZyB0aGF0IGNvcnJlY3RseVxuICAgIC8vIGJvdGggbnBtJ3MgcmVxdWVzdCBhbmQganF1ZXJ5IDEueCB1c2UgdGhpcyBraW5kIG9mIHRpbWVvdXQsIHNvIHRoaXMgaXMgYmVpbmcgY29uc2lzdGVudFxuICAgIGlmICghc3luYyAmJiBvcHRpb25zLnRpbWVvdXQgPiAwICkge1xuICAgICAgICB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhYm9ydGVkPXRydWUvL0lFOSBtYXkgc3RpbGwgY2FsbCByZWFkeXN0YXRlY2hhbmdlXG4gICAgICAgICAgICB4aHIuYWJvcnQoXCJ0aW1lb3V0XCIpXG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihcIlhNTEh0dHBSZXF1ZXN0IHRpbWVvdXRcIilcbiAgICAgICAgICAgIGUuY29kZSA9IFwiRVRJTUVET1VUXCJcbiAgICAgICAgICAgIGVycm9yRnVuYyhlKVxuICAgICAgICB9LCBvcHRpb25zLnRpbWVvdXQgKVxuICAgIH1cblxuICAgIGlmICh4aHIuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgICBmb3Ioa2V5IGluIGhlYWRlcnMpe1xuICAgICAgICAgICAgaWYoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5oZWFkZXJzICYmICFpc0VtcHR5KG9wdGlvbnMuaGVhZGVycykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdFwiKVxuICAgIH1cblxuICAgIGlmIChcInJlc3BvbnNlVHlwZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlXG4gICAgfVxuXG4gICAgaWYgKFwiYmVmb3JlU2VuZFwiIGluIG9wdGlvbnMgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICAgIG9wdGlvbnMuYmVmb3JlU2VuZCh4aHIpXG4gICAgfVxuXG4gICAgeGhyLnNlbmQoYm9keSlcblxuICAgIHJldHVybiB4aHJcblxuXG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuIiwiaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBvbmNlXG5cbm9uY2UucHJvdG8gPSBvbmNlKGZ1bmN0aW9uICgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ29uY2UnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvbmNlKHRoaXMpXG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn0pXG5cbmZ1bmN0aW9uIG9uY2UgKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZVxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjYWxsZWQpIHJldHVyblxuICAgIGNhbGxlZCA9IHRydWVcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG59XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2lzLWZ1bmN0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gZm9yRWFjaChsaXN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXNGdW5jdGlvbihpdGVyYXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgY29udGV4dCA9IHRoaXNcbiAgICB9XG4gICAgXG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpXG4gICAgICAgIGZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZVxuICAgICAgICBmb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCBpKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvblxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZuKSB7XG4gIHZhciBzdHJpbmcgPSB0b1N0cmluZy5jYWxsKGZuKVxuICByZXR1cm4gc3RyaW5nID09PSAnW29iamVjdCBGdW5jdGlvbl0nIHx8XG4gICAgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiBzdHJpbmcgIT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB8fFxuICAgICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAvLyBJRTggYW5kIGJlbG93XG4gICAgIChmbiA9PT0gd2luZG93LnNldFRpbWVvdXQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuYWxlcnQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuY29uZmlybSB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5wcm9tcHQpKVxufTtcbiIsIlxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdHJpbTtcblxuZnVuY3Rpb24gdHJpbShzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn1cblxuZXhwb3J0cy5sZWZ0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbn07XG5cbmV4cG9ydHMucmlnaHQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xccyokLywgJycpO1xufTtcbiIsInZhciB0cmltID0gcmVxdWlyZSgndHJpbScpXG4gICwgZm9yRWFjaCA9IHJlcXVpcmUoJ2Zvci1lYWNoJylcbiAgLCBpc0FycmF5ID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGlmICghaGVhZGVycylcbiAgICByZXR1cm4ge31cblxuICB2YXIgcmVzdWx0ID0ge31cblxuICBmb3JFYWNoKFxuICAgICAgdHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuICAgICAgICAgICwga2V5ID0gdHJpbShyb3cuc2xpY2UoMCwgaW5kZXgpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgLCB2YWx1ZSA9IHRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpXG5cbiAgICAgICAgaWYgKHR5cGVvZihyZXN1bHRba2V5XSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkocmVzdWx0W2tleV0pKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IFsgcmVzdWx0W2tleV0sIHZhbHVlIF1cbiAgICAgICAgfVxuICAgICAgfVxuICApXG5cbiAgcmV0dXJuIHJlc3VsdFxufSJdfQ==
