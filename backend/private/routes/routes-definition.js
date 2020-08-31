const express = require("express");
const _ = require("lodash");
const TutorMgmtClass = require("../classes/tutorManagementController");
const ErrorLogger = require("../classes/errorLogger");
const validate = require("../functions/validate");

/**
 * Routes definition for tutor-management system
 * @returns {Object} 
 */
module.exports = function(app){
   const appRouter = express.Router();
   const dbConnection = app.locals.connection;
   let tutorMgmt = new TutorMgmtClass(dbConnection);

   /**
    * ====================
    *   GET ALL TUTORS
    * ====================
    */
   appRouter.get("/tutors",(req,res)=>{
      //retrieve tutorID if provided
      let tutorID = req.query && req.query.tutorID ? req.query.tutorID:null;

      //get all tutors' information
      tutorMgmt.getTutorsInformation(tutorID)
         .then(results=>{
            res.json({tutorInformation:results});      
         });
   });

   /**
    * ======================
    *   CREATE A NEW TUTOR
    * ======================
    */
   appRouter.post("/create-tutor",(req,res)=>
   {
      //get form information
      let tutorName = req.body.name ? req.body.name : null;

      //perform validations: only accept valid words
      if(validate.name(tutorName))
      {
         let response = {};

         //save tutor information and return id
         tutorMgmt.saveTutorInformation(tutorName)
            .then(results=>{  
               //server response            
               response = {
                  isValid:true, isSaved:true, tutorID:results.id,
                  message:'Tutor information was successfully saved.'
               };
            })
            .catch((err)=>{
               //log to file
               ErrorLogger.writeErrorsToLog(err.message,err.stack);

               //server response
               response = {
                  isValid:true, isSaved:false, tutorID:null,
                  message:"Sorry, could not save tutor's information."
               };
            })
            .finally(()=>{
               res.json(response);
            });
      }
      else {
         //validation failed
         res.json({
            isValid:false, isSaved:false, tutorID:null,
            message:'A valid tutor name is required'
         });   
      }
   });

   /**
    * ============================
    *   UPDATE TUTOR INFORMATION
    * ============================
    */
   appRouter.post("/update-tutor",(req,res)=>
   {
      //get form information
      let tutorID = req.body.tutorID ? req.body.tutorID : null;
      let tutorName = req.body.tutorName ? req.body.tutorName : null;

      //perform validations: only accept valid words and tutorID
      if(validate.id(tutorID) &&  validate.name(tutorName))
      {
         let response = {};

         //update tutor information 
         tutorMgmt.updateTutorInformation(tutorID,tutorName)
            .then(results=>{               
               //server response
               response = {isValid:true, isUpdated:true, message:'Tutor information was successfully updated.'};
            })
            .catch((err)=>{
               //log to file
               ErrorLogger.writeErrorsToLog(err.message,err.stack);

               //server response
               response = {isValid:true, isUpdated:false, message:"Sorry, could not update tutor's information."};
            })
            .finally(()=>{
               res.json(response);
            });
      }
      else {
         //validation failed
         res.json({isValid:false, isUpdated:false, message:'A valid tutor information is required'});   
      }
   });

   /**
    * ==================
    *  DELETE A TUTOR
    * ==================
    */
   appRouter.post("/delete-tutor",(req,res)=>{
      //get form information
      let tutorID = req.body.tutorID ? req.body.tutorID : null;

      //perform validations: only accept valid uuid
      if(validate.id(tutorID))
      {
         //general response
         let response = null;

         //delete tutor information and return id
         tutorMgmt.deleteTutorInformation(tutorID)
            .then(results=>{               
               //server response
               response = {
                  isValid:true, isDeleted:true,
                  message:"Tutor information was successfully deleted."
               };
            })
            .catch((err)=>{
               //log to file
               ErrorLogger.writeErrorsToLog(err.message,err.stack);

               //server response
               response = {
                  isValid:true, isDeleted:true,
                  message:"Sorry, could not delete tutor's information. A problem occurred. Please try again."
               };
            })
            .finally(()=>{
               res.json(response);
            });
      }
      else {
         //validation failed
         res.json({
            isValid:false, isDeleted:false,
            message:"A valid tutor information is required"
         });   
      }
   });

   /**
    * ======================
    *  ALL NOT FOUND ROUTES
    * ======================
    */   
   appRouter.use("*",(req,res,next)=>{
      res.json({invalidResource:true,message:"Route not found. Please provide a valid route"});
   });

   /**
    * ================
    *  ERROR HANDLER
    * ================
    */
   appRouter.use((err,req,res,next)=>{
      //log to file
      ErrorLogger.writeErrorsToLog(err.message,err.stack);

      res.status(500);
      res.json({message:"Sorry, an error occurred on the server. Please try again later."}); 
   });

   return appRouter;
}   

