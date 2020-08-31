const _ = require("lodash");

module.exports = {
   name(value){
      //on words with valid characters are accepted
      return (value && _.isString(value) && value.match(/^[A-Za-z0-9-\s]+$/)) ? true : false;
   },
   id(value){
      //object id should exist and perhaps be a valid uuid
      return _.isString(value) ? true : false;
   }
}