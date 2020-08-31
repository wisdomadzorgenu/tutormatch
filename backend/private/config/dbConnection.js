/**
 *  DATABASE CONNECTION SCRIPT
 * This script establishes a connection with our sqlite database
 * using sqlite3 and sequelize driver and creating a connection object
 */
const fs = require('fs');
const Sequelize = require("sequelize");
const sqlite3 = require("sqlite3");
const path = require("path");

//define database dir path, models path and database name
const DB_DIR = path.resolve(__dirname,"..","database");
const DB_MODELS_DIR = path.resolve(__dirname,"..","models");
const TUTOR_MGMT_DB_PATH = path.join(DB_DIR,"tutor-management-system.db");

//TRY CREATING DB DIRECTORY FIRST
try {
   fs.mkdirSync(DB_DIR, { recursive: true });
} 
catch(err){
   //if directory exist, and error is thrown, ignore
}

//create sqlite database if it doesn't exist | connect to it
const TUTOR_MGMT_DB = new sqlite3.Database(TUTOR_MGMT_DB_PATH,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,function(err){});

//close the initially opened sqlite3 db. Sequelize will connect later
TUTOR_MGMT_DB.close();

//create connection with sequelize
const dbConnection = new Sequelize({
   dialect: 'sqlite',
   storage: TUTOR_MGMT_DB_PATH,
   // disable logging; default: console.log
   logging: false
});

//should contain all model instances
const modelInstances = {};

//grabs all the models in the model's directory & add them to the instance object
fs.readdirSync(DB_MODELS_DIR)
  .filter(file => {
      // only model files with .js extenstion( no '.' before file name)
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
     //import file and join
      const model = dbConnection['import'](path.join(DB_MODELS_DIR, file));
      modelInstances[model.name] = model;
  });

//Important: creates associations based on associations defined in
//associate function in the model files
Object.keys(modelInstances).forEach(modelName => {
   if (modelInstances[modelName].associate) {
      modelInstances[modelName].associate(modelInstances);
   }
});

//add db models info to sequelize instance
dbConnection.definedModels = modelInstances;

//export sequelize instace
module.exports = dbConnection;
