'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
// const Joi = require('joi');
const UserSchema = require('../../lib/schema/user-schema');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/user-schema usernameSchema', () => {

    it('validates usernameSchema username:"jberall" accepts', (done) => {

        UserSchema.usernameSchema.validate('jberall', (err, value) => {

            expect(err).to.not.exist();
            expect(value.length).to.equal(7);
            done();
        });
    });

    it('validates usernameSchema with trim username:"  jberall  " accepts', (done) => {

        UserSchema.usernameSchema.validate('  jberall  ', (err, value) => {

            expect(err).to.not.exist();
            expect(value.length).to.equal(7);
            done();
        });
    });

    it('validates required usernameSchema username:null', (done) => {

        UserSchema.usernameSchema.validate(null, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" must be a string');
            done();
        });
    });

    it('validates required usernameSchema username: empty string', (done) => {

        UserSchema.usernameSchema.validate('', (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" is not allowed to be empty');
            done();
        });
    });

    it('validates min(4) usernameSchema username', (done) => {

        UserSchema.usernameSchema.validate('123', (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" length must be at least 4 characters long');
            done();
        });
    });

    it('validates max(20) usernameSchema username', (done) => {

        UserSchema.usernameSchema.validate('12345678901234567890A', (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal('"value" length must be less than or equal to 20 characters long');
            done();
        });
    });
});

/**
 * @url https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls
 Password must meet at least 3 out of the following 4 complexity rules
at least 1 uppercase character (A-Z)
at least 1 lowercase character (a-z)
at least 1 digit (0-9)
at least 1 special character (punctuation) — do not forget to treat space as special characters too
at least 10 characters
at most 128 characters
not more than 2 identical characters in a row (e.g., 111 not allowed)
 */
describe('/user-schema passwordSchema', () => {

    const errPasswordErrorMsg = '"value" needs to be a strong password';

    it('validates good passwordSchema password', (done) => {

        UserSchema.passwordSchema.validate('Th@ra!1234', (err, value) => {

            expect(err).to.not.exist();
            expect(value.length).to.equal(10);
            done();
        });
    });

    it('validates passwordSchema with trim password:"  Th@ra!1234  " accepts', (done) => {

        UserSchema.passwordSchema.validate('  Th@ra!1234  ', (err, value) => {

            expect(err).to.not.exist();
            expect(value.length).to.equal(10);
            done();
        });
    });

    it('fail at least 1 uppercase passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate('  th@rall1234  ', (err, value) => {
            // console.log(value);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });

    it('fail at least 1 lowercase passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate('  TH@RALL1234  ', (err, value) => {
            // console.log(value);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });

    it('fail at least 1 digit passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate('  Th@ra!abcd  ', (err, value) => {
            // console.log(value);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });

    it('fail special character passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate('  Thoral1234  ', (err, value) => {
            // console.log(value);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });

    it('fail min(10) passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate('  Th@ra!123  ', (err, value) => {
            // console.log(value);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });

    const maxpass = '  12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789Th@ra!1234  ';

    it('fail max(128) passwordSchema with trim password', (done) => {

        UserSchema.passwordSchema.validate(maxpass, (err, value) => {

            // console.log('maxpasslenght',maxpass.trim().length);
            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errPasswordErrorMsg);
            done();
        });
    });
});

describe('/user-schema loginSchema', () => {

    const errLoginPasswordMsg = '"password" needs to be a strong password';
    const errLoginUsernameMsg = '"username" length must be at least 4 characters long';

    const login = {
        username: 'jberall',
        password: 'Th@rall1234',
        unknown: 'strip me!'
    };

    it('passes good user and good password also test for stripUnknown', (done) => {

        UserSchema.loginSchema.validate(login, (err, value) => {

            expect(err).to.not.exist();
            done();
        });
    });

    it('fails bad user and good password', (done) => {

        login.username = 'jb';

        UserSchema.loginSchema.validate(login, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errLoginUsernameMsg);
            done();
        });
    });

    it('fails good user and bad password', (done) => {

        login.username = 'jberall';
        login.password = 'password';

        UserSchema.loginSchema.validate(login, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errLoginPasswordMsg);
            done();
        });
    });

    it('fails bad user and bad password', (done) => {

        login.username = 'jb';
        login.password = 'password';
        UserSchema.loginSchema.validate(login, (err, value) => {

            expect(err).to.exist();
            expect(err.details[0].message).to.equal(errLoginUsernameMsg);
            expect(err.details[1].message).to.equal(errLoginPasswordMsg);
            done();
        });
    });
});

