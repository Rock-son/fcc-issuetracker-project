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

	if (!Object.keys(req.body).length) {
		return res.status(400).send({ error: "Request body must not be empty!" })
	}
	if ( issue_title === "" || issue_text === "", created_by === "") {
		return res.status(400).send({ error: "Required fields must not be empty!" })
	}

	const newIssue = new IssueTracker({
		project,
		issue_title,
		issue_text,
		created_by,
		assigned_to: assigned_to || "",
		status_text: status_text || ""
	});
	newIssue.save(function(err, result) {
		if (err) { return res.status(400).send(err); }

		const { _id, issue_title, issue_text, created_by, status_text, created_on, updated_on, assigned_to, open } = result;
		res.send({
			_id,
			issue_title,
			issue_text,
			created_on,
			updated_on,
			created_by,
			assigned_to,
			status_text,
			open
		});
	});
};

exports.putIssue = function(req, res, next) {

	if (!Object.keys(req.body).length) {
		return res.status(400).send({ error: "Request body must not be empty!" })
	}

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
		return res.status(400).send("no updated field sent");
	}
	if (open == "" && issue_title == "" && issue_text == "" && created_by == "" && assigned_to == "" && status_text == "") {
		return res.status(400).send("no updated field sent");
	}
	IssueTracker.findOneAndUpdate( {_id}, req.body, { new: true }, function(err, results)  {
		if (err) { return res.send("could not update " + _id); }

		res.status(200).send("successfully updated");
	});
};

exports.deleteIssue = function(req, res, next) {
	const { _id } = req.body;

	if (_id == null || _id === "") {
		return res.status(400).send({ error: "_id error" })
	}
	IssueTracker.findOneAndDelete({ _id: _id }, function(err, doc) {
		if (err) { return res.send("could not delete " + _id); }

		return res.status(200).send("deleted " + _id);
	})
};