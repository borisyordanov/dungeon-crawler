import { Meteor } from 'meteor/meteor';

import { Dungeons } from '../imports/api/dungeons.js';
import { Player } from '../imports/api/player.js';
import { shuffle } from './shuffleArray.js';
import { findIndex } from './findIndex.js';

export function generateCells() {
	const currentPlayer = Player.findOne();
	console.log(currentPlayer);
	const currentDungeon = Dungeons.findOne(currentPlayer.dungeon.toString());
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
	Meteor.call('dungeon.updateCells', currentDungeon._id, splitCells);
}
