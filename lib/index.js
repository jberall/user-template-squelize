'use strict';

// Load modules

const Glue = require('glue');
const Boom = require('boom');

// Declare internals

const internals = {};

exports.init = (manifest, options, next) => {

    Glue.compose(manifest, options, (err, server) => {

        if (err) {
            return next(err);
        }

        const web = server.select('web');
        const webTls = server.select('web-tls');

        // TLS everything

        web.ext('onRequest', (request, reply) => {

            return reply.redirect(webTls.info.uri + request.url.path).permanent();
        });

        webTls.ext('onPreResponse', (request, reply) => {

            if (request.response.isBoom) {

                // Handle Bad Route Attempt

                if (request.response.output.statusCode === 404 &&
                    request.response.message === 'Not Found') {

                    return reply(Boom.notFound('Route: ' + webTls.info.uri + request.url.path + ' does not exist.'));
                }
            }

            return reply.continue();
        });

        // Start the server

        server.start((err) => {

            return next(err, server);
        });
    });
};
