(function() {
  var FileView, dom,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  dom = require("domel");

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

  })(require("./base"));

  module.exports = FileView;

}).call(this);
