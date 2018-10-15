/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require("mongoose");

var db = require("../db/controller");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.Promise = global.Promise;
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, autoIndex: false });

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res, next){
	  var project = req.params.project;

	  db.getIssues(req, res, next);
    })

    .post(function (req, res, next){
	  var project = req.params.project;

	  db.postIssue(req, res, next);
    })

    .put(function (req, res, next){
	  var project = req.params.project;

	  db.putIssue(req, res, next);
    })

    .delete(function (req, res, next){
      var project = req.params.project;

		db.deleteIssue(req, res, next);
    });

};
