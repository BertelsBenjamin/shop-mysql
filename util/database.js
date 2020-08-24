const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('node-complete', 'root', 'mypasswordformysql', {
    dialect: 'mysql', 
    host:'localhost'
});

module.exports = sequelize;