'use strict';

// Declare internals

const internals = {};

exports.register = (server, options, next) => {

    // Code inside the callback function of server.dependency will only be executed
    // after Auth plugin has been registered. It's triggered by server.start,
    // and runs before actual starting of the server.  It's done because the call to
    // server.route upon registration with auth: basic config would fail and make
    // the server crash if the basic strategy is not previously registered by Auth.

    server.dependency(['inert','vision'], internals.after);

    return next();
};

exports.register.attributes = {
    name: 'Test Results'
};


internals.after = (server, next) => {

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: '../../views',
        // partialsPath: '../views/partials',
        relativeTo: __dirname
    });

    server.route({
        method: 'GET',
        path: '/test-results',
        config: {
            cache: {
                expiresIn: 0,
                privacy: 'private'
            },
            description: 'Returns test results from the LAB tests.',
            auth: false,
            handler: (request, reply) => {

                return reply.view('test-results');
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'Test Results'
};
