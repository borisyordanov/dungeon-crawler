import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import './field.js';
import './stats.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('dungeons');
});

Template.body.helpers({
	recipes() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// If hide completed is checked, filter recipes
			return Recipes.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
		// Otherwise, return all of the recipes
		return Recipes.find({}, { sort: { createdAt: -1 } });
	},
	incompleteCount() {
		return Recipes.find({ checked: { $ne: true } }).count();
	}
});

Template.body.events({
	'submit .new-recipe'(event) {
		// Prevent default browser form submit
		event.preventDefault();
	}
});
