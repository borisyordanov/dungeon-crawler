import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { Dungeons } from '../api/dungeons.js';
import { Player } from '../api/player.js';
import { Cells } from '../api/cells.js';

import { shuffle } from '../../lib/shuffleArray.js';
import { findIndex } from '../../lib/findIndex.js';
import './field.html';

Template.field.onCreated(function() {
	this.state = new ReactiveDict();
	this.currentDungeonNumber = new ReactiveVar('1');
	this.currentDungeon = Dungeons.findOne(this.currentDungeonNumber.get());
	this.playerLocation = new ReactiveVar([0, 0]);

	Session.set('playerID', Player.find().fetch()[0]._id);

	const splitCells = [];
	const cells = [];

	cells.push('player');

	for (let i = 0; i < this.currentDungeon.enemies.amount; i++) {
		cells.push('enemy');
	}

	for (let i = 0; i < this.currentDungeon.healthPacks.amount; i++) {
		cells.push('health');
	}

	for (let i = 0; i < this.currentDungeon.weapons.amount; i++) {
		cells.push('weapon');
	}

	for (let i = 0; i < this.currentDungeon.portals.amount; i++) {
		cells.push('portal');
	}

	for (let i = 0; i < this.currentDungeon.bosses.amount; i++) {
		cells.push('boss');
	}

	for (let i = 0; i < this.currentDungeon.obstacles; i++) {
		cells.push('obstacle');
	}

	const emptyCellAmount = this.currentDungeon.totalCellAmount - cells.length;

	for (let i = 0; i < emptyCellAmount; i++) {
		cells.push('empty');
	}

	shuffle(cells);

	for (let i = 0, j = cells.length; i < j; i += 30) {
		//split array into smaller arrays with a length of 30
		splitCells.push(cells.slice(i, i + 30));
	}

	const playerLocation = findIndex(splitCells, 'player');

	Meteor.call('player.updateLocation', Session.get('playerID'), playerLocation);
	addCells(splitCells);
	Meteor.call('cells.add', splitCells);

});

Template.field.helpers({
	player() {
		return Player.find().fetch()[0];
	},
	cells() {
		return Cells.find().fetch();
	}
});

Template.field.events({
	'click .toggle-checked'() {
		// Set the checked property to the opposite of its current value
		Meteor.call('recipes.setChecked', this._id, !this.checked);
	},
	'click #delete'() {
		Meteor.call('recipes.remove', this._id);
	},

	'submit .edit-recipe'(event, instance) {
		event.preventDefault();

		var name = event.target.name;
		var ingredients = event.target.ingredient;

		var recipeName = name.value;
		var recipeIngredients = [];
		ingredients.forEach(ingredient => {
			recipeIngredients.push(ingredient.value);
		});

		// Update recipe in the collection
		Meteor.call('recipes.update', this._id, {
			name: recipeName,
			ingredients: recipeIngredients
		});
	},
	'click .toggle-private'() {
		Meteor.call('recipes.setPrivate', this._id, !this.private);
	},
	'click #recipe-details'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		var current = instance.showIngredients.get();
		instance.showIngredients.set(!current);
	}
});

Template.body.events({
	keydown: function(event) {
		event.preventDefault();
		// const playerIndex = Template.instance().playerLocation.get();
		Session.set('player', 'player12354');
		console.log(event.keyCode);
		console.log(Template.field);
		console.log(Template.instance());
		if (event.keyCode === 39) {
		}
	}
});
