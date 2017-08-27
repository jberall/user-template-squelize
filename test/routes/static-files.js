'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const Vision = require('vision');
const Inert = require('inert');
const Hoek = require('hoek');
const Path = require('path');
const Fs = require('fs');
const University = require('../../lib');
const Config = require('../../lib/config');
const StaticFiles = require('../../lib/routes/static-files');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/test-results', () => {

    it('ensures /test-results always redirected to use https', (done) => {

        University.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            const web = server.select('web');
            const webTls = server.select('web-tls');

            web.inject('/test-results', (res) => {

                expect(res.statusCode).to.equal(301);
                expect(res.headers.location).to.equal(webTls.info.uri + '/test-results');

                server.stop(done);
            });
        });
    });

    it('returns a test-results page via https', (done) => {

        University.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            const webTls = server.select('web-tls');

            const request = {
                method: 'GET',
                url: '/test-results'
            };

            webTls.inject(request, (res) => {

                expect(res.statusCode, 'Status code').to.equal(200);

                server.stop(done);
            });
        });
    });

    it('errors on failed registering of vision', { parallel: false }, (done) => {

        const orig = Vision.register;

        Vision.register = function (plugin, options, next) {

            Vision.register = orig;
            return next(new Error('fail'));
        };

        Vision.register.attributes = {
            name: 'fake vision'
        };

        University.init(internals.manifest, internals.composeOptions, (err) => {

            expect(err).to.exist();

            done();
        });
    });

    it('errors on missing vision plugin', (done) => {

        const manifest = Hoek.clone(internals.manifest);
        manifest.registrations.splice(0, 1);

        University.init(manifest, internals.composeOptions, (err, server) => {

            expect(err).to.exist();
            expect(err.message).to.equal('Plugin ' + StaticFiles.register.attributes.name + ' missing dependency ' + Vision.register.attributes.pkg.name +
                                            ' in connection: ' + server.select('web-tls').info.uri);

            done();
        });
    });

    it('errors on failed registering of inert', { parallel: false }, (done) => {

        const orig = Inert.register;

        Inert.register = function (plugin, options, next) {

            Inert.register = orig;

            return next(new Error('fail'));
        };

        Inert.register.attributes = {
            name: 'fake inert'
        };

        University.init(internals.manifest, internals.composeOptions, (err) => {

            expect(err).to.exist();

            done();
        });
    });

    it('errors on missing inert plugin', (done) => {

        const manifest = Hoek.clone(internals.manifest);
        manifest.registrations.splice(1, 1);

        University.init(manifest, internals.composeOptions, (err, server) => {

            expect(err).to.exist();
            expect(err.message).to.equal('Plugin ' + StaticFiles.register.attributes.name + ' missing dependency ' + Inert.register.attributes.pkg.name +
                                            ' in connection: ' + server.select('web-tls').info.uri);

            done();
        });
    });
    
    it('returns a constant.json list', (done) => {

        University.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            const web = server.select('web');
            const webTls = server.select('web-tls');

            web.inject('/api/constant.json', (res) => {

                expect(res.statusCode).to.equal(301);
                expect(res.headers.location).to.equal(webTls.info.uri + '/api/constant.json');

                server.stop(done);
            });
        });
    });

    it('returns the /api/constants.json', (done) => {

        University.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.select('web-tls').inject('/api/constants.json', (res) => {

                expect(res.statusCode).to.equal(200);
                const constantsTest = JSON.parse(Fs.readFileSync(__dirname + '/constants-test.json', 'utf8'));
                expect(JSON.parse(res.result)).to.equal(constantsTest);              

                server.stop(done);
            });
        });
    });

});

internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 0,
            labels: ['web']
        },
        {
            host: 'localhost',
            port: 0,
            labels: ['web-tls'],
            tls: Config.tls
        }
    ],
    registrations: [
        {
            plugin: 'vision'
        },
        {
            plugin: 'inert'
        },
        {
            plugin: './routes/static-files',
            options: {
                select: ['web-tls']
            }
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../../lib')
};
