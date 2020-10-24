/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chaiDatetime = require('chai-datetime');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const ERROR_EMPTY_BODY = "Request body must not be empty!";
const ERROR_EMPTY_FIELDS = "Required fields must not be empty!";
const SUCCESSFULLY_UPDATED = "successfully updated";
const DELETE_ERROR_MSG = "_id error";
const DELETE_SUCCESS_MSG = "deleted ";

chai.use(chaiHttp);
chai.use(chaiDatetime);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
		chai.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: 'Title',
				issue_text: 'text',
				created_by: 'Functional Test - Every field filled in',
				assigned_to: 'Chai and Mocha',
				status_text: 'In QA'
			})
			.end(function(err, res){
				const { issue_title, issue_text, created_by, status_text, created_on, updated_on, assigned_to, open } = JSON.parse(res.text);

				assert.equal(res.status, 200);
				assert.equal(issue_title, 'Title');
				assert.equal(issue_text, 'text');
				assert.equal(created_by, 'Functional Test - Every field filled in');
				assert.equal(assigned_to, 'Chai and Mocha');
				assert.equal(status_text, 'In QA');
				assert.equal(open, true);
				assert.withinDate(new Date(updated_on), new Date(Date.now() - 1000), new Date());
				assert.withinDate(new Date(created_on), new Date(Date.now() - 1000), new Date());
				done();
			});
      });

      test('Required fields filled in', function(done) {
		chai.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: 'Title',
				issue_text: 'text',
				created_by: 'Functional Test - Every field filled in',
				assigned_to: '',
				status_text: ''
		})
        .end(function(err, res){
			const { issue_title, issue_text, created_by, status_text, created_on, updated_on, assigned_to, open } = JSON.parse(res.text);

			assert.equal(res.status, 200);
			assert.equal(issue_title, 'Title');
			assert.equal(issue_text, 'text');
			assert.equal(created_by, 'Functional Test - Every field filled in');
			assert.equal(assigned_to, '');
			assert.equal(status_text, '');
			assert.equal(open, true);
			assert.withinDate(new Date(updated_on), new Date(Date.now() - 1000), new Date());
			assert.withinDate(new Date(created_on), new Date(Date.now() - 1000), new Date());
			done();
        });
      });

      test('Missing required fields', function(done) {
		chai.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: '',
				issue_text: '',
				created_by: ''
        })
        .end(function(err, res){
			const { issue_title, issue_text, created_by, status_text, created_on, updated_on, assigned_to, open, error } = JSON.parse(res.text);

			assert.equal(res.status, 400);
			assert.equal(error, ERROR_EMPTY_FIELDS);
			done();
        });
	  });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
		chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
			const { error } = JSON.parse(res.text);
			assert.equal(res.status, 400);
			assert.equal(error, ERROR_EMPTY_BODY);
			done();
        });
      });

      test('One field to update', function(done) {
		chai.request(server)
        .put('/api/issues/test')
        .send({
			_id: "5bc4dcf73ab215c6dc45af38",
			issue_title: "UPDATED"
		})
        .end(function(err, res){
			assert.equal(res.status, 200);
			assert.equal(res.text, SUCCESSFULLY_UPDATED);
			done();
        });
      });

      test('Multiple fields to update', function(done) {
		chai.request(server)
        .put('/api/issues/test')
        .send({
			_id: "5bc4dcf73ab215c6dc45af38",
			issue_title: "UPDATED",
			issue_text: "ALSO UPDATED"
		})
        .end(function(err, res){
			assert.equal(res.status, 200);
			assert.equal(res.text, SUCCESSFULLY_UPDATED);
			done();
        });
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
			.get('/api/issues/test')
			.query({})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
				done();
			});
      });

      test('One filter', function(done) {
        chai.request(server)
			.get('/api/issues/test')
			.query({ open: true})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
				done();
			});
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
			.get('/api/issues/test')
			.query({
				open: true,
				issue_title: "Title"
			})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
				done();
			});
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
		chai.request(server)
			.delete('/api/issues/test')
			.send({})
			.end(function(err, res){
				console.log(res.text);
				const { error } = JSON.parse(res.text);

				assert.equal(res.status, 400);
				assert.equal(error, DELETE_ERROR_MSG);
				done();
			});
      });

      test('Valid _id', function(done) {
		chai.request(server)
			.delete('/api/issues/test')
			.send({
				_id: "5bc4e968ee1d1ec74c9b1b26"
			})
			.end(function(err, res){

				assert.equal(res.status, 200);
				assert.equal(res.text, DELETE_SUCCESS_MSG + "5bc4e968ee1d1ec74c9b1b26");
				done();
        	});
      	});

    });

});
