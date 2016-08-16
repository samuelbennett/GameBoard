import {expect, assert} from 'chai';

import * as Utils from '../testUtils';

import {StringLevelDeserialiser} from '../../lib/core/Level';
import {BoardState, Grid, Inventory} from '../../lib/core/Board';
import {GridLocation} from '../../lib/core/Core';
import {Empty} from '../../lib/core/Object';
import {BasicEnemy} from '../../lib/core/Enemy';
import {UserAPI, LoadLevel, PlaceWeapon} from '../../lib/actions/UserActions';
import {Promise} from 'es6-promise';

describe('Obstruction Scenario Tests', () => {

	let s = ['+,+,+',
			'1','OE','0','0','0','OB','1','0'].join('\n');
	let levelData = StringLevelDeserialiser.create(s);

	let api = new UserAPI();

	it('Level should be loadable', (done) => {
		let l = new LoadLevel();
		l.levelData = levelData;
		api.takeAction(l).then(done());
	});

	it('Loaded level should have loaded correctly', () => {
		let l = api.currentBoardState;
		expect(l.grid.xSize).equals(1);
		expect(l.grid.ySize).equals(8);
		expect(l.inventory.weapons.size()).equals(1);
		expect(l.inventory.weapons.getValue('PLUSFLAME')).equals(3);
		expect(l.grid.objectsFlat.length).equals(8);
		Utils.assertLocationsAreAllInState(l.grid, 'DEFAULT', 
			[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]
		);
		Utils.assertLocationsAreOfType(l.grid, [
			[0, 0, 'BASIC_ENEMY'],
			[0, 1, 'OBSTRUCTION_ENEMY'],
			[0, 2, 'EMPTY'],
			[0, 3, 'EMPTY'],
			[0, 4, 'EMPTY'],
			[0, 5, 'OBSTRUCTION'],
			[0, 6, 'BASIC_ENEMY'],
			[0, 7, 'EMPTY'],
		]);
	});

	it('Weapon should be able to be placed', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(0, 2);
		place.type = 'PLUSFLAME';
		api.takeAction(place).then(done());
	});

	it('Obstructions should have prevented damage. Enemy Obstruction should have been dead.', () => {
		let l = api.currentBoardState;
		expect(l.grid.objectsFlat.length).equals(8);
		Utils.assertLocationsAreInState(l.grid, [
			[0, 0, 'DEFAULT'],
			[0, 1, 'DEAD'],
			[0, 2, 'ACTIVATED'],
			[0, 3, 'DEFAULT'],
			[0, 4, 'DEFAULT'],
			[0, 5, 'DEFAULT'],
			[0, 6, 'DEFAULT'],
			[0, 7, 'DEFAULT'],
		]);
		Utils.assertLocationsAreOfType(l.grid, [
			[0, 0, 'BASIC_ENEMY'],
			[0, 1, 'OBSTRUCTION_ENEMY'],
			[0, 2, 'PLUSFLAME'],
			[0, 3, 'EMPTY'],
			[0, 4, 'EMPTY'],
			[0, 5, 'OBSTRUCTION'],
			[0, 6, 'BASIC_ENEMY'],
			[0, 7, 'EMPTY'],
		]);
	});

	it('Weapon 2 should be able to be placed', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(0, 3);
		place.type = 'PLUSFLAME';
		api.takeAction(place).then(done()).catch(error => done(error));
	});

	it('Enemy Obstruction should have been cleared. Enemy should be dead', () => {
		let l = api.currentBoardState;
		expect(l.grid.objectsFlat.length).equals(8);
		Utils.assertLocationsAreInState(l.grid, [
			[0, 0, 'DEAD'],
			[0, 1, 'DEFAULT'],
			[0, 2, 'ACTIVATED'],
			[0, 3, 'ACTIVATED'],
			[0, 4, 'DEFAULT'],
			[0, 5, 'DEFAULT'],
			[0, 6, 'DEFAULT'],
			[0, 7, 'DEFAULT'],
		]);
		Utils.assertLocationsAreOfType(l.grid, [
			[0, 0, 'BASIC_ENEMY'],
			[0, 1, 'EMPTY'],
			[0, 2, 'PLUSFLAME'],
			[0, 3, 'PLUSFLAME'],
			[0, 4, 'EMPTY'],
			[0, 5, 'OBSTRUCTION'],
			[0, 6, 'BASIC_ENEMY'],
			[0, 7, 'EMPTY'],
		]);
	});

	it('Weapon 3 should be able to be placed', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(0, 7);
		place.type = 'PLUSFLAME';
		api.takeAction(place).then(done()).catch(error => done(error));
	});

	it('Enemys should have been damaged. Other should not be cleared', () => {
		let l = api.currentBoardState;
		expect(l.grid.objectsFlat.length).equals(8);
		Utils.assertLocationsAreInState(l.grid, [
			[0, 0, 'DEAD'],
			[0, 1, 'DEFAULT'],
			[0, 2, 'ACTIVATED'],
			[0, 3, 'ACTIVATED'],
			[0, 4, 'DEFAULT'],
			[0, 5, 'DEFAULT'],
			[0, 6, 'DEAD'],
			[0, 7, 'ACTIVATED'],
		]);
		Utils.assertLocationsAreOfType(l.grid, [
			[0, 0, 'BASIC_ENEMY'],
			[0, 1, 'EMPTY'],
			[0, 2, 'PLUSFLAME'],
			[0, 3, 'PLUSFLAME'],
			[0, 4, 'EMPTY'],
			[0, 5, 'OBSTRUCTION'],
			[0, 6, 'BASIC_ENEMY'],
			[0, 7, 'PLUSFLAME'],
		]);
	});
});
