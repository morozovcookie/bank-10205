import jsdom, {rerequire} from 'mocha-jsdom'
import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import modules from './defines.js'

const EndPoint = require(modules.endpoints).EndPoint
const userListPath = EndPoint.UserList()

describe("When call API", function() {
    var $
    jsdom()

    describe("create user", function() {
        beforeEach(function() {
            $ = require('jquery')
            sinon.stub($, 'ajax')
            this.API = require(modules.api).AccountAPI
        })

        it(`should POST to ${userListPath}`, function() {
            var userdata = {username: "test", password: "test"}
            this.API.createAccount(userdata)

            var p = $.ajax.getCall(0).args[0]
            assert.equal(p.data, userdata)
            assert.equal(p.url, userListPath)

            userdata = {username: "Bobby", password: "123"}

            $.ajax.reset()

            this.API.createAccount(userdata)

            var p = $.ajax.getCall(0).args[0]
            assert.equal(p.data, userdata)
            assert.equal(p.url, userListPath)
        })

        afterEach(function() { $.ajax.restore() })
    })


})

