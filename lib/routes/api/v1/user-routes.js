'use strict';

const Joi = require('joi');
const UserSchema = require('../../../schema/user-schema');

// Declare internals

const internals = {
    prefix: '/api/v1',
    tags: ['api', 'v1', 'user']
};

exports.register = (server, options, next) => {

    // Code inside the callback function of server.dependency will only be executed
    // after Auth plugin has been registered. It's triggered by server.start,
    // and runs before actual starting of the server.  It's done because the call to
    // server.route upon registration with auth: basic config would fail and make
    // the server crash if the basic strategy is not previously registered by Auth.

    server.dependency([], internals.after);

    return next();
};

exports.register.attributes = {
    name: 'ApiUser',
    version: '1.0.0'
};


internals.after = (server, next) => {

    server.route({
        method: 'POST',
        path: internals.prefix + '/login',
        config: {
            tags: internals.tags,
            description: 'Authenticates user credentials.',
            notes: `Checks payload for valid [username or email] and password.<br>
                    Not Valid: returns validation errors.<br>
                    Valid: goes to database and retrieve user information<br>
                    If no user retrieved returns error<br>
                    If user retrieved compares password.<br>
                    If no match returns error<br>
                    If password matches generates JWT and JWT record in database table jwt_session returns user without password
                    `,
            auth: false,
            // plugins: { 'hapi-auth-cookie': { redirectTo: false } },

            validate: {
                payload: UserSchema.loginSchema
            },
            handler: (request, reply) => {

                return reply(request.payload);
            }
        }
    });

    server.route({
        method: 'POST',
        path: internals.prefix + '/logout',
        config: {
            // auth: { strategy: 'session', mode: 'try' },
            // plugins: { 'hapi-auth-cookie': { redirectTo: true } },
            tags: internals.tags,
            description: 'Destroys authenticated users session.',
            handler: (request, reply) => {

                // request.cookieAuth.clear();
                return reply({ message: 'Logged out' });
            }
        }
    });

    server.route([{
        method: 'GET',
        path: '/api/v1/jwt-token',
        config: {
            // auth: { strategy: 'session', mode: 'try' },
            // plugins: { 'hapi-auth-cookie': { redirectTo: true } },
            tags: internals.tags,
            description: 'Returns a jsonwebtoken.',
            handler: (request, reply) => {
                const jwt = require('jsonwebtoken');
                const token = jwt.sign({ user: 'jberall' },'secret', { algorithm: 'HS256', expiresIn: "1m" });
                return reply({ token: token });
            }
        }        
    },{
        method: 'GET',
        path: '/api/v1/decode-jwt-token',
        config: {
            // auth: { strategy: 'session', mode: 'try' },
            // plugins: { 'hapi-auth-cookie': { redirectTo: true } },
            validate: {
                query: {
                    token: Joi.string().required()
                }
            },
            // auth: false,
            tags: internals.tags,
            description: 'Returns a decoded jsonwebtoken.',
            handler: (request, reply) => {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(request.query.token);
                return reply(decoded);
            }
        }        
    }]);

    return next();
};
