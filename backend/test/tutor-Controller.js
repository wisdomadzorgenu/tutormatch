const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const moment = require("moment");

//use should
chai.should();
chai.use(chaiAsPromised);

const testDBConnection = require("../private/config/testDBConnection");
const executeDbMigrations = require("../private/config/database-migration");
const TutorMgmtControllerClass =require("../private/classes/tutorManagementController");

//using the test database 
const tutorMgmtController = new TutorMgmtControllerClass(testDBConnection);
const timestampFormat = "DD-MM-YYYY HH:mm:ss";

//UNIT TESTS
describe('Tutor Management Controller Tests',function(){
   this.timeout(10000); // this test can take up to 10 seconds

   before(function(){      
      //exectue all pending database migrations before running tests
      return executeDbMigrations(testDBConnection);
   })

   it("should reject when no tutor information is provided while creating a new tutor",function(){
      return tutorMgmtController.saveTutorInformation().should.eventually.be.rejected;
   })

   it('should create a new tutor information with valid information',function(){
      //random name with timestamp
      let name = "Tutor Name - " + moment().format(timestampFormat);

      //save tutor information and ensure test succeeds
      return tutorMgmtController.saveTutorInformation(name)
         .should.eventually.be.fulfilled.and.be.an("object").that.has.nested.property("dataValues.id");
   })

   it("should reject when no tutor information is provided for update",function(){
      return tutorMgmtController.updateTutorInformation().should.eventually.be.rejected;
   })

   it("should update an existing tutor's information",function(){      
      let name = "Test Tutor Update Name - " + moment().format(timestampFormat);

      //create a dummy tutor information
      return tutorMgmtController.saveTutorInformation(name)
         .then((results)=>{
            //get result id
            let id = results.id;
            let newName = "Test Tutor Updated Name - " + moment().format(timestampFormat); 

            //update tutor information. Updating information returns 1 in an array
            return tutorMgmtController.updateTutorInformation(id,newName);
         })
         .should.eventually.be.fulfilled.and.be.an("array").that.include(1);
   })

   it("should reject when no tutor ID is provided during deletion",function(){
      return tutorMgmtController.deleteTutorInformation().should.eventually.be.rejected;
   })

   it("should delete an existing tutor",function(){
      let name = "Test Tutor Delete Name - " + moment().format(timestampFormat);

      //create a dummy tutor information
      return tutorMgmtController.saveTutorInformation(name)
         .then((results)=>{
            //get result id
            let id = results.id;

            //delete tutor information. Deleting information returns 1 in an array
            return tutorMgmtController.deleteTutorInformation(id);
         })
         .should.eventually.be.fulfilled.and.equal(1);
   })

   it("should return all created tutors",function(){
      return tutorMgmtController.getTutorsInformation()
         .should.eventually.be.fulfilled.and.be.an("array");
   })

   it("should contain created tutor information",function(){
      let name = "Test Tutor Created Name - " + moment().format(timestampFormat);

      //create a dummy tutor information
      return tutorMgmtController.saveTutorInformation(name)
         .then(results=>{
            let id = results.id;

            //get all tutor information
            return tutorMgmtController.getTutorsInformation()
               .should.eventually.be.fulfilled.and.be.an("array").that.deep.include({tutorName:name,tutorID:id});
         })
   })
});