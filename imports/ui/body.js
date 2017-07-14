import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import { Player } from '../api/player.js';
import { Dungeons } from '../api/dungeons.js';

import * as movePlayer from '../../lib/movePlayer.js';
import { generateCells } from '../../lib/generateCells.js';

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
	keydown: function(event) {
		// event.preventDefault();
		const currentPlayer = Player.findOne();
		console.log(currentPlayer);
		const currentDungeon = Dungeons.findOne(currentPlayer.dungeon.toString());
		console.log(currentDungeon);
		const playerLocation = currentDungeon.playerLocation;
		console.log(playerLocation);
		let nextCell = null;
		let currentCell = currentDungeon.cells[playerLocation[0]][playerLocation[1]];

		if (event.keyCode === 37) {
			//left
			nextCell = currentDungeon.cells[playerLocation[0]][playerLocation[1] - 1];
			playerLocation[1]--;
		} else if (event.keyCode === 38) {
			//up
			nextCell = currentDungeon.cells[playerLocation[0] - 1][playerLocation[1]];
			playerLocation[0]--;
		} else if (event.keyCode === 39) {
			//right
			nextCell = currentDungeon.cells[playerLocation[0]][playerLocation[1] + 1];
			playerLocation[1]++;
		} else if (event.keyCode === 40) {
			//down
			nextCell = currentDungeon.cells[playerLocation[0] + 1][playerLocation[1]];
			playerLocation[0]++;
		}
		console.log(nextCell);

		if (nextCell.name === 'obstacle') {
			return;
		} else if (nextCell.name === 'enemy' || nextCell.name === 'boss') {
			currentPlayer.health -= nextCell.attack;

			if (currentPlayer.health > 0) {
				currentPlayer.points -= nextCell.points;
				if (currentPlayer.points <= 0) {
					currentPlayer.points = currentPlayer.points * -1;
					Meteor.call('player.increaseLevel', currentPlayer._id, currentPlayer.levels[currentPlayer.level]);
				}
				Meteor.call('player.updatePoints', currentPlayer._id, currentPlayer.points);
				Meteor.call('player.updateHealth', currentPlayer._id, currentPlayer.health);
			}
		} else if (nextCell.name === 'health') {
			currentPlayer.health += nextCell.amount;
			Meteor.call('player.updateHealth', currentPlayer._id, currentPlayer.health);
		} else if (nextCell.name === 'portal') {
			currentPlayer.dungeon = nextCell.leadsTo;
			Meteor.call('player.updateDungeon', currentPlayer._id, currentPlayer.dungeon);
			generateCells();
		} else if (nextCell.name === 'weapon') {
			console.log(nextCell);
			// currentPlayer.dungeon = nextCell.leadsTo;
			// Meteor.call('player.updateDungeon', currentPlayer._id, currentPlayer.dungeon);
		}

		currentCell.name = 'empty';
		nextCell.name = 'player';

		if (event.keyCode >= 37 && event.keyCode <= 40) {
			Meteor.call('dungeon.updateCells', currentDungeon._id, currentDungeon.cells);
			Meteor.call('dungeon.updatePlayerLocation', currentDungeon._id, playerLocation);
		}
	}
});
