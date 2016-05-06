 // with mocha --watch, sometimes, error line is jump to describe declarations.
// so we use rerequire
import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai'
import modules from '../helpers/defines.js'

var should = require('chai').should() // actually call the function

var EndPoint = require(modules.endpoints).EndPoint

const eventListPath = EndPoint.EventList()

describe('When call API ', function() {
    let $
    jsdom()

    beforeEach(function() {
        $ = require('jquery') // include jquery
        sinon.stub($, 'ajax')
        const EventAPI = require(modules.api).EventAPI
        this.API = new EventAPI("AuthToken")
        this.eventdata = {name:"event", price: 3000.0}
    })

    describe('create event', function() {
        it(`should send POST to events list and call success function`,
           function() {
            let successFn = sinon.spy()
            this.API.createEvent(this.eventdata, successFn, sinon.spy())
            $.ajax.yieldTo('success', this.eventdata);
            expect(successFn.called).to.be.true

            var p = $.ajax.getCall(0).args[0]
            p.data.should.deep.equal(this.eventdata)
            assert.equal(p.method, 'POST')
            assert.equal(p.url, eventListPath)

            $.ajax.reset()

            const new_data = {name: "test", price: 3000.0}
            let successFn2 = sinon.spy()

            this.API.createEvent(new_data, successFn2, sinon.spy())
            $.ajax.yieldTo('success', this.eventdata);

            var p = $.ajax.getCall(0).args[0]
            p.data.should.deep.equal(new_data)
            assert.equal(p.method, 'POST')
            assert.equal(p.url, eventListPath)

            expect(successFn2.called).to.be.true
        })

        describe(' with incomplete data ', function() {
            it("should send POST to event list path and call error function",
               function() {
                const error_data = { }
                let errorFn = sinon.spy()

                this.API.createEvent(error_data, sinon.spy(), errorFn)

                $.ajax.yieldTo('error', { author:'required', name:'required',
                               price:'required' })

                expect(errorFn.called).to.be.true
            })
        });
    })

    describe('get event list', function() {
        it(`should send GET to event list path and call success on response.`,
           function() {
               // success checker
               let errorFn = sinon.spy()
               let successFn = sinon.spy()

               this.API.getEvents(successFn, errorFn)
               // Simulate response. We testing frontend, remember?
               $.ajax.yieldTo('success', [this.eventdata, this.eventdata])

               var p = $.ajax.getCall(0).args[0]
               p.method.should.equal("GET")
               p.url.should.equal(eventListPath)

               expect(successFn.called).to.be.true
               expect(successFn.args[0][0])
                   .to.exist
                   .and.have.length(2)
           })
    })
    afterEach(function() { $.ajax.restore() })
})


