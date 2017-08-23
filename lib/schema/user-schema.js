'use strict';

const Joi = require('joi');
const Shortcuts = require('./joi-shortcuts');

const passwordSchema = Shortcuts.joiStringTrimRequired.min(3).max(8).example('Pass1');

const usernameSchema = Shortcuts.joiStringTrimRequired.min(3).max(8).example('user');

const loginSchema = Joi.object().keys({
    username: usernameSchema,
    password: passwordSchema
}).label('login').options({ abortEarly: false });

    
module.exports = {
    passwordSchema,
    usernameSchema,
    loginSchema
}