'use strict';

const Joi = require('joi');

const joiStringTrim = Joi.string().trim();

const joiStringTrimRequired = joiStringTrim.required();

module.exports = {
    joiStringTrim,
    joiStringTrimRequired
};
