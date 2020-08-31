const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = function(app){
   //define router
   const appRouter = express.Router();     

   //enable cors, body-parser
   appRouter.use(bodyParser.urlencoded({extended:true}));
   appRouter.use(bodyParser.json());

   //whitelist development domain for cors
   const originsWhitelist = ['http://localhost:4200','http://localhost:8080',];

   let corsOptions = {
      origin: function(origin, callback){
            let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
      },
      credentials:true
   };

   //use cors
   appRouter.use(cors(corsOptions));

   return appRouter;
}
