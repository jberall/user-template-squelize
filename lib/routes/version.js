'use strict';

const Package = require('../../package.json');

const internals = {
    response: {
        version: Package.version
    }
};

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/version',
        config: {
            auth: false,
            description: 'Returns the version of the server from the package.json',
            handler: (request, reply) => {

                return reply(internals.response);
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'package version'
};
