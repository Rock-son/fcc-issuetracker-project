"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// DEFINE MODEL
const issueSchema = new Schema({

	project: {
		type: String, required: true, trim: true
	},
	issue_title: {
		type: String, required: true, trim: true
	},
	issue_text: {
		type: String, required: true, trim: true
	},
	created_by: {
		type: String, required: true, trim: true
	 },
	assigned_to : {
		type: String, default: "", trim: true
	 },
	status_text: {
		type: String, default: "", trim: true
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
},
	{ 
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 1000
		}
	}
);

// UPDATE TIME
issueSchema.pre("save", function a(next) {
	this.updated_on = new Date();
	return next();
});

module.exports.IssueTracker = mongoose.model("IssueTracker", issueSchema, "issuetracker");