 // with mocha --watch, sometimes, error line is jump to describe declarations.
// so we use rerequire
import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai';
import modules from './defines.js';

var should = require('chai').should(); // actually call the function

describe('When we call from API ', function() {
    let $;
    jsdom();

    describe('create Event', function() {
        beforeEach(function() {
            $ = require('jquery'); // include jquery
            sinon.stub($, 'ajax');
            this.API = require(modules.api).EventAPI;
        });

        it("should POST to /api/events/ correct data", function() {
            var eventdata = {name:"event", price: 3000.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.url, "/api/events/");

            $.ajax.reset();

            eventdata = {name:"Cookies", price: 100.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.url, "/api/events/");
        });

        afterEach(function() { $.ajax.restore(); });
    });
});

