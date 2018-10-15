"use strict";

const { IssueTracker } = require("./model");

exports.getIssues = function(req, res, next) {
	req.query.project = req.params.project;

	IssueTracker.find(req.query).exec((err, results) => {
		if (err) { return next(err); }

		res.status(200).send(results);
	});
};

exports.postIssue = function(req, res, next) {
	const project = req.params.project;
	const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

	const newIssue = new IssueTracker({
		project,
		issue_title,
		issue_text,
		created_by,
		assigned_to: assigned_to || "",
		status_text: status_text || ""
	});
	newIssue.save(function(err, result) {
		if (err) { return next(err); }

		res.send({
			_id: result._id,
			issue_title: result.issue_title,
			issue_text: result.issue_text,
			created_on: result.created_on,
			updated_on: result.updated_on,
			created_by: result.created_by,
			assigned_to: result.assigned_to,
			status_text: result.status_text
		});
	});
};

exports.putIssue = function(req, res, next) {
	const {
		_id,
		open,
		issue_title,
		issue_text,
		created_by,
		assigned_to,
		status_text
	} = req.body;

	Object.keys(req.body).forEach(key => req.body[key] == "" ? delete req.body[key] : void(0));

	if (_id == null) {
		return res.send("no updated field sent");
	}
	if (open == null && issue_title == null && issue_text == null && created_by == null && assigned_to == null && status_text == null) {
		return res.send("no updated field sent");
	}
	IssueTracker.findByIdAndUpdate( _id, req.body).exec((err, results) => {
		if (err) { return res.send("could not update " + _id); }

		res.status(200).send("successfully updated");
	});
};

exports.deleteIssue = function(req, res, next) {
	const { _id } = req.body;

	if (_id == null) {
		res.status(404).send("_id error")
	}
	IssueTracker.findOneAndDelete({ _id: _id }, function(err, doc) {
		if (err) { return res.send("could not delete " + _id); }

		res.status(200).send("deleted " + _id);
	})
};