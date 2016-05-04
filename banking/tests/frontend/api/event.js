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
    before(function() {
       this.eventListPath = require(modules.endpoints).EndPoint.EventList();
    });
    beforeEach(function() {
        $ = require('jquery'); // include jquery
        sinon.stub($, 'ajax');
        this.API = require(modules.api).EventAPI;
    });

    describe('create Event', function() {

        it(`should POST to ${this.eventListPath} correct data`, function() {
            var eventdata = {name:"event", price: 3000.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.url, this.eventListPath);

            $.ajax.reset();

            eventdata = {name:"Cookies", price: 100.0};
            this.API.createEvent(eventdata);

            var p = $.ajax.getCall(0).args[0];
            p.data.should.deep.equal(eventdata);
            assert.equal(p.url, this.eventListPath);
        });

    });
    afterEach(function() { $.ajax.restore(); });
});


