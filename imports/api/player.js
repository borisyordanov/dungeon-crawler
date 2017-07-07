import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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
	}
});
