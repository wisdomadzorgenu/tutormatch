const express = require("express");
const app = express();
const ErrorLogger = require("./private/classes/errorLogger");

//create database connection and execute pending migrations
const dbConnection = require("./private/config/dbConnection");
const executeDbMigrations = require("./private/config/database-migration");

//create database connection and set to locals
app.locals.connection = dbConnection;

//exectue all pending database migrations before starting application
executeDbMigrations(dbConnection)
   .then((results)=>
   {
      //define and use app settings
      const config = require("./private/config/serverConfig")(app);
      app.use(config);

      //use defined routes
      const routes = require("./private/routes/routes-definition")(app);
      app.use("",routes);

      const PORT = process.env.PORT || 5500;
      app.listen(PORT,()=>{
         console.log(`Server listening on port ${PORT}`);
      });
   })
   .catch((err)=>{
      //log to file
      ErrorLogger.writeErrorsToLog(err.message,err.stack);

      // console.log(err);
      console.log('Server could not be started. An error occurred while starting up');
   });