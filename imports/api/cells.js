import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Cells = new Mongo.Collection('cells');

if (Meteor.isServer) {
	// This code only runs on the server
	// Only publish recipes that are public or belong to the current user
	Meteor.publish('cells', () => {
		return Cells.find();
	});
}

Meteor.methods({
	'cell.insert'(newCells) {
		console.log(newCells);
		check(newCells, Array);

		// Make sure the user is logged in before inserting a task
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		console.log('asdcvz');

		newCells.forEach(cell => Cells.insert(cell));
	}
});
