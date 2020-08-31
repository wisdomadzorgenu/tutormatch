const request = require('supertest');
const express = require("express");
const app = express();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

//use should
chai.should();
chai.use(chaiAsPromised);

const testDBConnection = require("../private/config/testDBConnection");
const executeDbMigrations = require("../private/config/database-migration");

//create test database connection and set to locals
app.locals.connection = testDBConnection;

//require app configuration and  routes
const config = require("../private/config/serverConfig")(app);
const routes = require("../private/routes/routes-definition")(app);
app.use(config);
app.use("",routes);

//Routes TESTS
describe('Routes Tests',function(){
   this.timeout(10000); // this test can take up to 10 seconds

   before(function(){      
      //exectue all pending database migrations before running tests
      return executeDbMigrations(testDBConnection);
   })

   it('get all tutor information response with json and tutor data',function(){
      return request(app).get("/tutors")
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.tutorInformation").be.an("array");
   })

   it('should reject tutor creation form when invalid information is provided',function(){
      return request(app).post("/create-tutor")
         .set('Accept', 'application/json')         
         .send({name: null})
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.isValid").be.false;
   })

   it('should create new tutor information',function(){
      return request(app).post("/create-tutor")
         .set('Accept', 'application/json')         
         .send({name: "Obed Darko"})
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.tutorID").be.a("string");
   })

   it("should reject update when no tutor information is provided",function(){
      return request(app).post("/update-tutor")
         .set('Accept', 'application/json')         
         .send({})
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.isValid").be.false;
   })

   it("should update tutor information",function(){
      //first create tutor and update
      return request(app).post("/create-tutor")
         .set('Accept', 'application/json')         
         .send({name: "Nelson Darko"})
         .then((response)=>{
            //get tutor ID from response
            let tutorID = response.body.tutorID;
            let newName = "Nelson Smith";

            //update user's name
            return request(app).post("/update-tutor")
               .set('Accept', 'application/json')         
               .send({tutorID:tutorID,tutorName:newName})
               .should.eventually.be.fulfilled.and.include({status:200})
               .and.nested.property("body.isUpdated").be.true;      
         })
   })

   it("should reject delete when no tutor ID is provided ",function(){
      return request(app).post("/delete-tutor")
         .set('Accept', 'application/json')         
         .send({})
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.isValid").be.false;
   })

   it('should delete tutor information',function(){
      //first create tutor and update
      return request(app).post("/create-tutor")
         .set('Accept', 'application/json')         
         .send({name: "Nelson Darko Delete"})
         .then((response)=>{
            //get tutor ID from response
            let tutorID = response.body.tutorID;

            //update user's name
            return request(app).post("/delete-tutor")
               .set('Accept', 'application/json')         
               .send({tutorID:tutorID})
               .should.eventually.be.fulfilled.and.include({status:200})
               .and.nested.property("body.isDeleted").be.true;      
         })   
   })

   it('should indicate message when an invalid route is reached',function(){
      return request(app).get("/some-tutor")
         .should.eventually.be.fulfilled.and.include({status:200})
         .and.nested.property("body.invalidResource").be.true;
   })
   
})