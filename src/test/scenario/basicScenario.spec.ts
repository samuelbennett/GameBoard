import {expect, assert} from 'chai';

import * as Utils from '../testUtils';

import {StringLevelDeserialiser} from '../../lib/core/Level';
import {BoardState, Grid, Inventory} from '../../lib/core/Board';
import {GridLocation} from '../../lib/core/Core';
import {Empty} from '../../lib/core/Object';
import {BasicEnemy} from '../../lib/core/Enemy';
import {UserAPI, LoadLevel, PlaceWeapon} from '../../lib/actions/UserActions';
import {Promise} from 'es6-promise';

describe('Basic Scenario Tests', () => {

	let s = ['X,+',
			'1,0,1',
			'0,0,0',
			'1,0,1'].join('\n');
	let levelData = StringLevelDeserialiser.create(s);

	let api = new UserAPI();

	it('Level should be loadable', (done) => {
		let l = new LoadLevel();
		l.levelData = levelData;
		api.takeAction(l).then(done());
	});

	it('Loaded level should have loaded correctly', () => {
		let l = api.currentBoardState;
		expect(l.grid.xSize).equals(3);
		expect(l.grid.ySize).equals(3);
		expect(l.inventory.weapons.size()).equals(2);
		expect(l.inventory.weapons.getValue('XFLAME')).equals(1);
		expect(l.inventory.weapons.getValue('PLUSFLAME')).equals(1);
		expect(l.grid.objectsFlat.length).equals(9);
		Utils.assertLocationsAreAllInState(l.grid, 'DEFAULT', 
			[[0, 0], [0, 1], [0, 2],
			[1, 0], [1, 1], [1, 2],
			[2, 0], [2, 1], [2, 2]]
		);
		Utils.assertLocationsAreOfType(l.grid, [
			[0, 0, 'BASIC_ENEMY'],
			[0, 1, 'EMPTY'],
			[0, 2, 'BASIC_ENEMY'],
			[1, 0, 'EMPTY'],
			[1, 1, 'EMPTY'],
			[1, 2, 'EMPTY'],
			[2, 0, 'BASIC_ENEMY'],
			[2, 1, 'EMPTY'],
			[2, 2, 'BASIC_ENEMY'],
		]);
	});

	it('Weapon should be able to be placed', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(1, 1);
		place.type = 'XFLAME';
		api.takeAction(place).then(done());
	});

	it('Enemys should have been damaged', () => {
		let l = api.currentBoardState;
		expect(l.grid.objectsFlat.length).equals(9);
		Utils.assertLocationsAreInState(l.grid, [
			[0, 0, 'DEAD'], 
			[0, 1, 'DEFAULT'], 
			[0, 2, 'DEAD'],
			[1, 0, 'DEFAULT'], 
			[1, 1, 'ACTIVATED'], 
			[1, 2, 'DEFAULT'],
			[2, 0, 'DEAD'], 
			[2, 1, 'DEFAULT'], 
			[2, 2, 'DEAD']
		]);
		Utils.assertLocationsAreOfType(l.grid, [
			[0,0,'BASIC_ENEMY'],
			[0,1,'EMPTY'],
			[0,2,'BASIC_ENEMY'],
			[1,0,'EMPTY'],
			[1,1,'XFLAME'],
			[1,2,'EMPTY'],
			[2,0,'BASIC_ENEMY'],
			[2,1,'EMPTY'],
			[2,2,'BASIC_ENEMY'],
		]);
	});

	it('Weapon 2 should be able to be placed', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(0, 1);
		place.type = 'PLUSFLAME';
		api.takeAction(place).then(done()).catch(error => done(error));
	});

	it('Enemys should have been cleared', () => {
		let l = api.currentBoardState;
		expect(l.grid.objectsFlat.length).equals(9);
		Utils.assertLocationsAreInState(l.grid, [
			[0, 0, 'DEFAULT'], 
			[0, 1, 'ACTIVATED'], 
			[0, 2, 'DEFAULT'],
			[1, 0, 'DEFAULT'], 
			[1, 1, 'ACTIVATED'], 
			[1, 2, 'DEFAULT'],
			[2, 0, 'DEAD'], 
			[2, 1, 'DEFAULT'], 
			[2, 2, 'DEAD']
		]);
		Utils.assertLocationsAreOfType(l.grid, [
			[0,0,'EMPTY'],
			[0,1,'PLUSFLAME'],
			[0,2,'EMPTY'],
			[1,0,'EMPTY'],
			[1,1,'XFLAME'],
			[1,2,'EMPTY'],
			[2,0,'BASIC_ENEMY'],
			[2,1,'EMPTY'],
			[2,2,'BASIC_ENEMY'],
		]);
	});

	it('Weapon 3 should throw an error', (done) => {
		let place = new PlaceWeapon();
		place.location = new GridLocation(0, 1);
		place.type = 'PLUSFLAME';
		api.takeAction(place).catch(done());
	});
});
