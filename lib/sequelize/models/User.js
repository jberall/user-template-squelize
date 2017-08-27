module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    last_name: {
      type: DataTypes.STRING,
      comment: 'could be last name or company name',
      validate: {
      }
    },
    scope: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      comment: 'contains the user roles',
      validate: {
      }
    }
  });
}