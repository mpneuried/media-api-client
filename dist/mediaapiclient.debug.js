(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MediaApiClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var addD, addDWrap, domHelper, isString, nonAutoAttach, root,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

root = this;


/*
	
	Extend natives
 */

isString = function(vr) {
  return typeof vr === 'string' || vr instanceof String;
};

nonAutoAttach = ["domel", "create", "ajax", "byClass", "byId"];

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
var Base, Client, File, FileView, _defauktKeys, _defaults, _k, _v, assign, dom, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

dom = _dereq_("domel");

assign = _dereq_("lodash.assign");

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
    this.options = assign({}, _defaults, _htmlData, options || {});
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


},{"./base":2,"./file":4,"./fileview":5,"./utils":7,"domel":1,"lodash.assign":9}],4:[function(_dereq_,module,exports){
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
    this._defaultRequestSignature = bind(this._defaultRequestSignature, this);
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
    if (this.options.requestSignFn == null) {
      this.options.requestSignFn = this._defaultRequestSignature;
    }
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

  File.prototype._defaultRequestSignature = function(domain, accesskey, madiaapiurl, key, json, cb) {
    var _url, _xhr, data;
    _url = this.options.host + domain + "/sign/" + accesskey;
    _xhr = new window.XMLHttpRequest();
    data = new FormData();
    data.append("url", madiaapiurl);
    data.append("key", key);
    data.append("json", JSON.stringify(json));
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

  return File;

})(_dereq_("./base"));

module.exports = File;


},{"./base":2,"xhr":20}],5:[function(_dereq_,module,exports){
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
    this.el = dom.create("div", {
      "class": "file col-sm-6 col-md-4"
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
var _intRegex;

_intRegex = /^\d+$/;

module.exports = {
  isArray: function(vr) {
    return Object.prototype.toString.call(vr) === '[object Array]';
  },
  isObject: function(vr) {
    return vr !== null && typeof vr === 'object';
  },
  isString: function(vr) {
    return typeof vr === 'string' || vr instanceof String;
  },
  isInt: function(vr) {
    return _intRegex.test(vr);
  }
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
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseAssign = _dereq_('lodash._baseassign'),
    createAssigner = _dereq_('lodash._createassigner'),
    keys = _dereq_('lodash.keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"lodash._baseassign":10,"lodash._createassigner":12,"lodash.keys":16}],10:[function(_dereq_,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = _dereq_('lodash._basecopy'),
    keys = _dereq_('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"lodash._basecopy":11,"lodash.keys":16}],11:[function(_dereq_,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],12:[function(_dereq_,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var bindCallback = _dereq_('lodash._bindcallback'),
    isIterateeCall = _dereq_('lodash._isiterateecall'),
    restParam = _dereq_('lodash.restparam');

/**
 * Creates a function that assigns properties of source object(s) to a given
 * destination object.
 *
 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"lodash._bindcallback":13,"lodash._isiterateecall":14,"lodash.restparam":15}],13:[function(_dereq_,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],14:[function(_dereq_,module,exports){
/**
 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isIterateeCall;

},{}],15:[function(_dereq_,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],16:[function(_dereq_,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = _dereq_('lodash._getnative'),
    isArguments = _dereq_('lodash.isarguments'),
    isArray = _dereq_('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash._getnative":17,"lodash.isarguments":18,"lodash.isarray":19}],17:[function(_dereq_,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],18:[function(_dereq_,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{}],19:[function(_dereq_,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],20:[function(_dereq_,module,exports){
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

},{"global/window":21,"once":22,"parse-headers":26}],21:[function(_dereq_,module,exports){
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

},{}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
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

},{"is-function":24}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){

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

},{}],26:[function(_dereq_,module,exports){
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
},{"for-each":23,"trim":25}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9kb21lbC9saWIvbWFpbi5qcyIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9iYXNlLmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9jbGllbnQuY29mZmVlIiwiL1VzZXJzL21hdGhpYXNwZXRlci9Qcm9qZWt0ZS9tZWRpYS1hcGktY2xpZW50L19zcmMvbGliL2ZpbGUuY29mZmVlIiwiL1VzZXJzL21hdGhpYXNwZXRlci9Qcm9qZWt0ZS9tZWRpYS1hcGktY2xpZW50L19zcmMvbGliL2ZpbGV2aWV3LmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi9tYWluLmNvZmZlZSIsIi9Vc2Vycy9tYXRoaWFzcGV0ZXIvUHJvamVrdGUvbWVkaWEtYXBpLWNsaWVudC9fc3JjL2xpYi91dGlscy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2Vhc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWNvcHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9jcmVhdGVhc3NpZ25lci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2JpbmRjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2lzaXRlcmF0ZWVjYWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5yZXN0cGFyYW0vaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXMvbm9kZV9tb2R1bGVzL2xvZGFzaC5fZ2V0bmF0aXZlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNhcmd1bWVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXMvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2FycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL2dsb2JhbC93aW5kb3cuanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9vbmNlL29uY2UuanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL2Zvci1lYWNoL25vZGVfbW9kdWxlcy9pcy1mdW5jdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL3RyaW0vaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL3BhcnNlLWhlYWRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5kb21lbCA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBhZGRELCBhZGREV3JhcCwgZG9tSGVscGVyLCBpc1N0cmluZywgbm9uQXV0b0F0dGFjaCwgcm9vdCxcbiAgc2xpY2UgPSBbXS5zbGljZSxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5yb290ID0gdGhpcztcblxuXG4vKlxuXHRcblx0RXh0ZW5kIG5hdGl2ZXNcbiAqL1xuXG5pc1N0cmluZyA9IGZ1bmN0aW9uKHZyKSB7XG4gIHJldHVybiB0eXBlb2YgdnIgPT09ICdzdHJpbmcnIHx8IHZyIGluc3RhbmNlb2YgU3RyaW5nO1xufTtcblxubm9uQXV0b0F0dGFjaCA9IFtcImRvbWVsXCIsIFwiY3JlYXRlXCIsIFwiYWpheFwiLCBcImJ5Q2xhc3NcIiwgXCJieUlkXCJdO1xuXG5hZGREV3JhcCA9IGZ1bmN0aW9uKGZuLCBlbCwgZWxJZHgpIHtcbiAgaWYgKGVsSWR4ID09IG51bGwpIHtcbiAgICBlbElkeCA9IDA7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzO1xuICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICBhcmdzLnNwbGljZShlbElkeCwgMCwgZWwpO1xuICAgIHJldHVybiBmbi5hcHBseShkb21IZWxwZXIsIGFyZ3MpO1xuICB9O1xufTtcblxuYWRkRCA9IGZ1bmN0aW9uKGVsLCBrZXkpIHtcbiAgdmFyIGosIGxlbiwgbmFtZUZuLCByZWY7XG4gIGlmIChrZXkgPT0gbnVsbCkge1xuICAgIGtleSA9IFwiZFwiO1xuICB9XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG4gIGlmIChlbFtrZXldICE9IG51bGwpIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cbiAgZWxba2V5XSA9IHt9O1xuICByZWYgPSBPYmplY3Qua2V5cyhkb21IZWxwZXIpO1xuICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBuYW1lRm4gPSByZWZbal07XG4gICAgaWYgKGluZGV4T2YuY2FsbChub25BdXRvQXR0YWNoLCBuYW1lRm4pIDwgMCkge1xuICAgICAgZWxba2V5XVtuYW1lRm5dID0gYWRkRFdyYXAoZG9tSGVscGVyW25hbWVGbl0sIGVsKTtcbiAgICB9XG4gIH1cbiAgZWxba2V5XS5maW5kID0gYWRkRFdyYXAoZG9tSGVscGVyLCBlbCwgMSk7XG4gIGVsW2tleV0uYnlJZCA9IGFkZERXcmFwKGRvbUhlbHBlci5ieUlkLCBlbCwgMSk7XG4gIGVsW2tleV0uYnlDbGFzcyA9IGFkZERXcmFwKGRvbUhlbHBlci5ieUNsYXNzLCBlbCwgMSk7XG4gIHJldHVybiBlbDtcbn07XG5cblxuLypcblx0XG5cdERPTSBoZWxwZXJzXG4gKi9cblxuZG9tSGVscGVyID0gZnVuY3Rpb24oc2VsLCBjb250ZXh0LCBvbmx5Rmlyc3QpIHtcbiAgdmFyIF9lbCwgX3Jlc3VsdHMsIF9zZWwsIF9zZWxzLCByZWY7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cbiAgaWYgKG9ubHlGaXJzdCA9PSBudWxsKSB7XG4gICAgb25seUZpcnN0ID0gZmFsc2U7XG4gIH1cbiAgX3NlbHMgPSBzZWwuc3BsaXQoXCIgXCIpO1xuICBpZiAoX3NlbHMuZXZlcnkoKGZ1bmN0aW9uKHNlbCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIChyZWYgPSBzZWxbMF0pID09PSBcIi5cIiB8fCByZWYgPT09IFwiI1wiO1xuICB9KSkpIHtcbiAgICB3aGlsZSAoX3NlbHMubGVuZ3RoKSB7XG4gICAgICBpZiAoKF9zZWwgPSAocmVmID0gX3NlbHMuc3BsaWNlKDAsIDEpKSAhPSBudWxsID8gcmVmWzBdIDogdm9pZCAwKSkge1xuICAgICAgICBzd2l0Y2ggKF9zZWxbMF0pIHtcbiAgICAgICAgICBjYXNlIFwiLlwiOlxuICAgICAgICAgICAgY29udGV4dCA9IGRvbUhlbHBlci5ieUNsYXNzKF9zZWwsIGNvbnRleHQsIG9ubHlGaXJzdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiI1wiOlxuICAgICAgICAgICAgY29udGV4dCA9IGRvbUhlbHBlci5ieUlkKF9zZWwsIGNvbnRleHQsIG9ubHlGaXJzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbiAgX3Jlc3VsdHMgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKTtcbiAgaWYgKG9ubHlGaXJzdCkge1xuICAgIHJldHVybiBhZGREKF9yZXN1bHRzICE9IG51bGwgPyBfcmVzdWx0c1swXSA6IHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBfcmVzdWx0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgX2VsID0gX3Jlc3VsdHNbal07XG4gICAgICByZXN1bHRzLnB1c2goYWRkRChfZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0pKCk7XG59O1xuXG5kb21IZWxwZXIuZG9tZWwgPSBmdW5jdGlvbihlbCkge1xuICBpZiAoZWwgIT0gbnVsbCkge1xuICAgIHJldHVybiBhZGREKGVsKTtcbiAgfVxufTtcblxuZG9tSGVscGVyLmNyZWF0ZSA9IGZ1bmN0aW9uKHRhZywgYXR0cmlidXRlcykge1xuICB2YXIgX2VsLCBfaywgX3Y7XG4gIGlmICh0YWcgPT0gbnVsbCkge1xuICAgIHRhZyA9IFwiRElWXCI7XG4gIH1cbiAgaWYgKGF0dHJpYnV0ZXMgPT0gbnVsbCkge1xuICAgIGF0dHJpYnV0ZXMgPSB7fTtcbiAgfVxuICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGZvciAoX2sgaW4gYXR0cmlidXRlcykge1xuICAgIF92ID0gYXR0cmlidXRlc1tfa107XG4gICAgX2VsLnNldEF0dHJpYnV0ZShfaywgX3YpO1xuICB9XG4gIHJldHVybiBhZGREKF9lbCk7XG59O1xuXG5kb21IZWxwZXIuZGF0YSA9IGZ1bmN0aW9uKGVsLCBrZXksIHZhbCkge1xuICBpZiAoKGtleSAhPSBudWxsKSAmJiAodmFsICE9IG51bGwpKSB7XG4gICAgZWwuZGF0YXNldFtrZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGVsLmRhdGFzZXRba2V5XTtcbiAgfVxuICByZXR1cm4gZWwuZGF0YXNldDtcbn07XG5cbmRvbUhlbHBlci5hdHRyID0gZnVuY3Rpb24oZWwsIGtleSwgdmFsKSB7XG4gIGlmICgoa2V5ICE9IG51bGwpICYmICh2YWwgIT0gbnVsbCkpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgZWwuZ2V0QXR0cmlidXRlKGtleSk7XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmJ5Q2xhc3MgPSBmdW5jdGlvbihfY2wsIGNvbnRleHQsIG9ubHlGaXJzdCkge1xuICB2YXIgX2VsLCBfcmVzdWx0cztcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIGNvbnRleHQgPSBkb2N1bWVudDtcbiAgfVxuICBpZiAob25seUZpcnN0ID09IG51bGwpIHtcbiAgICBvbmx5Rmlyc3QgPSBmYWxzZTtcbiAgfVxuICBpZiAoX2NsWzBdID09PSBcIi5cIikge1xuICAgIF9jbCA9IF9jbC5zbGljZSgxKTtcbiAgfVxuICBfcmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShfY2wpO1xuICBpZiAob25seUZpcnN0KSB7XG4gICAgcmV0dXJuIGFkZEQoX3Jlc3VsdHMgIT0gbnVsbCA/IF9yZXN1bHRzWzBdIDogdm9pZCAwKTtcbiAgfVxuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IF9yZXN1bHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBfZWwgPSBfcmVzdWx0c1tqXTtcbiAgICAgIHJlc3VsdHMucHVzaChhZGREKF9lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSkoKTtcbn07XG5cbmRvbUhlbHBlci5ieUlkID0gZnVuY3Rpb24oX2lkLCBjb250ZXh0KSB7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cbiAgaWYgKF9pZFswXSA9PT0gXCIjXCIpIHtcbiAgICBfaWQgPSBfaWQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGFkZEQoY29udGV4dC5nZXRFbGVtZW50QnlJZChfaWQpKTtcbn07XG5cbmRvbUhlbHBlci5sYXN0ID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBpZHg7XG4gIGlkeCA9IGVsLmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgaWYgKGRvbUhlbHBlci5pcyhlbC5jaGlsZE5vZGVzW2lkeF0sIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGFkZEQoZWwuY2hpbGROb2Rlc1tpZHhdKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZHgtLTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRvbUhlbHBlci5wYXJlbnQgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIF9jdXJzb3I7XG4gIGlmIChzZWxlY3RvciA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGFkZEQoZWwucGFyZW50Tm9kZSk7XG4gIH1cbiAgX2N1cnNvciA9IGVsO1xuICB3aGlsZSAoX2N1cnNvci5wYXJlbnROb2RlICE9IG51bGwpIHtcbiAgICBfY3Vyc29yID0gX2N1cnNvci5wYXJlbnROb2RlO1xuICAgIGlmIChkb21IZWxwZXIuaXMoX2N1cnNvciwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gYWRkRChfY3Vyc29yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kb21IZWxwZXIuZmlyc3QgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGNoaWxkLCBpZHgsIGosIGxlbiwgcmVmO1xuICBpZHggPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gIHJlZiA9IGVsLmNoaWxkTm9kZXM7XG4gIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIGNoaWxkID0gcmVmW2pdO1xuICAgIGlmIChkb21IZWxwZXIuaXMoY2hpbGQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGFkZEQoY2hpbGQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRvbUhlbHBlci5jaGlsZHJlbiA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgY2hpbGQsIGNoaWxkcmVuLCBpZHgsIGosIGxlbiwgcmVmO1xuICBjaGlsZHJlbiA9IFtdO1xuICBpZHggPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gIHJlZiA9IGVsLmNoaWxkTm9kZXM7XG4gIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIGNoaWxkID0gcmVmW2pdO1xuICAgIGlmIChkb21IZWxwZXIuaXMoY2hpbGQsIHNlbGVjdG9yKSkge1xuICAgICAgY2hpbGRyZW4ucHVzaChhZGREKGNoaWxkKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjaGlsZHJlbjtcbn07XG5cbmRvbUhlbHBlci5jb3VudENoaWxkcmVuID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBkb21IZWxwZXIuY2hpbGRyZW4oZWwsIHNlbGVjdG9yKS5sZW5ndGg7XG59O1xuXG5kb21IZWxwZXIuaXMgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKHNlbGVjdG9yWzBdID09PSBcIi5cIikge1xuICAgIHJldHVybiBkb21IZWxwZXIuaGFzQ2xhc3MoZWwsIHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgfVxuICBpZiAoc2VsZWN0b3JbMF0gPT09IFwiI1wiKSB7XG4gICAgcmV0dXJuIGRvbUhlbHBlci5oYXNJZChlbCwgc2VsZWN0b3Iuc2xpY2UoMSkpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmRvbUhlbHBlci5oYXNDbGFzcyA9IGZ1bmN0aW9uKGVsLCBjbGFzc25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKGVsLmNsYXNzTGlzdCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc25hbWUpO1xuICB9XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLmNsYXNzTmFtZSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaW5kZXhPZi5jYWxsKChlbCAhPSBudWxsID8gKHJlZiA9IGVsLmNsYXNzTmFtZSkgIT0gbnVsbCA/IHJlZi5zcGxpdChcIiBcIikgOiB2b2lkIDAgOiB2b2lkIDApIHx8IFtdLCBjbGFzc25hbWUpID49IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5kb21IZWxwZXIuaGlkZSA9IGZ1bmN0aW9uKGVsKSB7XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLnN0eWxlIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICByZXR1cm4gZWw7XG59O1xuXG5kb21IZWxwZXIuc2hvdyA9IGZ1bmN0aW9uKGVsLCBkaXNwbGF5KSB7XG4gIGlmIChkaXNwbGF5ID09IG51bGwpIHtcbiAgICBkaXNwbGF5ID0gXCJibG9ja1wiO1xuICB9XG4gIGlmICgoZWwgIT0gbnVsbCA/IGVsLnN0eWxlIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5hZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzbmFtZSkge1xuICB2YXIgX2NsYXNzbmFtZXM7XG4gIGlmICh0aGlzLmhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgX2NsYXNzbmFtZXMgPSBlbGVtZW50LmNsYXNzTmFtZTtcbiAgaWYgKCFfY2xhc3NuYW1lcy5sZW5ndGgpIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzbmFtZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbWVudC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc25hbWU7XG4gIHJldHVybiBhZGREKGVsZW1lbnQpO1xufTtcblxuZG9tSGVscGVyLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NuYW1lKSB7XG4gIHZhciBfY2xhc3NuYW1lcywgcnhwO1xuICBpZiAoIXRoaXMuaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NuYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBfY2xhc3NuYW1lcyA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuICByeHAgPSBuZXcgUmVnRXhwKFwiXFxcXHM/XFxcXGJcIiArIGNsYXNzbmFtZSArIFwiXFxcXGJcIiwgXCJnXCIpO1xuICBfY2xhc3NuYW1lcyA9IF9jbGFzc25hbWVzLnJlcGxhY2UocnhwLCBcIlwiKTtcbiAgZWxlbWVudC5jbGFzc05hbWUgPSBfY2xhc3NuYW1lcztcbiAgcmV0dXJuIGFkZEQoZWxlbWVudCk7XG59O1xuXG5kb21IZWxwZXIuaGFzSWQgPSBmdW5jdGlvbihlbCwgaWQpIHtcbiAgaWYgKChlbCAhPSBudWxsID8gZWwuaWQgOiB2b2lkIDApID09PSBpZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmRvbUhlbHBlci5hcHBlbmQgPSBmdW5jdGlvbihlbCwgaHRtbCkge1xuICB2YXIgX2hkaXYsIGNoaWxkLCBqLCBrLCBsZW4sIGxlbjEsIHJlZjtcbiAgaWYgKGlzU3RyaW5nKGh0bWwpKSB7XG4gICAgX2hkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfaGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJlZiA9IF9oZGl2LmNoaWxkTm9kZXM7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBjaGlsZCA9IHJlZltqXTtcbiAgICAgIGlmICgoY2hpbGQgIT0gbnVsbCA/IGNoaWxkLnRhZ05hbWUgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChodG1sIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIHtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gaHRtbC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIGNoaWxkID0gaHRtbFtrXTtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaHRtbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICBlbC5hcHBlbmRDaGlsZChodG1sKTtcbiAgfVxuICByZXR1cm4gYWRkRChlbCk7XG59O1xuXG5kb21IZWxwZXIucHJlcGVuZCA9IGZ1bmN0aW9uKGVsLCBodG1sKSB7XG4gIHZhciBfZmlyc3RDaCwgX2hkaXYsIF9sYXRlc3RGaXJzdCwgY2hpbGQsIGosIHJlZiwgcmVmMTtcbiAgX2ZpcnN0Q2ggPSAocmVmID0gZWwuY2hpbGROb2RlcykgIT0gbnVsbCA/IHJlZlswXSA6IHZvaWQgMDtcbiAgaWYgKF9maXJzdENoID09IG51bGwpIHtcbiAgICBkb21IZWxwZXIuYXBwZW5kKGVsLCBodG1sKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX2hkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgX2hkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgX2xhdGVzdEZpcnN0ID0gX2ZpcnN0Q2g7XG4gIHJlZjEgPSBfaGRpdi5jaGlsZE5vZGVzO1xuICBmb3IgKGogPSByZWYxLmxlbmd0aCAtIDE7IGogPj0gMDsgaiArPSAtMSkge1xuICAgIGNoaWxkID0gcmVmMVtqXTtcbiAgICBpZiAoISgoY2hpbGQgIT0gbnVsbCA/IGNoaWxkLnRhZ05hbWUgOiB2b2lkIDApICE9IG51bGwpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZWwuaW5zZXJ0QmVmb3JlKGNoaWxkLCBfbGF0ZXN0Rmlyc3QpO1xuICAgIF9sYXRlc3RGaXJzdCA9IGNoaWxkO1xuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5yZW1vdmUgPSBmdW5jdGlvbihlbCkge1xuICB2YXIgaTtcbiAgaWYgKGVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIGVsLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSB7XG4gICAgaSA9IGVsLmxlbmd0aCAtIDE7XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKGVsW2ldICYmIGVsW2ldLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgZWxbaV0ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbFtpXSk7XG4gICAgICB9XG4gICAgICBpLS07XG4gICAgfVxuICB9XG4gIHJldHVybiBlbDtcbn07XG5cbmRvbUhlbHBlci5yZXBsYWNlV2l0aCA9IGZ1bmN0aW9uKGVsLCBlbFRvUmVwbCkge1xuICBkb21IZWxwZXIucGFyZW50KGVsKS5yZXBsYWNlQ2hpbGQoZWxUb1JlcGwsIGVsKTtcbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmNsb25lID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIGFkZEQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbn07XG5cbmRvbUhlbHBlci5vbiA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBoYW5kbGVyKSB7XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbC5hZGRFdmVudExpc3RlbmVyICE9IG51bGwpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgfSBlbHNlIGlmIChlbC5hdHRhY2hFdmVudCAhPSBudWxsKSB7XG4gICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsWydvbicgKyB0eXBlXSA9IGhhbmRsZXI7XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLm9mZiA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBoYW5kbGVyKSB7XG4gIGlmIChlbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbC5yZW1vdmVFdmVudExpc3RlbmVyICE9IG51bGwpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgfSBlbHNlIGlmIChlbC5kZXRhY2hFdmVudCAhPSBudWxsKSB7XG4gICAgZWwuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBlbFsnb24nICsgdHlwZV07XG4gIH1cbiAgcmV0dXJuIGVsO1xufTtcblxuZG9tSGVscGVyLmVtaXQgPSBmdW5jdGlvbihlbCwgdHlwZSkge1xuICB2YXIgZXZ0O1xuICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZ0LmluaXRFdmVudCh0eXBlLCB0cnVlLCBmYWxzZSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgcmV0dXJuIGV2dDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tSGVscGVyO1xuXG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTsiLCJjbGFzcyBCYXNlIGV4dGVuZHMgcmVxdWlyZSgnZXZlbnRzJylcblx0X2Vycm9yOiAoIGNiLCBlcnIgKT0+XG5cdFx0aWYgbm90ICggZXJyIGluc3RhbmNlb2YgRXJyb3IgKVxuXHRcdFx0X2VyciA9IG5ldyBFcnJvciggZXJyIClcblx0XHRcdF9lcnIubmFtZSA9IGVyclxuXHRcdFx0dHJ5XG5cdFx0XHRcdF9lcnIubWVzc2FnZSA9IEBFUlJPUlNbIGVyciBdIG9yIFwiIC0gXCJcblx0XHRlbHNlXG5cdFx0XHRfZXJyID0gZXJyXG5cblx0XHRpZiBub3QgY2I/XG5cdFx0XHR0aHJvdyBfZXJyXG5cdFx0ZWxzZVxuXHRcdFx0Y2IoIF9lcnIgKVxuXHRcdHJldHVyblxuXHRcdFxubW9kdWxlLmV4cG9ydHMgPSBCYXNlXG4iLCJkb20gPSByZXF1aXJlKCBcImRvbWVsXCIgKVxuYXNzaWduID0gcmVxdWlyZSggXCJsb2Rhc2guYXNzaWduXCIgKVxuXG51dGlscyA9IHJlcXVpcmUoIFwiLi91dGlsc1wiIClcbkJhc2UgPSByZXF1aXJlKCBcIi4vYmFzZVwiIClcbkZpbGUgPSByZXF1aXJlKCBcIi4vZmlsZVwiIClcbkZpbGVWaWV3ID0gcmVxdWlyZSggXCIuL2ZpbGV2aWV3XCIgKVxuXG5fZGVmYXVsdHMgPVxuXHRob3N0OiBudWxsXG5cdGRvbWFpbjogbnVsbFxuXHRhY2Nlc3NrZXk6IG51bGxcblx0a2V5cHJlZml4OiBcImNsaWVudHVwbG9hZFwiXG5cdGF1dG9zdGFydDogdHJ1ZVxuXHRyZXF1ZXN0U2lnbkZuOiBudWxsXG5cdHJlc3VsdFRlbXBsYXRlRm46IG51bGxcblx0bWF4c2l6ZTogMFxuXHRtYXhjb3VudDogMFxuXHR3aWR0aDogbnVsbFxuXHRoZWlnaHQ6IG51bGxcblx0YWNjZXB0OiBudWxsXG5cdHR0bDogMFxuXHRhY2w6IFwicHVibGljLXJlYWRcIlxuXHRwcm9wZXJ0aWVzOiBudWxsXG5cdHRhZ3M6IG51bGxcblx0XCJjb250ZW50LWRpc3Bvc2l0aW9uXCI6IG51bGxcblx0Y3NzZHJvcHBhYmxlOiBcImRyb3BhYmxlXCJcblx0Y3NzaG92ZXI6IFwiaG92ZXJcIlxuXHRjc3Nwcm9jZXNzOiBcInByb2Nlc3NcIlxuXHRjc3NkaXNhYmxlZDogXCJkaXNhYmxlZFwiXG5cbl9kZWZhdWt0S2V5cyA9IGZvciBfaywgX3Ygb2YgX2RlZmF1bHRzXG5cdF9rXG5cbmNsYXNzIENsaWVudCBleHRlbmRzIEJhc2Vcblx0dmVyc2lvbjogXCJAQHZlcnNpb25cIlxuXG5cdF9yZ3hIb3N0OiAvaHR0cHM/OlxcL1xcL1teXFwvJFxcc10rL2lcblxuXHRjb25zdHJ1Y3RvcjogKCBkcmFnLCBlbHJlc3VsdHMsIG9wdGlvbnMgPSB7fSApLT5cblx0XHRzdXBlclxuXHRcdFxuXHRcdEBlbmFibGVkID0gdHJ1ZVxuXHRcdEB1c2VGaWxlQVBJID0gZmFsc2Vcblx0XHRcblx0XHRAb24oIFwiZmlsZS5uZXdcIiwgQGZpbGVOZXcgKVxuXG5cdFx0QG9uKCBcImZpbGUuZG9uZVwiLCBAZmlsZURvbmUgKVxuXHRcdEBvbiggXCJmaWxlLmVycm9yXCIsIEBmaWxlRXJyb3IgKVxuXHRcdEBvbiggXCJmaWxlLmludmFsaWRcIiwgQGZpbGVFcnJvciApXG5cdFx0QG9uKCBcImZpbGUuYWJvcnRlZFwiLCBAZmlsZUVycm9yIClcblx0XHRAb24oIFwiZmluaXNoXCIsIEBvbkZpbmlzaCApXG5cdFx0QHdpdGhpbl9lbnRlciA9IGZhbHNlXG5cblxuXHRcdEBlbCA9IEBfdmFsaWRhdGVFbCggZHJhZywgXCJkcmFnXCIgKVxuXHRcdEBzZWwgPSBAZWwuZC5maW5kKCBcImlucHV0I3sgb3B0aW9ucy5pbnB1dGNsYXNzIG9yIFwiXCIgfVt0eXBlPSdmaWxlJ11cIiwgdHJ1ZSApXG5cdFx0aWYgbm90IEBzZWw/XG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3Npbmctc2VsZWN0LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRAZm9ybW5hbWUgPSBAc2VsLmdldEF0dHJpYnV0ZSggXCJuYW1lXCIgKVxuXG5cdFx0aWYgZWxyZXN1bHRzP1xuXHRcdFx0QHJlcyA9IEBfdmFsaWRhdGVFbCggZWxyZXN1bHRzLCBcInJlc3VsdFwiIClcblxuXG5cdFx0X2h0bWxEYXRhID0gQGVsLmQuZGF0YSgpXG5cdFx0QG9wdGlvbnMgPSBhc3NpZ24oIHt9LCBfZGVmYXVsdHMsIF9odG1sRGF0YSwgb3B0aW9ucyBvciB7fSApXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuaG9zdD8ubGVuZ3RoXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcIm1pc3NpbmctaG9zdFwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IEBfcmd4SG9zdC50ZXN0KCBAb3B0aW9ucy5ob3N0IClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC1ob3N0XCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgQG9wdGlvbnMuZG9tYWluPy5sZW5ndGhcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy1kb21haW5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5hY2Nlc3NrZXk/Lmxlbmd0aFxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJtaXNzaW5nLWFjY2Vzc2tleVwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQ/XG5cdFx0XHRfbXhjbnQgPSBwYXJzZUludCggQG9wdGlvbnMubWF4Y291bnQsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhjbnQgKVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9kZWZhdWx0cy5tYXhjb3VudFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhjb3VudCA9IF9teGNudFxuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgaXNudCAxXG5cdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJtdWx0aXBsZVwiLCBcIm11bHRpcGxlXCIgKVxuXG5cdFx0aWYgQG9wdGlvbnMubWF4c2l6ZT9cblx0XHRcdF9teHN6ID0gcGFyc2VJbnQoIEBvcHRpb25zLm1heHNpemUsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBfbXhzeiApXG5cdFx0XHRcdEBvcHRpb25zLm1heHNpemUgPSBfZGVmYXVsdHMubWF4c2l6ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAb3B0aW9ucy5tYXhzaXplID0gX214c3pcblxuXHRcdGlmIEBvcHRpb25zLnJlcXVlc3RTaWduRm4/IGFuZCB0eXBlb2YgQG9wdGlvbnMucmVxdWVzdFNpZ25GbiBpc250IFwiZnVuY3Rpb25cIlxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXJlcXVlc3RTaWduZm5cIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnR0bD8gYW5kIG5vdCB1dGlscy5pc0ludCggQG9wdGlvbnMudHRsIClcblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC10dGxcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlIGlmIEBvcHRpb25zLnR0bD9cblx0XHRcdEBvcHRpb25zLnR0bCA9IHBhcnNlSW50KCBAb3B0aW9ucy50dGwsIDEwIClcblx0XHRcdGlmIGlzTmFOKCBAb3B0aW9ucy50dGwgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdHRsXCIgKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnRhZ3M/IGFuZCB1dGlscy5pc0FycmF5KCBAb3B0aW9ucy50YWdzIClcblx0XHRcdGZvciBfdGFnIGluIEBvcHRpb25zLnRhZ3Mgd2hlbiBub3QgdXRpbHMuaXNTdHJpbmcoIF90YWcgKVxuXHRcdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtdGFnc1wiIClcblx0XHRcdFx0cmV0dXJuXG5cdFx0ZWxzZSBpZiBAb3B0aW9ucy50YWdzP1xuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXRhZ3NcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zLnByb3BlcnRpZXM/IGFuZCBub3QgdXRpbHMuaXNPYmplY3QoIEBvcHRpb25zLnByb3BlcnRpZXMgKVxuXHRcdFx0QF9lcnJvciggbnVsbCwgXCJpbnZhbGlkLXByb3BlcnRpZXNcIiApXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIEBvcHRpb25zWyBcImNvbnRlbnQtZGlzcG9zaXRpb25cIiBdPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSApXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtY29udGVudC1kaXNwb3NpdGlvblwiIClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgQG9wdGlvbnMuYWNsPyBhbmQgbm90IHV0aWxzLmlzU3RyaW5nKCBAb3B0aW9ucy5hY2wgKSBhbmQgQG9wdGlvbnMuYWNsIG5vdCBpbiBbIFwicHVibGljLXJlYWRcIiwgXCJhdXRoZW50aWNhdGVkLXJlYWRcIiBdXG5cdFx0XHRAX2Vycm9yKCBudWxsLCBcImludmFsaWQtYWNsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRfaW5wQWNjZXB0ID0gQHNlbC5nZXRBdHRyaWJ1dGUoIFwiYWNjZXB0XCIgKVxuXHRcdGlmIEBvcHRpb25zLmFjY2VwdD8gb3IgX2lucEFjY2VwdD9cblx0XHRcdF9odG1sID0gX2lucEFjY2VwdD8uc3BsaXQoIFwiLFwiICkgb3IgW11cblx0XHRcdF9vcHQgPSBAb3B0aW9ucy5hY2NlcHQ/LnNwbGl0KCBcIixcIiApIG9yIFtdXG5cdFx0XHRpZiBfaHRtbD8ubGVuZ3RoXG5cdFx0XHRcdEBvcHRpb25zLmFjY2VwdCA9IF9odG1sXG5cdFx0XHRlbHNlIGlmIF9vcHQ/Lmxlbmd0aFxuXHRcdFx0XHRAc2VsLnNldEF0dHJpYnV0ZSggXCJhY2NlcHRcIiwgQG9wdGlvbnMuYWNjZXB0IClcblx0XHRcdEBvcHRpb25zLmFjY2VwdFJ1bGVzID0gQGdlbmVyYXRlQWNjZXB0UnVsZXMoIEBvcHRpb25zLmFjY2VwdCApXG5cblx0XHRAaW5pdGlhbGl6ZSgpXG5cdFx0QGlkeF9zdGFydGVkID0gMFxuXHRcdEBpZHhfZmluaXNoZWQgPSAwXG5cblx0XHRAZWwuZC5kYXRhKCBcIm1lZGlhYXBpY2xpZW50XCIsIEAgKVxuXHRcdHJldHVyblxuXG5cdGdlbmVyYXRlQWNjZXB0UnVsZXM6ICggYWNjZXB0ICktPlxuXHRcdF9ydWxlcyA9IFtdXG5cblx0XHRmb3IgX3J1bGUgaW4gYWNjZXB0XG5cdFx0XHRpZiBfcnVsZS5pbmRleE9mKCBcIi9cIiApID49IDBcblx0XHRcdFx0X3J1bGVzLnB1c2ggKCAtPlxuXHRcdFx0XHRcdF9yZWdleCA9IG5ldyBSZWdFeHAoIFwiI3tfcnVsZS5yZXBsYWNlKCBcIipcIiwgXCJcXFxcdytcIiApfSRcIiwgXCJpXCIgKVxuXHRcdFx0XHRcdHJldHVybiAoIGZpbGUgKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3JlZ2V4LnRlc3QoIGZpbGUudHlwZSApXG5cdFx0XHRcdFx0KSgpXG5cdFx0XHRlbHNlIGlmIF9ydWxlLmluZGV4T2YoIFwiLlwiICkgPj0gMFxuXHRcdFx0XHRfcnVsZXMucHVzaCAoIC0+XG5cdFx0XHRcdFx0X3JlZ2V4ID0gbmV3IFJlZ0V4cCggXCIje19ydWxlLnJlcGxhY2UoIFwiLlwiLCBcIlxcXFwuXCIgKX0kXCIsIFwiaVwiIClcblx0XHRcdFx0XHRyZXR1cm4gKCBmaWxlICktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIF9yZWdleC50ZXN0KCBmaWxlLm5hbWUgKVxuXHRcdFx0XHRcdCkoKVxuXHRcdFx0ZWxzZSBpZiBfcnVsZSBpcyBcIipcIlxuXHRcdFx0XHRfcnVsZXMucHVzaCAoKCBmaWxlICktPiB0cnVlIClcblx0XHRyZXR1cm4gX3J1bGVzXG5cblx0aW5pdGlhbGl6ZTogPT5cblx0XHRpZiB3aW5kb3cuRmlsZSBhbmQgd2luZG93LkZpbGVMaXN0IGFuZCB3aW5kb3cuRmlsZVJlYWRlclxuXHRcdFx0QHNlbC5kLm9uKCBcImNoYW5nZVwiLCBAb25TZWxlY3QgKVxuXHRcdFx0QHVzZUZpbGVBUEkgPSB0cnVlXG5cdFx0XHRAaW5pdEZpbGVBUEkoKVxuXHRcdFx0XHRcdFxuXHRcdHJldHVyblxuXG5cdGluaXRGaWxlQVBJOiA9PlxuXHRcdHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cdFx0XG5cdFx0aWYgeGhyPy51cGxvYWRcblx0XHRcdEBlbC5vbmRyYWdvdmVyID0gQG9uSG92ZXJcblx0XHRcdEBlbC5vbmRyYWdsZWF2ZSA9IEBvbkxlYXZlXG5cdFx0XHRAZWwub25kcm9wID0gQG9uU2VsZWN0XG5cdFx0XHRcblx0XHRcdEBlbC5kLmFkZENsYXNzKCBAb3B0aW9ucy5jc3Nkcm9wcGFibGUgKVxuXHRcdGVsc2Vcblx0XHRyZXR1cm5cblxuXHRvblNlbGVjdDogKCBldm50ICk9PlxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPD0gMCBvciBAaWR4X3N0YXJ0ZWQgPCBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc2hvdmVyIClcblx0XHRcdEBlbC5kLmFkZENsYXNzKCBAb3B0aW9ucy5jc3Nwcm9jZXNzIClcblxuXHRcdFx0ZmlsZXMgPSBldm50LnRhcmdldD8uZmlsZXMgb3IgZXZudC5vcmlnaW5hbEV2ZW50Py50YXJnZXQ/LmZpbGVzIG9yIGV2bnQuZGF0YVRyYW5zZmVyPy5maWxlcyBvciBldm50Lm9yaWdpbmFsRXZlbnQ/LmRhdGFUcmFuc2Zlcj8uZmlsZXNcblx0XHRcdEB1cGxvYWQoIGZpbGVzIClcblx0XHRlbHNlXG5cdFx0XHRAZWwuZC5yZW1vdmVDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXG5cdG9uSG92ZXI6ICggZXZudCApPT5cblx0XHRldm50LnByZXZlbnREZWZhdWx0KClcblx0XHRpZiBub3QgQGVuYWJsZWRcblx0XHRcdHJldHVyblxuXHRcdEB3aXRoaW5fZW50ZXIgPSB0cnVlXG5cdFx0c2V0VGltZW91dCggKCA9PiBAd2l0aGluX2VudGVyID0gZmFsc2UgKSwgMClcblx0XHRAZWwuZC5hZGRDbGFzcyggQG9wdGlvbnMuY3NzaG92ZXIgKVxuXHRcdHJldHVyblxuXG5cdG9uT3ZlcjogKCBldm50ICk9PlxuXHRcdGV2bnQucHJldmVudERlZmF1bHQoKVxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuXG5cblx0b25MZWF2ZTogKCBldm50ICk9PlxuXHRcdGlmIG5vdCBAZW5hYmxlZFxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgbm90IEB3aXRoaW5fZW50ZXJcblx0XHRcdEBlbC5kLnJlbW92ZUNsYXNzKCBAb3B0aW9ucy5jc3Nob3ZlciApXG5cdFx0cmV0dXJuXG5cblx0dXBsb2FkOiAoIGZpbGVzICk9PlxuXHRcdGlmIEB1c2VGaWxlQVBJXG5cdFx0XHRmb3IgZmlsZSwgaWR4IGluIGZpbGVzIHdoZW4gQGVuYWJsZWRcblx0XHRcdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPD0gMCBvciBAaWR4X3N0YXJ0ZWQgPCBAb3B0aW9ucy5tYXhjb3VudFxuXHRcdFx0XHRcdEBpZHhfc3RhcnRlZCsrXG5cdFx0XHRcdFx0bmV3IEZpbGUoIGZpbGUsIEBpZHhfc3RhcnRlZCwgQCwgQG9wdGlvbnMgKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXG5cdGFib3J0QWxsOiA9PlxuXHRcdEBlbWl0IFwiYWJvcnRBbGxcIlxuXHRcdHJldHVyblxuXG5cdGRpc2FibGU6ID0+XG5cdFx0QHNlbC5zZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiIClcblx0XHRAZWwuZC5hZGRDbGFzcyggQG9wdGlvbnMuY3NzZGlzYWJsZWQgKVxuXHRcdEBlbmFibGVkID0gZmFsc2Vcblx0XHRyZXR1cm5cblxuXHRlbmFibGU6ID0+XG5cdFx0QHNlbC5yZW1vdmVBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApXG5cdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc2Rpc2FibGVkIClcblx0XHRAZW5hYmxlZCA9IHRydWVcblx0XHRyZXR1cm5cblxuXHRmaWxlRG9uZTogKCBmaWxlICk9PlxuXHRcdEBpZHhfZmluaXNoZWQrK1xuXHRcdEBfY2hlY2tGaW5pc2goKVxuXHRcdHJldHVyblxuXG5cdGZpbGVFcnJvcjogKCBmaWxlLCBlcnIgKT0+XG5cdFx0Y29uc29sZS5lcnJvciBcIkZJTEUtRVJST1JcIiwgZmlsZSwgZXJyXG5cdFx0QGlkeF9maW5pc2hlZCsrXG5cdFx0QF9jaGVja0ZpbmlzaCgpXG5cdFx0cmV0dXJuXG5cblx0ZmlsZU5ldzogKCBmaWxlICk9PlxuXHRcdGlmIEByZXM/XG5cdFx0XHRfZmlsZXZpZXcgPSBuZXcgRmlsZVZpZXcoIGZpbGUsIEAsIEBvcHRpb25zIClcblx0XHRcdEByZXMuZC5hcHBlbmQoIF9maWxldmlldy5yZW5kZXIoKSApXG5cdFx0cmV0dXJuXG5cblx0b25GaW5pc2g6ID0+XG5cdFx0QGVsLmQucmVtb3ZlQ2xhc3MoIEBvcHRpb25zLmNzc3Byb2Nlc3MgKVxuXHRcdHJldHVyblxuXG5cdF9jaGVja0ZpbmlzaDogPT5cblx0XHRpZiBAaWR4X2ZpbmlzaGVkID49IEBpZHhfc3RhcnRlZFxuXHRcdFx0QGVtaXQoIFwiZmluaXNoXCIgKVxuXHRcdFx0aWYgQG9wdGlvbnMubWF4Y291bnQgPiAwIGFuZCBAaWR4X3N0YXJ0ZWQgPj0gQG9wdGlvbnMubWF4Y291bnRcblx0XHRcdFx0QGRpc2FibGUoKVxuXHRcdHJldHVyblxuXG5cdF92YWxpZGF0ZUVsOiAoIGVsLCB0eXBlICk9PlxuXHRcdGlmIG5vdCBlbD9cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwibWlzc2luZy0je3R5cGV9LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRzd2l0Y2ggdHlwZW9mIGVsXG5cdFx0XHR3aGVuIFwic3RyaW5nXCJcblx0XHRcdFx0X2VsID0gZG9tKCBlbCwgbnVsbCwgdHJ1ZSApXG5cdFx0XHR3aGVuIFwib2JqZWN0XCJcblx0XHRcdFx0aWYgZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdF9lbCA9IGRvbS5kb21lbCggZWwgKVxuXG5cdFx0aWYgbm90IF9lbD9cblx0XHRcdEBfZXJyb3IoIG51bGwsIFwiaW52YWxpZC0je3R5cGV9LWVsXCIgKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZXR1cm4gX2VsXG5cblx0XG5cblx0RVJST1JTOlxuXHRcdFwibWlzc2luZy1zZWxlY3QtZWxcIjogXCJNaXNzaW5nIHNlbGVjdCBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLXNlbGVjdC1lbFwiOiBcIkludmFsaWQgc2VsZWN0IGVsZW1lbnQuIFBsZWFzZSBkZWZpbmUgYSB2YWxpZCBlbGVtZW50IGFzIGEgU2VsZWN0b3IsIERPTS1ub2RlXCJcblx0XHRcIm1pc3NpbmctZHJhZy1lbFwiOiBcIk1pc3NpbmcgZHJhZyBlbGVtZW50LiBQbGVhc2UgZGVmaW5lIGEgdmFsaWQgZWxlbWVudCBhcyBhIFNlbGVjdG9yLCBET00tbm9kZVwiXG5cdFx0XCJpbnZhbGlkLWRyYWctZWxcIjogXCJJbnZhbGlkIGRyYWcgZWxlbWVudC4gUGxlYXNlIGRlZmluZSBhIHZhbGlkIGVsZW1lbnQgYXMgYSBTZWxlY3RvciwgRE9NLW5vZGVcIlxuXHRcdFwibWlzc2luZy1ob3N0XCI6IFwiTWlzc2luZyBob3N0LiBZb3UgaGF2ZSB0byBkZWZpZW4gYSBob3N0IGFzIHVybCBzdGFydGluZyB3aXRoIGBodHRwOi8vYCBvciBgaHR0cHM6Ly9gLlwiXG5cdFx0XCJpbnZhbGlkLWhvc3RcIjogXCJJbnZhbGlkIGhvc3QuIFlvdSBoYXZlIHRvIGRlZmllbiBhIGhvc3QgYXMgdXJsIHN0YXJ0aW5nIHdpdGggYGh0dHA6Ly9gIG9yIGBodHRwczovL2AuXCJcblx0XHRcIm1pc3NpbmctZG9tYWluXCI6IFwiTWlzc2luZyBkb21haW4uIFlvdSBoYXZlIHRvIGRlZmluZSBhIGRvbWFpbi5cIlxuXHRcdFwibWlzc2luZy1hY2Nlc3NrZXlcIjogXCJNaXNzaW5nIGFjY2Vzc2tleS4gWW91IGhhdmUgdG8gZGVmaW5lIGEgYWNjZXNza2V5LlwiXG5cdFx0XCJtaXNzaW5nLWtleXByZWZpeFwiOiBcIk1pc3Npbmcga2V5cHJlZml4LiBZb3UgaGF2ZSB0byBkZWZpbmUgYSBrZXlwcmVmaXguXCJcblx0XHRcImludmFsaWQtdHRsXCI6IFwiZm9yIHRoZSBvcHRpb24gYHR0bGAgb25seSBhIHBvc2l0aXYgbnVtYmVyIGlzIGFsbG93ZWRcIlxuXHRcdFwiaW52YWxpZC10YWdzXCI6IFwiZm9yIHRoZSBvcHRpb24gYHRhZ3NgIG9ubHkgYW4gYXJyYXkgb2Ygc3RyaW5ncyBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtcHJvcGVydGllc1wiOiBcImZvciB0aGUgb3B0aW9uIGBwcm9wZXJ0aWVzYCBvbmx5IGFuIG9iamVjdCBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtY29udGVudC1kaXNwb3NpdGlvblwiOiBcImZvciB0aGUgb3B0aW9uIGBjb250ZW50LWRpc3Bvc2l0aW9uYCBvbmx5IGFuIHN0cmluZyBsaWtlOiBgYXR0YWNobWVudDsgZmlsZW5hbWU9ZnJpZW5kbHlfZmlsZW5hbWUucGRmYCBpcyBhbGxvd2VkXCJcblx0XHRcImludmFsaWQtYWNsXCI6IFwidGhlIG9wdGlvbiBhY2wgb25seSBhY2NlcHRzIHRoZSBzdHJpbmcgYHB1YmxpYy1yZWFkYCBvciBgYXV0aGVudGljYXRlZC1yZWFkYFwiXG5cbkNsaWVudC5kZWZhdWx0cyA9ICggb3B0aW9ucyApLT5cblx0Zm9yIF9rLCBfdiBvZiBvcHRpb25zIHdoZW4gX2sgaW4gX2RlZmF1a3RLZXlzXG5cdFx0X2RlZmF1bHRzWyBfayBdID0gX3Zcblx0cmV0dXJuIF9kZWZhdWx0c1xuXHRcbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50XG4iLCJ4aHIgPSByZXF1aXJlKCBcInhoclwiIClcblxuY2xhc3MgRmlsZSBleHRlbmRzIHJlcXVpcmUoXCIuL2Jhc2VcIilcblxuXHRzdGF0ZXM6IFsgXCJuZXdcIiwgXCJzdGFydFwiLCBcInNpZ25lZFwiLCBcInVwbG9hZFwiLCBcInByb2dyZXNzXCIsIFwiZG9uZVwiLCBcImludmFsaWRcIiwgXCJlcnJvclwiLCBcImFib3J0ZWRcIiBdXG5cblx0Y29uc3RydWN0b3I6ICggQGZpbGUsIEBpZHgsIEBjbGllbnQsIEBvcHRpb25zICktPlxuXHRcdHN1cGVyXG5cdFx0QHN0YXRlID0gMFxuXHRcdEB2YWxpZGF0aW9uID0gW11cblxuXHRcdEBrZXkgPSBAb3B0aW9ucy5rZXlwcmVmaXggKyBcIl9cIiArIEBnZXROYW1lKCkucmVwbGFjZSggQF9yZ3hGaWxlMktleSwgXCJcIiApICsgXCJfXCIgKyBAX25vdygpICsgXCJfXCIgKyBAaWR4XG5cblx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5uZXdcIiwgQCApXG5cdFx0QGNsaWVudC5vbiBcImFib3J0QWxsXCIsIEBhYm9ydFxuXG5cdFx0QG9uKCBcInN0YXJ0XCIsIEBzdGFydCApXG5cdFx0QG9uKCBcInNpZ25lZFwiLCBAX3VwbG9hZCApXG5cblx0XHRpZiBub3QgQG9wdGlvbnMucmVxdWVzdFNpZ25Gbj9cblx0XHRcdEBvcHRpb25zLnJlcXVlc3RTaWduRm4gPSBAX2RlZmF1bHRSZXF1ZXN0U2lnbmF0dXJlXG5cblx0XHRpZiBub3QgQG9wdGlvbnMua2V5cHJlZml4Py5sZW5ndGhcblx0XHRcdEBvcHRpb25zLmtleXByZWZpeCA9IFwiY2xpZW50dXBsb2FkXCJcblxuXHRcdGlmIG5vdCBAb3B0aW9ucy5hdXRvc3RhcnQ/XG5cdFx0XHRAb3B0aW9ucy5hdXRvc3RhcnQgPSB0cnVlXG5cblx0XHRAX3ZhbGlkYXRlKClcblxuXHRcdGlmIEBvcHRpb25zLmF1dG9zdGFydFxuXHRcdFx0QGVtaXQgXCJzdGFydFwiXG5cdFx0cmV0dXJuXG5cblx0c3RhcnQ6ID0+XG5cdFx0aWYgQHN0YXRlIDw9IDBcblx0XHRcdEBfc2V0U3RhdGUoIDEgKVxuXHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUudXBsb2FkXCIsIEAgKVxuXHRcdFx0QF9zaWduKClcblx0XHRyZXR1cm4gQFxuXHRcblx0YWJvcnQ6ID0+XG5cdFx0aWYgQHN0YXRlIDw9IDRcblx0XHRcdEBfc2V0U3RhdGUoIDggKVxuXHRcdFx0QHJlcXVlc3RVcGxvYWQ/LmFib3J0KClcblx0XHRcdEBlbWl0IFwiYWJvcnRlZFwiXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5hYm9ydGVkXCIsIEAgKVxuXHRcdHJldHVybiBAXG5cdFxuXHRnZXRTdGF0ZTogPT5cblx0XHRyZXR1cm4gQHN0YXRlc1sgQHN0YXRlIF1cblxuXHRnZXRSZXN1bHQ6ID0+XG5cdFx0aWYgQHN0YXRlIGlzIDUgYW5kIEBkYXRhP1xuXHRcdFx0cmV0dXJuIHsgdXJsOiBAZGF0YS51cmwsIGhhc2g6IEBkYXRhLmZpbGVoYXNoLCBrZXk6IEBkYXRhLmtleSwgdHlwZTogQGRhdGEuY29udGVudF90eXBlIH1cblx0XHRyZXR1cm4gbnVsbFxuXG5cdGdldFByb2dyZXNzOiAoIGFzRmFjdG9yID0gZmFsc2UgKT0+XG5cdFx0aWYgQHN0YXRlIDwgNFxuXHRcdFx0X2ZhYyA9IDBcblx0XHRlbHNlIGlmIEBzdGF0ZSA+IDRcblx0XHRcdF9mYWMgPSAxXG5cdFx0ZWxzZVxuXHRcdFx0X2ZhYyA9IEBwcm9ncmVzc1N0YXRlXG5cblx0XHRpZiBhc0ZhY3RvclxuXHRcdFx0cmV0dXJuIF9mYWNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gTWF0aC5yb3VuZCggX2ZhYyAqIDEwMCApXG5cblx0Z2V0TmFtZTogPT5cblx0XHRyZXR1cm4gQGZpbGUubmFtZVxuXG5cdGdldFR5cGU6ID0+XG5cdFx0cmV0dXJuIEBmaWxlLnR5cGVcblxuXHRnZXREYXRhOiA9PlxuXHRcdF9yZXQgPVxuXHRcdFx0bmFtZTogQGNsaWVudC5mb3JtbmFtZVxuXHRcdFx0ZmlsZW5hbWU6IEBnZXROYW1lKClcblx0XHRcdGlkeDogQGlkeFxuXHRcdFx0c3RhdGU6IEBnZXRTdGF0ZSgpXG5cdFx0XHRwcm9ncmVzczogQGdldFByb2dyZXNzKClcblx0XHRcdHJlc3VsdDogQGdldFJlc3VsdCgpXG5cdFx0XHRvcHRpb25zOiBAb3B0aW9uc1xuXHRcdFx0aW52YWxpZF9yZWFzb246IEB2YWxpZGF0aW9uXG5cdFx0XHRlcnJvcjogQGVycm9yXG5cdFx0cmV0dXJuIF9yZXRcblxuXHRfc2V0U3RhdGU6ICggc3RhdGUgKT0+XG5cdFx0aWYgc3RhdGUgPiBAc3RhdGVcblx0XHRcdEBzdGF0ZSA9IHN0YXRlXG5cdFx0XHRAZW1pdCggXCJzdGF0ZVwiLCBAZ2V0U3RhdGUoKSApXG5cdFx0cmV0dXJuIHN0YXRlXG5cblx0X3ZhbGlkYXRlOiA9PlxuXHRcdF9zaXplID0gQGZpbGUuc2l6ZSAvIDEwMjRcblx0XHRpZiBAb3B0aW9ucy5tYXhzaXplID4gMCBhbmQgQG9wdGlvbnMubWF4c2l6ZSA8IF9zaXplXG5cdFx0XHRAdmFsaWRhdGlvbi5wdXNoIFwibWF4c2l6ZVwiXG5cblx0XHRpZiBAb3B0aW9ucy5hY2NlcHRSdWxlcz8ubGVuZ3RoIGFuZCBub3QgQF90ZXN0TWltZSggQG9wdGlvbnMuYWNjZXB0UnVsZXMgKVxuXHRcdFx0QHZhbGlkYXRpb24ucHVzaCBcImFjY2VwdFwiXG5cblx0XHRpZiBAdmFsaWRhdGlvbi5sZW5ndGhcblx0XHRcdEBfc2V0U3RhdGUoIDYgKVxuXHRcdFx0QGVtaXQoIFwiaW52YWxpZFwiLCBAdmFsaWRhdGlvbiApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5pbnZhbGlkXCIsIEAsIEB2YWxpZGF0aW9uIClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiB0cnVlXG5cblx0X3Rlc3RNaW1lOiAoIGFjY2VwdFJ1bGVzICk9PlxuXHRcdGZvciBfcnVsZSBpbiBhY2NlcHRSdWxlc1xuXHRcdFx0aWYgX3J1bGUoIEBmaWxlIClcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRyZXR1cm4gZmFsc2VcblxuXHRfbm93OiAtPlxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCBEYXRlLm5vdygpIC8gMTAwMCApXG5cblx0X3JneEZpbGUyS2V5OiAvKFteQS1aYS16MC05XSkvaWdcblx0X3NpZ246ID0+XG5cdFx0X25hbWUgPSBAZ2V0TmFtZSgpXG5cdFx0X2NvbnRlbnRfdHlwZSA9IEBnZXRUeXBlKClcblx0XHRpZiBAc3RhdGUgPiAxXG5cdFx0XHRyZXR1cm5cblx0XHRAdXJsID0gQG9wdGlvbnMuaG9zdCArIEBvcHRpb25zLmRvbWFpbiArIFwiL1wiICsgQGtleVxuXHRcdEBqc29uID1cblx0XHRcdGJsb2I6IHRydWVcblx0XHRcdGFjbDogQG9wdGlvbnMuYWNsXG5cdFx0XHR0dGw6IEBvcHRpb25zLnR0bFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0ZmlsZW5hbWU6IF9uYW1lXG5cblx0XHRAanNvbi53aWR0aCA9IEBvcHRpb25zLndpZHRoIGlmIEBvcHRpb25zLndpZHRoP1xuXHRcdEBqc29uLmhlaWdodCA9IEBvcHRpb25zLmhlaWdodCBpZiBAb3B0aW9ucy5oZWlnaHQ/XG5cblx0XHRAanNvbi50YWdzID0gQG9wdGlvbnMudGFncyBpZiBAb3B0aW9ucy50YWdzP1xuXHRcdEBqc29uLnByb3BlcnRpZXMgPSBAb3B0aW9ucy5wcm9wZXJ0aWVzIGlmIEBvcHRpb25zLnByb3BlcnRpZXM/XG5cdFx0QGpzb25bIFwiY29udGVudC1kaXNwb3NpdGlvblwiIF0gPSBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXSBpZiBAb3B0aW9uc1sgXCJjb250ZW50LWRpc3Bvc2l0aW9uXCIgXT9cblxuXHRcdEBqc29uLmNvbnRlbnRfdHlwZSA9IF9jb250ZW50X3R5cGUgaWYgX2NvbnRlbnRfdHlwZT8ubGVuZ3RoXG5cblx0XHRAZW1pdCggXCJjb250ZW50XCIsIEBrZXksIEBqc29uIClcblx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5jb250ZW50XCIsIEAsIEBrZXksIEBqc29uIClcblxuXHRcdEBvcHRpb25zLnJlcXVlc3RTaWduRm4uY2FsbCBALCBAb3B0aW9ucy5kb21haW4sIEBvcHRpb25zLmFjY2Vzc2tleSwgQHVybCwgQGtleSwgQGpzb24sICggZXJyLCBzaWduYXR1cmUgKT0+XG5cdFx0XHRpZiBlcnJcblx0XHRcdFx0QGVycm9yID0gZXJyXG5cdFx0XHRcdEBfc2V0U3RhdGUoIDcgKVxuXHRcdFx0XHRAZW1pdCggXCJlcnJvclwiLCBlcnIgKVxuXHRcdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5lcnJvclwiLCBALCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0aWYgQHVybC5pbmRleE9mKCBcIj9cIiApID49IDBcblx0XHRcdFx0QHVybCArPSBcIiZcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAdXJsICs9IFwiP1wiXG5cdFx0XHRAdXJsICs9ICggXCJzaWduYXR1cmU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIHNpZ25hdHVyZSApIClcblxuXHRcdFx0QF9zZXRTdGF0ZSggMiApXG5cdFx0XHRAZW1pdCggXCJzaWduZWRcIiApXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm5cblxuXHRfdXBsb2FkOiA9PlxuXHRcdGlmIEBzdGF0ZSA+IDJcblx0XHRcdHJldHVyblxuXHRcdEBfc2V0U3RhdGUoIDMgKVxuXHRcdGRhdGEgPSBuZXcgRm9ybURhdGEoKVxuXHRcdGRhdGEuYXBwZW5kKCBcIkpTT05cIiwgSlNPTi5zdHJpbmdpZnkoIEBqc29uICkgKVxuXHRcdGRhdGEuYXBwZW5kKCBcImJsb2JcIiwgQGZpbGUgKVxuXHRcdFxuXHRcdF94aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRfeGhyLnVwbG9hZD8uYWRkRXZlbnRMaXN0ZW5lciggXCJwcm9ncmVzc1wiLCBAX2hhbmRsZVByb2dyZXNzKCksIGZhbHNlIClcblx0XHRfeGhyLmFkZEV2ZW50TGlzdGVuZXIoIFwicHJvZ3Jlc3NcIiwgQF9oYW5kbGVQcm9ncmVzcygpLCBmYWxzZSApXG5cdFx0X3hoci5faXNmaWxlID0gdHJ1ZVxuXHRcdFxuXHRcdEByZXF1ZXN0VXBsb2FkID0geGhyKCB7XG5cdFx0XHR4aHI6IF94aHJcblx0XHRcdHVybDogQHVybFxuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIlxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0sICggZXJyLCByZXNwLCBib2R5ICk9PlxuXHRcdFx0I2NvbnNvbGUubG9nIFwicmVxdWVzdFVwbG9hZFwiLCBlcnIsIHJlc3AsIGJvZHlcblx0XHRcdGlmIGVyclxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IGVyclxuXHRcdFx0XHRAZW1pdCggXCJlcnJvclwiLCBlcnIgKVxuXHRcdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5lcnJvclwiLCBALCBlcnIgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XG5cdFx0XHRfZGF0YSA9IEpTT04ucGFyc2UoIGJvZHkgKVxuXHRcdFx0aWYgcmVzcC5zdGF0dXNDb2RlID49IDMwMFxuXHRcdFx0XHRAX3NldFN0YXRlKCA3IClcblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSAwXG5cdFx0XHRcdEBlcnJvciA9IF9kYXRhXG5cdFx0XHRcdEBlbWl0KCBcImVycm9yXCIsIF9kYXRhIClcblx0XHRcdFx0QGNsaWVudC5lbWl0KCBcImZpbGUuZXJyb3JcIiwgQCwgX2RhdGEgKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdFxuXHRcdFx0QGRhdGEgPSBfZGF0YT8ucm93c1sgMCBdXG5cdFx0XHRAcHJvZ3Jlc3NTdGF0ZSA9IDFcblx0XHRcdEBfc2V0U3RhdGUoIDUgKVxuXHRcdFx0QGVtaXQoIFwiZG9uZVwiLCBAZGF0YSApXG5cdFx0XHRAY2xpZW50LmVtaXQoIFwiZmlsZS5kb25lXCIsIEAgKVxuXHRcdFx0cmV0dXJuXG5cdFx0KVxuXHRcdHJldHVyblxuXG5cdF9oYW5kbGVQcm9ncmVzczogPT5cblx0XHRyZXR1cm4gKCBldm50ICk9PlxuXHRcdFx0aWYgbm90IGV2bnQudGFyZ2V0Lm1ldGhvZD9cblx0XHRcdFx0QHByb2dyZXNzU3RhdGUgPSBldm50LmxvYWRlZC9ldm50LnRvdGFsXG5cdFx0XHRcdEBfc2V0U3RhdGUoIDQgKVxuXHRcdFx0XHRAZW1pdCggXCJwcm9ncmVzc1wiLCBAZ2V0UHJvZ3Jlc3MoKSwgZXZudCApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0cmV0dXJuXG5cblx0X2RlZmF1bHRSZXF1ZXN0U2lnbmF0dXJlOiAoIGRvbWFpbiwgYWNjZXNza2V5LCBtYWRpYWFwaXVybCwga2V5LCBqc29uLCBjYiApPT5cblx0XHRfdXJsID0gQG9wdGlvbnMuaG9zdCArIGRvbWFpbiArIFwiL3NpZ24vXCIgKyBhY2Nlc3NrZXlcblx0XHRcblx0XHRfeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG5cdFx0XG5cdFx0ZGF0YSA9IG5ldyBGb3JtRGF0YSgpXG5cdFx0ZGF0YS5hcHBlbmQoIFwidXJsXCIsIG1hZGlhYXBpdXJsIClcblx0XHRkYXRhLmFwcGVuZCggXCJrZXlcIiwga2V5IClcblx0XHRkYXRhLmFwcGVuZCggXCJqc29uXCIsIEpTT04uc3RyaW5naWZ5KCBqc29uICkgKVxuXHRcdHhocigge1xuXHRcdFx0eGhyOiBfeGhyXG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiXG5cdFx0XHR1cmw6IF91cmxcblx0XHRcdGJvZHk6IGRhdGFcblx0XHR9LCAoIGVyciwgcmVzcCwgc2lnbmF0dXJlICktPlxuXHRcdFx0aWYgZXJyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJnZXQgc2lnbiBlcnJvclwiLCBlcnJcblx0XHRcdFx0Y2IoIGVyciApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0Y2IoIG51bGwsIHNpZ25hdHVyZSApXG5cdFx0XHRyZXR1cm5cblx0XHQpXG5cdFx0cmV0dXJuXG5cdFx0XG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVcbiIsImRvbSA9IHJlcXVpcmUoIFwiZG9tZWxcIiApXG5cbmNsYXNzIEZpbGVWaWV3IGV4dGVuZHMgcmVxdWlyZShcIi4vYmFzZVwiKVxuXHRjb25zdHJ1Y3RvcjogKCBAZmlsZU9iaiwgQGNsaWVudCwgQG9wdGlvbnMgKS0+XG5cdFx0c3VwZXJcblxuXHRcdGlmIEBjbGllbnQucmVzdWx0VGVtcGxhdGVGbj8gYW5kIHR5cGVvZiBAb3B0aW9ucy5yZXN1bHRUZW1wbGF0ZUZuIGlzbnQgXCJmdW5jdGlvblwiXG5cdFx0XHRAdGVtcGxhdGUgPSBAY2xpZW50LnJlc3VsdFRlbXBsYXRlRm5cblx0XHRlbHNlXG5cdFx0XHRAdGVtcGxhdGUgPSBAX2RlZmF1bHRUZW1wbGF0ZVxuXG5cdFx0QGZpbGVPYmoub24oIFwicHJvZ3Jlc3NcIiwgQHVwZGF0ZSgpIClcblx0XHRAZmlsZU9iai5vbiggXCJkb25lXCIsIEB1cGRhdGUoKSApXG5cdFx0QGZpbGVPYmoub24oIFwiZXJyb3JcIiwgQHVwZGF0ZSgpIClcblx0XHRAZmlsZU9iai5vbiggXCJpbnZhbGlkXCIsIEB1cGRhdGUoKSApXG5cdFx0cmV0dXJuXG5cblx0cmVuZGVyOiA9PlxuXHRcdEBlbCA9IGRvbS5jcmVhdGUoIFwiZGl2XCIsIHsgY2xhc3M6XCJmaWxlIGNvbC1zbS02IGNvbC1tZC00XCIgfSApXG5cdFx0QGVsLmlubmVySFRNTCA9IEB0ZW1wbGF0ZSggQGZpbGVPYmouZ2V0RGF0YSgpIClcblx0XHRyZXR1cm4gQGVsXG5cblx0dXBkYXRlOiA9PlxuXHRcdHJldHVybiAoIGV2bnQgKT0+XG5cdFx0XHRAZWwuaW5uZXJIVE1MID0gQHRlbXBsYXRlKCBAZmlsZU9iai5nZXREYXRhKCkgKVxuXHRcdFx0cmV0dXJuXG5cblx0X2RlZmF1bHRUZW1wbGF0ZTogKCBkYXRhICktPlxuXHRcdF9odG1sID0gXCJcIlwiXG5cdDxkaXYgY2xhc3M9XCJ0aHVtYm5haWwgc3RhdGUtI3sgZGF0YS5zdGF0ZSB9XCI+XG5cdFx0PGI+I3sgZGF0YS5maWxlbmFtZX08L2I+XG5cdFx0XCJcIlwiXG5cdFx0c3dpdGNoIGRhdGEuc3RhdGVcblx0XHRcdHdoZW4gXCJwcm9ncmVzc1wiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIiN7ZGF0YS5wcm9ncmVzc31cIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAje2RhdGEucHJvZ3Jlc3N9JTtcIj5cblx0XHRcdFx0XHRcdDxzcGFuPiN7ZGF0YS5wcm9ncmVzc30lPC9zcGFuPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XCJcIlwiXG5cdFx0XHR3aGVuIFwiZG9uZVwiXG5cdFx0XHRcdF9odG1sICs9IFwiXCJcIlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzdWx0XCI+XG5cdFx0XHRcdFx0PGEgaHJlZj1cIiN7ZGF0YS5yZXN1bHQudXJsfVwiIHRhcmdldD1cIl9uZXdcIj5GZXJ0aWchICggI3tkYXRhLnJlc3VsdC5rZXl9ICk8L2E+XG5cdFx0XHRcdFwiXCJcIlxuXHRcdFx0XHRmb3IgX2ssIF92IG9mIGRhdGEucmVzdWx0XG5cdFx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCIje2RhdGEubmFtZX1fI3sgZGF0YS5pZHggfV8je19rfVwiIHZhbHVlPVwiI3tfdn1cIj5cblx0XHRcdFx0XHRcIlwiXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdHdoZW4gXCJpbnZhbGlkXCJcblx0XHRcdFx0X2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXN1bHRcIj5cblx0XHRcdFx0XHQ8Yj5JbnZhbGlkPC9iPlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdFx0Zm9yIF9yZWFzb24gaW4gZGF0YS5pbnZhbGlkX3JlYXNvblxuXHRcdFx0XHRcdHN3aXRjaCBfcmVhc29uXG5cdFx0XHRcdFx0XHR3aGVuIFwibWF4c2l6ZVwiXG5cdFx0XHRcdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPkZpbGUgdG9vIGJpZy4gT25seSBmaWxlcyB1bnRpbCAje2RhdGEub3B0aW9ucy5tYXhzaXplfWtiIGFyZSBhbGxvd2VkLjwvZGl2PlwiXG5cdFx0XHRcdFx0XHR3aGVuIFwiYWNjZXB0XCJcblx0XHRcdFx0XHRcdFx0X2h0bWwgKz0gXCI8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1lcnJvclxcXCI+V3JvbmcgdHlwZS4gT25seSBmaWxlcyBvZiB0eXBlICN7ZGF0YS5vcHRpb25zLmFjY2VwdC5qb2luKCBcIiwgXCIgKX0gYXJlIGFsbG93ZWQuPC9kaXY+XCJcblxuXHRcdFx0XHQgX2h0bWwgKz0gXCJcIlwiXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcIlwiXCJcblx0XHRcdHdoZW4gXCJlcnJvclwiXG5cdFx0XHRcdF9odG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZXJyb3JcXFwiPkFuIEVycm9yIG9jY3VyZWQuPC9kaXY+XCJcblxuXHRcdFx0d2hlbiBcImFib3J0ZWRcIlxuXHRcdFx0XHRfaHRtbCArPSBcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWVycm9yXFxcIj5VcGxvYWQgYWJvcnRlZC48L2Rpdj5cIlxuXG5cdFx0X2h0bWwgKz0gXCJcIlwiXG5cdDwvZGl2PlxuXHRcdFwiXCJcIlxuXHRcdHJldHVybiBfaHRtbFxuXHRcdFxubW9kdWxlLmV4cG9ydHMgPSBGaWxlVmlld1xuIiwiQmFzZSA9IHJlcXVpcmUoIFwiLi9iYXNlXCIgKVxuRmlsZSA9IHJlcXVpcmUoIFwiLi9maWxlXCIgKVxuRmlsZVZpZXcgPSByZXF1aXJlKCBcIi4vZmlsZXZpZXdcIiApXG5cbkNsaWVudCA9IHJlcXVpcmUoIFwiLi9jbGllbnRcIiApXG5DbGllbnQuQmFzZSA9IEJhc2VcbkNsaWVudC5GaWxlID0gRmlsZVxuQ2xpZW50LkZpbGVWaWV3ID0gRmlsZVZpZXdcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRcbiIsIl9pbnRSZWdleCA9IC9eXFxkKyQvXG5cbm1vZHVsZS5leHBvcnRzID1cblx0aXNBcnJheTogKCB2ciApLT5cblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2ciApIGlzICdbb2JqZWN0IEFycmF5XSdcblxuXHRpc09iamVjdDogKCB2ciApLT5cblx0XHRyZXR1cm4gdnIgaXNudCBudWxsIGFuZCB0eXBlb2YgdnIgaXMgJ29iamVjdCdcblxuXHRpc1N0cmluZzogKCB2ciApLT5cblx0XHRyZXR1cm4gdHlwZW9mIHZyIGlzICdzdHJpbmcnIG9yIHZyIGluc3RhbmNlb2YgU3RyaW5nXG5cblx0aXNJbnQ6ICggdnIgKS0+XG5cdFx0cmV0dXJuIF9pbnRSZWdleC50ZXN0KCB2ciApXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKipcbiAqIGxvZGFzaCAzLjIuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vhc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJ2xvZGFzaC5fY3JlYXRlYXNzaWduZXInKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uYXNzaWduYCBmb3IgY3VzdG9taXppbmcgYXNzaWduZWQgdmFsdWVzIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLCBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplcih2YWx1ZSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuXG4gICAgaWYgKChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB8fFxuICAgICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4yLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlQ29weSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWNvcHknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsXG4gKiBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIHNvdXJjZSA9PSBudWxsXG4gICAgPyBvYmplY3RcbiAgICA6IGJhc2VDb3B5KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb3B5KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2JpbmRjYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJ2xvZGFzaC5yZXN0cGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhc3NpZ25zIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byBhIGdpdmVuXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgYF8uYXNzaWduYCwgYF8uZGVmYXVsdHNgLCBhbmQgYF8ubWVyZ2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdFBhcmFtKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzW2xlbmd0aCAtIDJdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkLFxuICAgICAgICB0aGlzQXJnID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VzdG9taXplciA9IGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCA1KTtcbiAgICAgIGxlbmd0aCAtPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21pemVyID0gdHlwZW9mIHRoaXNBcmcgPT0gJ2Z1bmN0aW9uJyA/IHRoaXNBcmcgOiB1bmRlZmluZWQ7XG4gICAgICBsZW5ndGggLT0gKGN1c3RvbWl6ZXIgPyAxIDogMCk7XG4gICAgfVxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUNhbGxiYWNrYCB3aGljaCBvbmx5IHN1cHBvcnRzIGB0aGlzYCBiaW5kaW5nXG4gKiBhbmQgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHRoaXNBcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjkgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsIi8qKlxuICogbG9kYXNoIDMuNi4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9GdW5jdGlvbnMvcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzYXkgPSBfLnJlc3RQYXJhbShmdW5jdGlvbih3aGF0LCBuYW1lcykge1xuICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAqIH0pO1xuICpcbiAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiByZXN0UGFyYW0oZnVuYywgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogKCtzdGFydCB8fCAwKSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN0W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCByZXN0KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCByZXN0KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdFBhcmFtO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBnZXROYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guX2dldG5hdGl2ZScpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eXFxkKyQvO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2tleXMnKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIGxlbmd0aCA9IChsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSkgJiYgbGVuZ3RoKSB8fCAwO1xuXG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGlzUHJvdG8gPSB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBsZW5ndGggPiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IChpbmRleCArICcnKTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoc2tpcEluZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpICYmXG4gICAgICAgICEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsIi8qKlxuICogbG9kYXNoIDMuOS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZuVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpIHdoaWNoIHJldHVybiAnZnVuY3Rpb24nIGZvciByZWdleGVzXG4gIC8vIGFuZCBTYWZhcmkgOCBlcXVpdmFsZW50cyB3aGljaCByZXR1cm4gJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGNvbnN0cnVjdG9ycy5cbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgcmV0dXJuIHJlSXNOYXRpdmUudGVzdChmblRvU3RyaW5nLmNhbGwodmFsdWUpKTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiByZUlzSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjQgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogbG9kYXNoIDMuMC40IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggZXF1aXZhbGVudHMgd2hpY2ggcmV0dXJuICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcnMuXG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIG9uY2UgPSByZXF1aXJlKFwib25jZVwiKVxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoXCJwYXJzZS1oZWFkZXJzXCIpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVhIUlxuY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0IHx8IG5vb3BcbmNyZWF0ZVhIUi5YRG9tYWluUmVxdWVzdCA9IFwid2l0aENyZWRlbnRpYWxzXCIgaW4gKG5ldyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QoKSkgPyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QgOiB3aW5kb3cuWERvbWFpblJlcXVlc3RcblxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iail7XG4gICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVhIUihvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGZ1bmN0aW9uIHJlYWR5c3RhdGVjaGFuZ2UoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgbG9hZEZ1bmMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcbiAgICAgICAgLy8gQ2hyb21lIHdpdGggcmVxdWVzdFR5cGU9YmxvYiB0aHJvd3MgZXJyb3JzIGFycm91bmQgd2hlbiBldmVuIHRlc3RpbmcgYWNjZXNzIHRvIHJlc3BvbnNlVGV4dFxuICAgICAgICB2YXIgYm9keSA9IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmICh4aHIucmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VcbiAgICAgICAgfSBlbHNlIGlmICh4aHIucmVzcG9uc2VUeXBlID09PSBcInRleHRcIiB8fCAheGhyLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQgfHwgeGhyLnJlc3BvbnNlWE1MXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNKc29uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHlcbiAgICB9XG5cbiAgICB2YXIgZmFpbHVyZVJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAwLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIHVybDogdXJpLFxuICAgICAgICAgICAgICAgIHJhd1JlcXVlc3Q6IHhoclxuICAgICAgICAgICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JGdW5jKGV2dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgICAgICBpZighKGV2dCBpbnN0YW5jZW9mIEVycm9yKSl7XG4gICAgICAgICAgICBldnQgPSBuZXcgRXJyb3IoXCJcIiArIChldnQgfHwgXCJVbmtub3duIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpIClcbiAgICAgICAgfVxuICAgICAgICBldnQuc3RhdHVzQ29kZSA9IDBcbiAgICAgICAgY2FsbGJhY2soZXZ0LCBmYWlsdXJlUmVzcG9uc2UpXG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhICYgcHJvY2VzcyB0aGUgcmVzcG9uc2UgaW4gYSBzcGVjaWFsIHJlc3BvbnNlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGxvYWRGdW5jKCkge1xuICAgICAgICBpZiAoYWJvcnRlZCkgcmV0dXJuXG4gICAgICAgIHZhciBzdGF0dXNcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICAgICAgaWYob3B0aW9ucy51c2VYRFIgJiYgeGhyLnN0YXR1cz09PXVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9JRTggQ09SUyBHRVQgc3VjY2Vzc2Z1bCByZXNwb25zZSBkb2Vzbid0IGhhdmUgYSBzdGF0dXMgZmllbGQsIGJ1dCBib2R5IGlzIGZpbmVcbiAgICAgICAgICAgIHN0YXR1cyA9IDIwMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gKHhoci5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB4aHIuc3RhdHVzKVxuICAgICAgICB9XG4gICAgICAgIHZhciByZXNwb25zZSA9IGZhaWx1cmVSZXNwb25zZVxuICAgICAgICB2YXIgZXJyID0gbnVsbFxuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IDApe1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgYm9keTogZ2V0Qm9keSgpLFxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaSxcbiAgICAgICAgICAgICAgICByYXdSZXF1ZXN0OiB4aHJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMpeyAvL3JlbWVtYmVyIHhociBjYW4gaW4gZmFjdCBiZSBYRFIgZm9yIENPUlMgaW4gSUVcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzID0gcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVyciA9IG5ldyBFcnJvcihcIkludGVybmFsIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXNwb25zZSwgcmVzcG9uc2UuYm9keSlcblxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBvcHRpb25zID0geyB1cmk6IG9wdGlvbnMgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgaWYodHlwZW9mIGNhbGxiYWNrID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2FsbGJhY2sgYXJndW1lbnQgbWlzc2luZ1wiKVxuICAgIH1cbiAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spXG5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgfHwgbnVsbFxuXG4gICAgaWYgKCF4aHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29ycyB8fCBvcHRpb25zLnVzZVhEUikge1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YRG9tYWluUmVxdWVzdCgpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5XG4gICAgdmFyIGFib3J0ZWRcbiAgICB2YXIgdXJpID0geGhyLnVybCA9IG9wdGlvbnMudXJpIHx8IG9wdGlvbnMudXJsXG4gICAgdmFyIG1ldGhvZCA9IHhoci5tZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCBcIkdFVFwiXG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHkgfHwgb3B0aW9ucy5kYXRhXG4gICAgdmFyIGhlYWRlcnMgPSB4aHIuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fVxuICAgIHZhciBzeW5jID0gISFvcHRpb25zLnN5bmNcbiAgICB2YXIgaXNKc29uID0gZmFsc2VcbiAgICB2YXIgdGltZW91dFRpbWVyXG5cbiAgICBpZiAoXCJqc29uXCIgaW4gb3B0aW9ucykge1xuICAgICAgICBpc0pzb24gPSB0cnVlXG4gICAgICAgIGhlYWRlcnNbXCJhY2NlcHRcIl0gfHwgaGVhZGVyc1tcIkFjY2VwdFwiXSB8fCAoaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiICYmIG1ldGhvZCAhPT0gXCJIRUFEXCIpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSB8fCAoaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuanNvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeXN0YXRlY2hhbmdlXG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGdW5jXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvckZ1bmNcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICB4aHIub250aW1lb3V0ID0gZXJyb3JGdW5jXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmksICFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKVxuICAgIC8vaGFzIHRvIGJlIGFmdGVyIG9wZW5cbiAgICBpZighc3luYykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFvcHRpb25zLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgICAvLyBDYW5ub3Qgc2V0IHRpbWVvdXQgd2l0aCBzeW5jIHJlcXVlc3RcbiAgICAvLyBub3Qgc2V0dGluZyB0aW1lb3V0IG9uIHRoZSB4aHIgb2JqZWN0LCBiZWNhdXNlIG9mIG9sZCB3ZWJraXRzIGV0Yy4gbm90IGhhbmRsaW5nIHRoYXQgY29ycmVjdGx5XG4gICAgLy8gYm90aCBucG0ncyByZXF1ZXN0IGFuZCBqcXVlcnkgMS54IHVzZSB0aGlzIGtpbmQgb2YgdGltZW91dCwgc28gdGhpcyBpcyBiZWluZyBjb25zaXN0ZW50XG4gICAgaWYgKCFzeW5jICYmIG9wdGlvbnMudGltZW91dCA+IDAgKSB7XG4gICAgICAgIHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFib3J0ZWQ9dHJ1ZS8vSUU5IG1heSBzdGlsbCBjYWxsIHJlYWR5c3RhdGVjaGFuZ2VcbiAgICAgICAgICAgIHhoci5hYm9ydChcInRpbWVvdXRcIilcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKFwiWE1MSHR0cFJlcXVlc3QgdGltZW91dFwiKVxuICAgICAgICAgICAgZS5jb2RlID0gXCJFVElNRURPVVRcIlxuICAgICAgICAgICAgZXJyb3JGdW5jKGUpXG4gICAgICAgIH0sIG9wdGlvbnMudGltZW91dCApXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmhlYWRlcnMgJiYgIWlzRW1wdHkob3B0aW9ucy5oZWFkZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpXG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG5cbiAgICBpZiAoXCJiZWZvcmVTZW5kXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG5cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGl0ZXJhdG9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBjb250ZXh0ID0gdGhpc1xuICAgIH1cbiAgICBcbiAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJylcbiAgICAgICAgZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJylcbiAgICAgICAgZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlXG4gICAgICAgIGZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksIGkpKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrIGluIG9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHN0cmluZyA9IHRvU3RyaW5nLmNhbGwoZm4pXG4gIHJldHVybiBzdHJpbmcgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHxcbiAgICAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHN0cmluZyAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHx8XG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIC8vIElFOCBhbmQgYmVsb3dcbiAgICAgKGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5hbGVydCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8XG4gICAgICBmbiA9PT0gd2luZG93LnByb21wdCkpXG59O1xuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpO1xufTtcblxuZXhwb3J0cy5yaWdodCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuICAsIGlzQXJyYXkgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgLCBrZXkgPSB0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAsIHZhbHVlID0gdHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSlcblxuICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gWyByZXN1bHRba2V5XSwgdmFsdWUgXVxuICAgICAgICB9XG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59Il19
