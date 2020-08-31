/*
 *===============================
 *  TUTOR INFORMATION DB SCHEMA
 *===============================
 * Schema defines tutor information table
 */

//require necessary variables
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

//use the already created sequelize connection instance in creating a model
module.exports = function(sequelizeConnection) {

   //create table model
   const tutorInfoModel = sequelizeConnection.define('tutor-information', {
      id: {primaryKey: true, type: DataTypes.UUIDV4, defaultValue: DataTypes.UUIDV4},
      tutorName:{type:DataTypes.TEXT},
      tutorSubjects:{
         type:DataTypes.TEXT,
         set(value){
            //stringify array before insertion
            let stringData = value ? JSON.stringify(value):JSON.stringify([]);

            this.setDataValue('tutorSubjects',stringData);
         },
         get(){
            //parse string to array before returning
            let tutorInfoString =  this.getDataValue('tutorSubjects');

            //return an empty array when data does not exist(or undefined)
            return tutorInfoString ? JSON.parse(tutorInfoString) : [];
         }
      },
   }, {});

   tutorInfoModel.associate = function(models) {
      // associations can be defined here
   };

  return tutorInfoModel;
};
