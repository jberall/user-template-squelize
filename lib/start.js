'use strict';

// Load modules

const Hoek = require('hoek');
const Server = require('./index');
const Config = require('./config');
const Pkg = require('../package.json');


// Declare internals

const internals = {};

internals.goodFilePath = (() => {

    const env = process.env.NODE_ENV;
    const name = env ? 'good ' + env + '.log' : 'good.log';
    return './log/' + name;
})();

internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 8000,
            labels: ['web']
        },
        {
            host: 'localhost',
            port: 8001,
            labels: ['web-tls'],
            tls: Config.tls
        }
    ],
    registrations: [
        {
            plugin: './routes/version',
            options: {
                select: ['web', 'web-tls']
            }
        },
        {
            plugin: './routes/test-results',
            options: {
                select: ['web', 'web-tls']
            }
        },
        {
            plugin: './routes/api/v1/user-routes',
            options: {
                select: ['web', 'web-tls']
            }
        },
        {
            plugin: './plugins/jwt-auth.js'
        },
        {
            plugin: 'hapi-auth-jwt2'
        },
        {
            plugin: 'vision'
        },
        {
            plugin: 'inert'
        },
        {
            plugin: {
                register: './plugins/good',
                options: {
                    ops: { interval: 1000 },
                    reporters: {
                        myConsoleReporter: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{ log: '*', response: '*', error: '*', request: '*' }]
                        }, {
                            module: 'good-console'
                        }, 'stdout'],
                        myFileReporter: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{ log: '*',  error: '*', request: '*' }]
                        }, {
                            module: 'good-squeeze',
                            name: 'SafeJson'
                        }, {
                            module: 'good-file',
                            args: [internals.goodFilePath]
                        }]
                    }
                }
            },
            options: {
                select: ['web', 'web-tls']
            }
        },
        {
            plugin: {
                register: './plugins/lout',
                options: {
                    endpoint: 'lout'
                    // auth: { strategy: 'session', mode: 'try', scope: ['admin'] }
                }
            },
            options: {
                select: ['web-tls']
            }
        },
        {
            plugin: {
                register:'./plugins/blipp',
                options: { showAuth: true }
            }
        },
        {
            plugin: {
                register:'./plugins/swagger',
                options: {
                    info: {
                        title: 'hapi-swagger-training documentation',
                        description: `
            This API is to demo various aspects of Hapi, Swagger, Nes, etc.
            
            To see all routes, [click here](/).
            
            To see V1 routes only, [click here](/?tags=v1).
            
            To see V2 routes only, [click here](/?tags=v2).
            
            To view the swagger.json, [click here](/swagger.json).
                            `,
                        // Get the version from package.json
                        version: Pkg.version,
                        contact: {
                            name: 'Clint Goodman',
                            url: 'https://cgwebsites.net/'
                        },
                        license: {
                            // Get the license from package.json
                            name: Pkg.license
                        }
                    },
                    // Setup the documentation to be the root of this host
                    documentationPath: '/',
                    jsonEditor: true,
                    tags: [{
                        'name': 'starwars',
                        'description': 'working with star wars data'
                    },{
                        'name': 'vote',
                        'description': 'working with voting'
                    },{
                        'name': 'user',
                        'description': 'working with users'
                    }],
                    // This is for use of grouping together paths.  Since each of our paths begin with `/api/v{1,2}`, we want to ignore those first to arguments in the path, since they won't help us group together resources
                    pathPrefixSize: 2,
                    // This is also used for grouping, though because of the line above, I don't believe that this line may be needed.  Seems to work with/without it.
                    basePath: '/api/',
                    // Also used for grouping paths together
                    pathReplacements: [{
                        // Replace the version in all paths
                        replaceIn: 'groups',
                        pattern: /v([0-9]+)\//,
                        replacement: ''
                    },{
                        // This allows grouping to include plural forms of the noun to be grouped with their singular counter-part (ie `characters` in the group `character`)
                        replaceIn: 'groups',
                        pattern: /s$/,
                        replacement: ''
                    },{
                        // Group all star wars related routes together
                        replaceIn: 'groups',
                        pattern: /\/(character|planet)/,
                        replacement: '/starwars'
                    }]
                }
            }
        }
    ]
};

internals.composeOptions = {
    relativeTo: __dirname // NOTE: use `Path.resolve(process.cwd() 'lib')` when using babel/typescript/rollup
};

Server.init(internals.manifest, internals.composeOptions, (err, server) => {

    Hoek.assert(!err, err);

    const web = server.select('web');
    const webTls = server.select('web-tls');

    server.log('Web server started at: ' + web.info.uri);
    server.log('WebTLS server started at: ' + webTls.info.uri);
});
