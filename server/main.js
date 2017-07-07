import { Meteor } from 'meteor/meteor';
import { Dungeons } from '../imports/api/dungeons.js';
import { Player } from '../imports/api/player.js';

Meteor.startup(function() {
	// Insert sample data if the student collection is empty
	if (Dungeons.find().count() === 0) {
		JSON.parse(Assets.getText('dungeons.json')).dungeons.forEach(function(dungeon) {
			Dungeons.insert(dungeon);
		});
	}

	if (Player.find().count() === 0) {
		var playerInitData = JSON.parse(Assets.getText('player.json'));
		Player.insert(playerInitData);
	}
});
