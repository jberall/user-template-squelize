'use strict';

// Load modules


// Declare internals

const internals = {};


exports.register = (server, options, next) => {

    // Code inside the callback function of server.dependency will only be
    // executed after hapi-auth-jwt2 has been registered.  It's triggered by
    // server.start, and runs before actual starting of the server.  It's done because
    // the call to server.auth.strategy upon registration would fail and make the
    // server crash if the basic scheme is not previously registered by hapi-auth-basic.

    server.dependency('hapi-auth-jwt2', internals.after);

    return next();
};

exports.register.attributes = {
    name: 'JWT Auth'
};

internals.validateFunc = (decoded, request, callback) => {
        console.log(decoded);
        return callback(null, true);
       // do your checks to see if the person is valid 
    //    if (!people[decoded.id]) {
    //      return callback(null, false);
    //    }
    //    else {
    //      return callback(null, true);
    //    }
   };


internals.after = (server, next) => {

    server.auth.strategy('jwt', 'jwt', true,
        { key: 'secret',          // Never Share your secret key 
        validateFunc: internals.validateFunc,            // validate function defined above 
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm 
        });
    return next();
};
