 // with mocha --watch, sometimes, error line is jump to describe declarations.
// so we use rerequire
import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai'
import modules from './defines.js'

var should = require('chai').should() // actually call the function

var EndPoint = require(modules.endpoints).EndPoint

const eventListPath = EndPoint.EventList()

describe('When we call from API ', function() {
    let $
    jsdom()

    beforeEach(function() {
        $ = require('jquery') // include jquery
        sinon.stub($, 'ajax')
        this.API = require(modules.api).EventAPI
        this.eventdata = {name:"event", price: 3000.0}
    })

    describe('create event', function() {
        it(`should send POST to ${eventListPath}`, function() {
            this.API.createEvent(this.eventdata)

            var p = $.ajax.getCall(0).args[0]
            p.data.should.deep.equal(this.eventdata)
            assert.equal(p.url, eventListPath)

            $.ajax.reset()

            this.API.createEvent(this.eventdata)

            var p = $.ajax.getCall(0).args[0]
            p.data.should.deep.equal(this.eventdata)
            assert.equal(p.method, 'POST')
            assert.equal(p.url, eventListPath)
        })
    })
    describe('get event list', function() {
        it(`should send GET to ${eventListPath}`, function() {
            var callback = sinon.spy()

            this.API.getEvents(callback)
            $.ajax.yieldTo('success', [this.eventdata, this.eventdata])

            expect(callback.called).to.be.true

            expect(callback.args[0][0])
                .to.exist
                .and.to.have.length(2)

            var p = $.ajax.getCall(0).args[0]

            assert.equal(p.method, "GET")
            assert.equal(p.url, eventListPath)
        })
    })
    afterEach(function() { $.ajax.restore() })
})


