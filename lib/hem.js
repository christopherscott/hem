(function() {
  var Package, Sources, compilers, eco, fs, stitch;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  eco = require('eco');
  compilers = require('./compilers');
  stitch = require('../assets/stitch');
  Sources = require('./sources');
  Package = (function() {
    function Package(config) {
      var _ref, _ref2, _ref3;
      if (config == null) {
        config = {};
      }
      this.identifier = (_ref = config.identifier) != null ? _ref : 'require';
      this.libs = (_ref2 = config.libs) != null ? _ref2 : [];
      this.require = (_ref3 = config.require) != null ? _ref3 : [];
      if (typeof this.require === 'string') {
        this.require = [this.require];
      }
    }
    Package.prototype.compileSources = function() {
      this.sources || (this.sources = new Sources(this.require));
      return stitch({
        identifier: this.identifier,
        sources: this.sources.resolve()
      });
    };
    Package.prototype.compileLibs = function() {
      this.sources || (this.sources = new Sources(this.libs));
      return this.sources.resolve().join("\n");
    };
    Package.prototype.compile = function() {
      return [this.compileLibs(), this.compileSources()].join("\n");
    };
    Package.prototype.createServer = function() {
      return __bind(function(req, res, next) {
        var content;
        content = this.compile();
        res.writeHead(200, {
          'Content-Type': 'text/javascript'
        });
        return res.end(content);
      }, this);
    };
    return Package;
  })();
  module.exports = {
    compilers: compilers,
    Package: Package,
    createPackage: function(config) {
      return new Package(config);
    }
  };
}).call(this);