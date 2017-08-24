'use strict';
const LibPath = '../../../../';
// Load modules

const Code = require('code');
const Lab = require('lab');
const University = require(LibPath + 'lib');
const Path = require('path');
const Config = require(LibPath + 'lib/config');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/routes/api/v1/user-routes', () => {

    it('returns a login page via https with error because nothing posted', (done) => {

        University.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            const webTls = server.select('web-tls');

            const request = {
                method: 'POST',
                url: '/api/v1/login'
            };

            webTls.inject(request, (res) => {

                expect(res.statusCode, 'Status code').to.equal(400);

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
            plugin: './routes/api/v1/user-routes',
            options: {
                select: ['web-tls']
            }
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, LibPath + 'lib')
};
