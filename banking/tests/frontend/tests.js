// import jsdom from 'mocha-jsdom';
//
// import {expect, should} from 'chai';
//
// import sinon from 'sinon';

var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var expect = require('chai').expect;

// import {AccountAPI} from '../../frontend/js/domain/api.js';

describe('jquery', function () {
  var $;
  jsdom();

  before(function () {
    $ = require('jquery');
  })

  it('lookup works', function () {
		$.ajax({});
  })
})

var userdata = {username: "test", password: "test"};


describe('API', () => {

    describe('Create new user', () => {
		var $;
		jsdom();

        before(() => {
            // var $ = jsdom.rerequire('jquery');
			$ = require('jquery');
			sinon.stub($, "ajax");
        });

        it("should POST to /api/users/", () => {
			let AccountAPI = require('../../frontend/js/domain/api.js').AccountAPI;

            AccountAPI.createAccount(userdata);

            $.ajax.calledWithMatch({ url: "/api/users" });
		});


        after(() => {
			$.ajax.restore();
        });
	});
});
