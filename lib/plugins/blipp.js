'use strict';

// Load modules

const Blipp = require('blipp');

// Declare internals

const internals = {};

exports.register = (server, options, next) =>  {

    exports.options = options; // TODO: find where export is used

    server.register({ register: Blipp, options }, (err) => {

        if (err) {
            return next(err);
        }

        return next();
    });
};

exports.register.attributes = {
    name: 'Blipp'
};
