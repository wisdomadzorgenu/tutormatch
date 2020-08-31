const Promise = require("bluebird");

/**
 * This class serves as a controller for the tutor management system
 * All database operations are handled here.
 */
class TutorManagementClass {
   constructor(connection){
      this.connection = connection;
      this.tutorInfoModel = null;

      //initialize table model
      this.initializeTableInfoModel();
   }
   
   /**
    * Initialize table model
    * Use the custom model's object
    */
   initializeTableInfoModel(){
      if(this.connection && this.connection.customModels &&
         this.connection.customModels["tutor-information"]){
            this.tutorInfoModel = this.sequelizeConnection.customModels["tutor-information"];
      }
      else {
         this.tutorInfoModel = require("../models/tutor-information")(this.connection);
      }
   }

   /**
    * Save/Create new tutor information
    * @param {string} tutorName
    * @returns {Promise}
    */
   saveTutorInformation(tutorName){
      //a tutor name is required
      if(!tutorName)
         return Promise.reject("A tutor name is required");

         //insert new information
      return this.tutorInfoModel.create({
         tutorName:tutorName
      });
   }

   /**
    * Update tutor's name
    * @param {string} tutorID
    * @param {string} tutorName
    * @returns Promise
    */
   updateTutorInformation(tutorID,tutorName){
      //a tutor name and ID is required
      if(!tutorName || !tutorID)
         return Promise.reject("A valid tutor name or ID is required");
   
      return this.tutorInfoModel.update({tutorName:tutorName},{
         where:{id:tutorID}
      });
   }

   /**
    * Get all tutors information
    * @param {String} tutorID  - defaults to null
    * @returns {Promise}
    */
   getTutorsInformation(tutorID=null){
      let whereQuery = {};

      if(tutorID){
         whereQuery = {id:tutorID};
      }

      //find all tutors information, returning only the tutor's name & id
      return this.tutorInfoModel.findAll({
            where:whereQuery,
            attributes:['tutorName',['id','tutorID']]
         })
         .then((results)=>{
            //loop through the array and return the simple objects
            return results.map(obj=>{
               //return only the  simple  objects not the whole instance
               return obj.get({plain:true});
            });
         });
   }

   /**
    * Delete a specific tutor information
    * @param {string} tutorID
    * @returns {Promise}
    */
   deleteTutorInformation(tutorID){
      //a tutor name and ID is required
      if(!tutorID)
         return Promise.reject("A valid tutor ID is required");

      return this.tutorInfoModel.destroy({
         where:{id:tutorID}
      });
   }
}

module.exports = TutorManagementClass;