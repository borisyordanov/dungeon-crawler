import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Dungeons } from '../api/dungeons.js';

export const Player = new Mongo.Collection('players');

if (Meteor.isServer) {
	// This code only runs on the server
	// Only publish recipes that are public or belong to the current user
	Meteor.publish('players', () => {
		return Player.find();
	});
}

Meteor.methods({
	'player.update'(recipeId, recipe) {
		check(recipe.name, String);
		check(recipe.ingredients, Array);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(recipeId, { $set: { name: recipe.name, ingredients: recipe.ingredients } });
	},
	'player.updateLocation'(playerId, newLocation) {
		check(newLocation, Array);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(playerId, { $set: { location: newLocation } });
	},
	'player.updateDungeon'(playerId, newDungeon) {
		check(newDungeon, String);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(playerId, { $set: { dungeon: newDungeon } });
	},
	'player.updateHealth'(playerId, newHealth) {
		check(newHealth, Number);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(playerId, { $set: { health: newHealth } });
	},
	'player.updatePoints'(playerId, newPoints) {
		check(newPoints, Number);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(playerId, { $set: { points: newPoints } });
	},
	'player.increaseLevel'(playerId, newLevel) {
		check(newLevel, Object);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Player.update(playerId, {
			$set: {
				level: newLevel.name,
				points: newLevel.points
			}
		});
	}
});
