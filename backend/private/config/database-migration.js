/**
 * AUTOMATIC MIGRATION SCRIPT FOR TUTOR-MANAGEMENT SQLITE DATABASE
 * using umzug library
 */
const Umzug = require('umzug');
const path = require("path");
const _ = require("lodash");

/**
 * Execute all pending migrations before application starts
 * @returns {Promise}
 */
module.exports = function(dbConnection)
{
   //get query interface for migration 
   const migration = dbConnection.getQueryInterface();
   const DataTypes = dbConnection.constructor;

   //define migrations files directory 
   const MIGRATIONS_DIR = path.resolve(__dirname,"..","migrations");

   const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
         sequelize: dbConnection,
      },
      migrations: {
         params: [migration,DataTypes],
         //path to sequelize-master migration
         path: MIGRATIONS_DIR,
         pattern: /\.js$/
      }
  });

  //return a promise
  return umzug.pending()
   .then(function(pendingMigrations)
   {
      // expected: "migrations" will be an Array with the names of
      // pending migrations.

      //BUG: migrations not array of strings but array of objects instead
      //TEMPORAL BUG FIX: map to a string if not a string
      pendingMigrations = pendingMigrations.map(migrationInfo=>{
         let file = "";

         if(_.isString(migrationInfo)){
            file = migrationInfo;
         }
         else if(_.isObject(migrationInfo) && migrationInfo.file){
            file = migrationInfo.file;
         }

         //replace any .js with ''
         return file.replace(/\.js$/, '');
      });

      //execute the pending migrations
      return umzug.execute({ migrations: pendingMigrations,method: 'up' });
   }).then(function(migrations) {
      // "migrations" will be an Array of all executed/reverted migrations.
      return {isReady:true};
   });
}
