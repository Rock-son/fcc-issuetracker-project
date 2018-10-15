"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// DEFINE MODEL
const issueSchema = new Schema({

	project: {
		type: String, required: true, trim: true, lowercase: true
	},
	issue_title: {
		type: String, required: true, trim: true, lowercase: true
	},
	issue_text: {
		type: String, required: true, trim: true, lowercase: true
	},
	created_by: {
		type: String, required: true, trim: true, lowercase: true
	 },
	assigned_to : {
		type: String, default: "", trim: true, lowercase: true
	 },
	status_text: {
		type: String, default: "", trim: true, lowercase: true
	 },
	created_on: {
		type: Date, default: new Date()
	},
	updated_on: {
		type: Date
	},
	open: {
		type: Boolean, default: true
	}
});

// UPDATE TIME
issueSchema.pre("save", function a(next) {
	this.updated_on = new Date();
	return next();
});

module.exports.IssueTracker = mongoose.model("IssueTracker", issueSchema, "issuetracker");