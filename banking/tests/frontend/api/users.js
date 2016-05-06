import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import modules from '../helpers/defines.js'


describe("When call API", function() {
    var $
    jsdom()

    describe("create user", function() {
        beforeEach(function() {
            $ = require('jquery')
            sinon.stub($, 'ajax')
            const AccountAPI = require(modules.api).AccountAPI

            this.API = new AccountAPI("AuthToken")
            this.EndPoint = require(modules.endpoints).EndPoint
        })

        it('should POST to user list path and call success on success',
           function() {
            var userdata = {username: "test", password: "test"}
            const successFn = sinon.spy()
            this.API.createAccount(userdata, successFn, sinon.stub())
            $.ajax.yieldTo('success', userdata)

            var p = $.ajax.getCall(0).args[0]
            assert.equal(p.data, userdata)
            assert.equal(p.url, this.EndPoint.UserList())

            expect(successFn.called).to.be.true

            $.ajax.reset()

            userdata = {username: "Bobby", password: "123"}
            const successFn2 = sinon.spy();

            this.API.createAccount(userdata, successFn2)
            $.ajax.yieldTo('success', userdata)

            var p = $.ajax.getCall(0).args[0]
            assert.equal(p.data, userdata)
            assert.equal(p.url, this.EndPoint.UserList())

            expect(successFn2.called).to.be.true
        })

        it('should GET to user list path and call success on success',
           function() {
            let successFn = sinon.spy()
            this.API.getUsers(successFn, sinon.stub())
            $.ajax.yieldTo('success', [this.eventdata, this.eventdata])
            expect(successFn.called).to.be.true
        });

        it('should PATCH to user detail path and call success on success',
           function() {
            let successFn = sinon.spy()
            const data = {id: 1, username: "Test", birthdate: new Date()}
            const userDetail = this.EndPoint.UserDetail(data.id);

            this.API.updateUser(data, successFn)
            $.ajax.yieldTo('success', [this.eventdata, this.eventdata])

            const p = $.ajax.getCall(0).args[0]
            p.method.should.to.be.equal('PATCH');
            p.url.should.to.be.equal(`${userDetail}`)

            expect(successFn.called).to.be.true
        });

        afterEach(function() { $.ajax.restore() })
    })


})

