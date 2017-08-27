const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
    }
  },
  first_name: {
    type: Sequelize.STRING,
    validate: {
    }
  },
  last_name: {
    type: Sequelize.STRING,
    comment: 'could be last name or company name',
    validate: {
    }
  },
  scope: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    comment: 'contains the user roles',
    validate: {
    }
  }
},
{

})

module.exports = User