import { Template } from 'meteor/templating';
import { Player } from '../api/player.js';
import './stats.html';

Template.stats.helpers({
	stats() {
		return Player.find().fetch()[0];
	}
});