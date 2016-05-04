import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai';
var should = require('chai').should(); // actually call the function

import modules from './defines.js';

describe("When call API", function() {
    var $;
    jsdom();


    describe("create user", function() {
        beforeEach(function() {
            $ = require('jquery');
            sinon.stub($, 'ajax');
            this.API = require(modules.api).AccountAPI;
        });

        it("should POST to /api/users/", function() {
            var userdata = {username: "test", password: "test"};
            this.API.createAccount(userdata);

            var p = $.ajax.getCall(0).args[0];
            assert.equal(p.data, userdata);
            assert.equal(p.url, "/api/users/");

            userdata = {username: "Bobby", password: "123"};

            $.ajax.reset();

            this.API.createAccount(userdata);

            var p = $.ajax.getCall(0).args[0];
            assert.equal(p.data, userdata);
            assert.equal(p.url, "/api/users/");
        });

        afterEach(function() { $.ajax.restore(); });
    });


});

