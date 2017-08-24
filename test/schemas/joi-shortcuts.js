'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const JoiShortcuts = require('../../lib/schema/joi-shortcuts');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('joi-shortcut', () => {

    it('validates joiStringTrim', (done) => {

        JoiShortcuts.joiStringTrim.validate('   trim   ', (err, value) => {

            expect(err).to.not.exist();
            expect(value.length).to.equal(4);
            done();
        });
    });

    it('validates joiStringTrim null', (done) => {

        JoiShortcuts.joiStringTrim.validate(null, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" must be a string');
            done();
        });
    });

    it('validates joiStringTrimRequired null', (done) => {

        JoiShortcuts.joiStringTrimRequired.validate(null, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" must be a string');
            done();
        });
    });

    it('validates joiStringTrimRequired empty string', (done) => {

        JoiShortcuts.joiStringTrimRequired.validate('  ', (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" is not allowed to be empty');
            done();
        });
    });
});
