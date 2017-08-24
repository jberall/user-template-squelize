'use strict';

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
                // internals.getUser(request.payload, (err, user) => {

                //     if (err) {
                //         return reply(Boom.unauthorized(err)); // "oh, no!"
                //     }

                //     const userAccount = Hoek.clone(user);
                //     const sid = String(userAccount.id);
                //     delete userAccount.password;
                //     return reply(userAccount);
                //     // request.server.app.cache.set(sid, { account: userAccount }, 0, (err) => {

                //     //     if (err) {
                //     //         return reply(Boom.unauthorized(err));
                //     //     }

                //     //     request.cookieAuth.set({ sid });
                //     //     return reply(userAccount);
                //     // });
                // });
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

    // server.route({
    //     method: 'GET',
    //     path: internals.prefix + '/generate',
    //     config: {
    //         auth: false,
    //         description: 'Get crumb to start session.',
    //         handler: (request, reply) => {

    //             // Read docs about automatically setting crumb to viewContext.
    //             // This allows crumbs to be placed into views.
    //             // generate route built for CORS receive a authentic crumb.

    //             return reply({ crumb: request.plugins.crumb });
    //         }
    //     }
    // });

    return next();
};
