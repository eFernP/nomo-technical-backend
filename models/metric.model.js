const Joi = require("joi");

const metric = (sequelize, Sequelize) => {
  const Metric = sequelize.define(
    "metric",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          max: 50,
        },
      },
      value: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return Metric;
};

exports.metric = metric;
