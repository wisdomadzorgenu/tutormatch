const path = require('path');

module.exports = {
   development: {
      storage: path.join(__dirname, '..','..','..','database','tutor-management-system.db'),
      dialect: "sqlite"
   },
   production: {
      storage: path.join(__dirname, '..','..','..','database','tutor-management-system.db'),
      dialect: "sqlite"
   }
};
