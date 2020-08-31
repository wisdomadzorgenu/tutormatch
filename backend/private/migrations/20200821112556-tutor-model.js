'use strict';
module.exports = {
   up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('tutor-informations', {
         id: {
            primaryKey: true,
            allowNull: false,
            type: Sequelize.UUIDV4,
            defaultValue: Sequelize.UUIDV4
         },
         tutorName:{
            type:Sequelize.TEXT
         },
         tutorSubjects:{
            type: Sequelize.TEXT
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
         }
      });
   },
   down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('tutor-informations');
   }
};
