import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Dungeons = new Mongo.Collection('dungeons');

if (Meteor.isServer) {
	// This code only runs on the server
	// Only publish recipes that are public or belong to the current user
	Meteor.publish('dungeons', function recipesPublication() {
		return Dungeons.find();
	});
}