'use strict';
// See: https://github.com/glennjones/hapi-swagger

const Swagger = require('hapi-swagger');
const pkg = require('../../package.json');

// Declare internals

const internals = {};

exports.register = (server, options, next) => {

    server.register({ register: Swagger, options }, (err) => {

        if (err) {
            return next(err);
        }

        return next();
    });
};

exports.register.attributes = {
    name: 'Swagger',
    dependencies: ['inert', 'vision']
};
