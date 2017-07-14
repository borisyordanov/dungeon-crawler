import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Dungeons = new Mongo.Collection('dungeons');

if (Meteor.isServer) {
	// This code only runs on the server
	// Only publish recipes that are public or belong to the current user
	Meteor.publish('dungeons', function recipesPublication() {
		return Dungeons.find();
	});
}

Meteor.methods({
	'dungeon.updateCells'(dungeonId, newCells) {
		check(newCells, Array);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Dungeons.update(dungeonId, {
			$set: {
				cells: newCells
			}
		});
	},
	'dungeon.updatePlayerLocation'(dungeonId, newLocation) {
		check(newLocation, Array);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Dungeons.update(dungeonId, {
			$set: {
				playerLocation: newLocation
			}
		});
	}
});
