import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { Dungeons } from '../api/dungeons.js';
import { Player } from '../api/player.js';
import { generateCells } from '../../lib/generateCells.js';
import './field.html';

Template.field.onCreated(function() {
	this.state = new ReactiveDict();
	// this.currentDungeonNumber = new ReactiveVar('1');
	// this.playerLocation = new ReactiveVar([0, 0]);
	this.currentPlayer = new ReactiveVar(Player.findOne());

	/*const currentDungeon = Dungeons.findOne(this.currentPlayer.get().dungeon);
	console.log(currentDungeon);
	const splitCells = [];
	const cells = [];

	cells.push({ name: 'player' });

	for (let i = 0; i < currentDungeon.enemies.amount; i++) {
		cells.push({
			name: 'enemy',
			points: currentDungeon.enemies.points,
			attack: currentDungeon.enemies.attack
		});
	}

	for (let i = 0; i < currentDungeon.healthPacks.amount; i++) {
		cells.push({
			name: 'health',
			amount: currentDungeon.healthPacks.health
		});
	}

	for (let i = 0; i < currentDungeon.weapons.amount; i++) {
		cells.push({
			name: 'weapon',
			type: currentDungeon.weapons.weaponType,
			attack: currentDungeon.weapons.weaponAttack
		});
	}

	for (let i = 0; i < currentDungeon.portals.amount; i++) {
		cells.push({
			name: 'portal',
			leadsTo: currentDungeon.portals.leadsTo
		});
	}

	for (let i = 0; i < currentDungeon.bosses.amount; i++) {
		cells.push({
			name: 'boss',
			attack: currentDungeon.bosses.attack
		});
	}

	for (let i = 0; i < currentDungeon.obstacles; i++) {
		cells.push({
			name: 'obstacle'
		});
	}

	const emptyCellAmount = currentDungeon.totalCellAmount - cells.length;

	for (let i = 0; i < emptyCellAmount; i++) {
		cells.push({ name: 'empty' });
	}

	shuffle(cells);

	for (let i = 0, j = cells.length; i < j; i += 30) {
		//split array into smaller arrays with a length of 30
		splitCells.push(cells.slice(i, i + 30));
	}

	const playerLocation = findIndex(splitCells, 'player');

	Meteor.call('dungeon.updatePlayerLocation', currentDungeon._id, playerLocation);
	Meteor.call('dungeon.updateCells', currentDungeon._id, splitCells);*/
});

Template.field.helpers({
	player() {
		return Player.find().fetch()[0];
	},
	generatedRows() {
		/*const currentDungeon = Dungeons.findOne(Template.instance().currentPlayer.get().dungeon);
		const splitCells = [];
		const cells = [];

		cells.push('player');

		for (let i = 0; i < currentDungeon.enemies.amount; i++) {
			cells.push('enemy');
		}

		for (let i = 0; i < currentDungeon.healthPacks.amount; i++) {
			cells.push('health');
		}

		for (let i = 0; i < currentDungeon.weapons.amount; i++) {
			cells.push('weapon');
		}

		for (let i = 0; i < currentDungeon.portals.amount; i++) {
			cells.push('portal');
		}

		for (let i = 0; i < currentDungeon.bosses.amount; i++) {
			cells.push('boss');
		}

		for (let i = 0; i < currentDungeon.obstacles; i++) {
			cells.push('obstacle');
		}

		const emptyCellAmount = currentDungeon.totalCellAmount - cells.length;

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
		Meteor.call('dungeon.updateCells', currentDungeon._id, splitCells);

*/

		if (Dungeons.findOne(Template.instance().currentPlayer.get().dungeon.toString()).cells.length === 0) {
			generateCells();
		}
		return Dungeons.findOne(Template.instance().currentPlayer.get().dungeon.toString()).cells;
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
