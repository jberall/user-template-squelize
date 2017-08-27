const Sequelize = require('sequelize');
const DbName = 'sequelize-demo';
const db = new Sequelize(DbName, 'postgres', 'Coast', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // logging: false,
    benchmark:true
  })
  db
  .authenticate()
  .then(() => {
    console.log(DbName + ' Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  }); 
module.exports = db