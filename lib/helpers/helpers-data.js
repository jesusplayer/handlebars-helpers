/**
 * Handlebars Helpers: Data
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */
'use strict';


// Node.js
var fs = require('fs');


// node_modules
var _ = require('lodash');


// Local utils
var Utils = require('../utils/utils');


// The module to be exported
var helpers = {

  /**
   * {{value}}
   * Extract a value from a specific property
   * @param  {[type]} filepath [description]
   * @param  {[type]} prop     [description]
   * @return {[type]}          [description]
   */
  value: function (filepath, prop) {
    filepath = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    prop = _.pick(filepath, prop);
    prop = _.pluck(prop);
    return new Utils.safeString(prop);
  },

  /**
   * {{prop}}
   * Extract a specific property
   * @param  {[type]} filepath [description]
   * @param  {[type]} prop     [description]
   * @return {[type]}          [description]
   */
  prop: function (filepath, prop) {
    filepath = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    prop = _.pick(filepath, prop);
    return new Utils.safeString(JSON.stringify(prop, null, 2));
  },

  /**
   * {{stringify}}
   * Stringify an object to JSON
   * @param  {(object|string)} data Object to stringify (or path of JSON file)
   * @return {string}
   */
  stringify: function (data) {
    if (typeof data === 'string') {
      data = JSON.parse(fs.readFileSync(data, 'utf8'));
    }
    return new Utils.safeString(JSON.stringify(data, null, 2));
  },

  /**
   * {{parseJSON}}
   * Contributed by github.com/keeganstreet
   */
  parseJSON: function (data, options) {
    return options.fn(JSON.parse(data));
  },
  /**
   * var obj ={
       getVal1:function(){
         return {name:120};
       },
       getVal2:{
         ob:{
          name:'Alan'
          age:{value:15} 
         }
       },
       table:['name','age'],
       name:'My Name'
     }
   * if obj is the context Object
   * {{get getVal1 'name'}}  //return 120
   *  {{get getVal2 'ob.age.value'}}  //return 15
   * {{get this '{{get table 'name'}}'}}  // return My Name
   * 
   * Extract a value from a specific property
   * @param  {[Object or Function]} object_or_fn []
   * @param  {[string]} valuePath     [the string contain a ptath to the value, it can also contains a Handlebars syntax]
   * @return {[type]}          [description]
   */
  get: function (object_or_fn, valuePath, options) {
        var valuePath = typeof object_or_fn == 'string' ? object_or_fn : valuePath||"";
        var object_or_fn = typeof  object_or_fn == 'string' ? this : object_or_fn;

        valuePath = Handlebars.compile(valuePath)(this);

        valuePath = valuePath.split('.');
        var value = object_or_fn;

        for (var i = 0; i < valuePath.length; i++) {
            value = ((typeof value) == 'function') ? value() : value;
            value = value[valuePath[i]];
        }

        return ((typeof value) == 'function') ? value() : value;
    }

};

// Export helpers
module.exports.register = function (Handlebars, options) {
  options = options || {};

  /**
   * {{opt}} example helper
   * Return a property from the `assemble.options` object
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  helpers.opt = function(key) {
    return options[key] || "";
  };

  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, helpers[helper]);
    }
  }
};
