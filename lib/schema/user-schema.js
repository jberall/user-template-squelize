'use strict';

const Joi = require('joi');
const Owasp = require('@deloittesolutions/joi-owasp-extensions');
const Shortcuts = require('./joi-shortcuts');

const usernameSchema = Shortcuts.joiStringTrimRequired.min(4).max(20).example('user');
const passwordSchema = Owasp.password().strong().trim().required().example('Th@ra!1234').description('OWASP Password Strength. https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls');


const loginSchema = Joi.object().keys({
    username: usernameSchema,
    password: passwordSchema
}).label('login').options({ abortEarly: false, stripUnknown: true });


module.exports = {
    passwordSchema,
    usernameSchema,
    loginSchema
};
