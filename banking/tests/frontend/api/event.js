 // with mocha --watch, sometimes, error line is jump to describe declarations.
// so we use rerequire
import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai';
import modules from './defines.js';

var should = require('chai').should(); // actually call the function

const eventListPath = require(modules.endpoints).EndPoint.EventList();

describe('When we call from API ', function() {
    let $;
    jsdom();

    beforeEach(function() {
        $ = require('jquery'); // include jquery
        sinon.stub($, 'ajax');
        this.API = require(modules.api).EventAPI;
    });

    describe('create event', function() {
        it(`should send POST to ${eventListPath}`, function() {
            var eventdata = {name:"event", price: 3000.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.url, eventListPath);

            $.ajax.reset();

            eventdata = {name:"Cookies", price: 100.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.method, 'POST');
            assert.equal(p.url, eventListPath);
        });
    });
    describe('get event list', function() {
        it(`should send GET to ${eventListPath}`, function() {
            this.API.getEvents();
            var p = $.ajax.getCall(0).args[0];
            assert.equal(p.method, "GET");
            assert.equal(p.url, eventListPath);
        });
    });
    afterEach(function() { $.ajax.restore(); });
});


