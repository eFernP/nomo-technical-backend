const { Op } = require("sequelize");
const Joi = require("joi");
const { db } = require("../models");
const sendResponse = require("../helpers/sendResponse");
const Metric = db.metric;

exports.createMetric = async (req, res) => {
  let status = 500;
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      status = 400;
      throw new Error(error.details[0].message);
    }
    const { name, value, timestamp } = req.body;

    const result = await Metric.findOrCreate({
      where: {
        name,
        value,
        timestamp,
      },
      defaults: {
        name,
        value,
        timestamp,
      },
    });

    const metric = result[0];
    const created = result[1]; //boolean

    if (!created) {
      status = 400;
      throw new Error("There is already a metric with this information");
    } else {
      return sendResponse(res, 200, "Metric created", metric);
    }
  } catch (error) {
    return sendResponse(res, status, error.message);
  }
};

exports.getMetrics = async (req, res) => {
  let status = 500;
  try {
    const { average } = req.params;
    const metrics = await Metric.findAll({
      where: {},
      order: [
        ["name", "ASC"],
        ["timestamp", "ASC"],
      ],
    });

    if (metrics.length === 0) {
      status = 200;
      return sendResponse(res, 200, "No metrics in the database", []);
    }

    let finalMetrics;
    if (average === "minute") {
      finalMetrics = getAverage(metrics, 16, ":00");
    } else if (average === "hour") {
      finalMetrics = getAverage(metrics, 13, ":00:00");
    } else if (average === "day") {
      finalMetrics = getAverage(metrics, 10, "");
    } else {
      finalMetrics = metrics.map((m) => {
        const timestamp = changeDateFormat(new Date(m.dataValues.timestamp));
        const { id, name, value } = m.dataValues;
        return { id, name, value, timestamp };
      });
    }
    return sendResponse(res, 200, "Got metrics", finalMetrics);
  } catch (error) {
    return sendResponse(res, status, error.message);
  }
};

exports.updateMetric = async (req, res) => {
  let status = 500;
  try {
    const { id, name, value, timestamp } = req.body;

    const metricInstance = await Metric.findOne({
      where: { id },
    });
    if (metricInstance) {
      const { error } = schema.validate({ name, value, timestamp });
      if (error) {
        status = 400;
        throw new Error(error.details[0].message);
      }

      const metric = await metricInstance.update({ name, value, timestamp });
      return sendResponse(res, 200, "Metric updated correctly", metric);
    } else {
      status = 400;
      throw new Error("Metric has not been found");
    }
  } catch (error) {
    return sendResponse(res, status, error.message);
  }
};

exports.deleteMetric = async (req, res) => {
  let status = 500;
  try {
    const { id } = req.body;
    const result = await Metric.destroy({
      where: {
        id,
      },
    });
    if (result === 0) {
      status = 400;
      throw new Error("There is no metric to remove");
    } else {
      return sendResponse(res, 200, "Metric removed correctly");
    }
  } catch (error) {
    return sendResponse(res, status, error.message);
  }
};

const getAverage = (arr, tsLength, zeros) => {
  const groups = {};
  arr.forEach((m) => {
    const date = changeDateFormat(new Date(m.dataValues.timestamp));
    const timeGroup = `${date.slice(0, tsLength)}${zeros}`;
    const nameGroup = m.dataValues.name;

    if (!groups[nameGroup]) {
      groups[nameGroup] = {};
    }
    if (!groups[nameGroup][timeGroup]) {
      groups[nameGroup][timeGroup] = [m.dataValues.value];
    } else {
      groups[nameGroup][timeGroup].push(m.dataValues.value);
    }
  });

  const names = Object.keys(groups);

  const finalArr = [];
  names.forEach((n) => {
    const times = Object.keys(groups[n]);
    times.forEach((t) => {
      const total = groups[n][t].reduce((accumulator, v) => accumulator + v, 0);
      const value = total / groups[n][t].length;
      let metric = {};
      metric.name = n;
      metric.timestamp = t;
      metric.value = value;
      finalArr.push(metric);
    });
  });

  return finalArr;
};

const changeDateFormat = (date) => {
  const month = date.getMonth() + 1;
  return `${checkNumberFormat(date.getDate())}/${checkNumberFormat(
    month
  )}/${date.getFullYear()} ${checkNumberFormat(
    date.getHours()
  )}:${checkNumberFormat(date.getMinutes())}:${checkNumberFormat(
    date.getSeconds()
  )}`;
};

const checkNumberFormat = (number) => {
  return number < 10 ? `0${number}` : number;
};

const schema = Joi.object({
  name: Joi.string().max(50).required(),
  value: Joi.number().required(),
  timestamp: Joi.date().required(),
});
