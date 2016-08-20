import {expect, assert} from 'chai';

import {GridLocation} from '../../lib/core/Core';
import {Grid} from '../../lib/core/Board';
import {PlusFlame, Freeze, Weapon} from '../../lib/core/Weapon';
import {BasicEnemy} from '../../lib/core/Enemy';
import {Empty} from '../../lib/core/Object';
import {AfterPlaceStages} from '../../lib/core/Types';

import * as Utils from '../testUtils';

describe('PlusFlame Placement Tests', () => {

	let g: Grid;
	let w: Weapon;

	beforeEach(function() {
		g = new Grid(3, 3);

		g.placeObject(new BasicEnemy(new GridLocation(0, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(0, 1), 1));
		g.placeObject(new BasicEnemy(new GridLocation(0, 2), 1));
		g.placeObject(new BasicEnemy(new GridLocation(1, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(1, 2), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 1), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 2), 1));
		let l = new GridLocation(1, 1);
		w = new PlusFlame(l);
		g.placeObject(w);
		w.afterMyPlace(g);
	});

	it('Weapon should be activated', () => {
		expect(g.getObject(new GridLocation(1, 1)).state).equals('ACTIVATED');
	});

	it('Enemys should have been hit and dead', () => {
		expect(g.getObject(new GridLocation(0, 1)).state).equals('DEAD');
		expect(g.getObject(new GridLocation(1, 0)).state).equals('DEAD');
		expect(g.getObject(new GridLocation(1, 2)).state).equals('DEAD');
		expect(g.getObject(new GridLocation(2, 1)).state).equals('DEAD');
	});

	it('Enemys that were hit should have 0 lives', () => {
		expect((<BasicEnemy>g.getObject(new GridLocation(0, 1))).lives).equals(0);
		expect((<BasicEnemy>g.getObject(new GridLocation(1, 0))).lives).equals(0);
		expect((<BasicEnemy>g.getObject(new GridLocation(1, 2))).lives).equals(0);
		expect((<BasicEnemy>g.getObject(new GridLocation(2, 1))).lives).equals(0);
	});

	it('Enemys should not have been hit and dead', () => {
		expect(g.getObject(new GridLocation(0, 0)).state).equals('DEFAULT');
		expect(g.getObject(new GridLocation(0, 2)).state).equals('DEFAULT');
		expect(g.getObject(new GridLocation(2, 0)).state).equals('DEFAULT');
		expect(g.getObject(new GridLocation(2, 2)).state).equals('DEFAULT');
	});

	it('Enemys that were not hit should have 1 lives', () => {
		expect((<BasicEnemy>g.getObject(new GridLocation(0, 0))).lives).equals(1);
		expect((<BasicEnemy>g.getObject(new GridLocation(0, 2))).lives).equals(1);
		expect((<BasicEnemy>g.getObject(new GridLocation(2, 0))).lives).equals(1);
		expect((<BasicEnemy>g.getObject(new GridLocation(2, 2))).lives).equals(1);
	});

});

describe('Freeze Placement Tests', () => {

	let g: Grid;
	let w: Weapon;

	beforeEach(function() {
		g = new Grid(3, 3);

		g.placeObject(new BasicEnemy(new GridLocation(0, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(0, 1), 1));
		g.placeObject(new BasicEnemy(new GridLocation(0, 2), 1));
		g.placeObject(new BasicEnemy(new GridLocation(1, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(1, 2), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 0), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 1), 1));
		g.placeObject(new BasicEnemy(new GridLocation(2, 2), 1));
		let l = new GridLocation(1, 1);
		w = new Freeze(l);
		g.placeObject(w);
		w.afterMyPlace(g);
	});

	it('Weapon should be activated', () => {
		expect(g.getObject(new GridLocation(1, 1)).state).equals('ACTIVATED');
	});

	it('Enemys should have been hit and dead', () => {
		Utils.assertLocationsAreInState(g, [
			[0, 0, 'DEFAULT'],
			[0, 1, 'DEFAULT'],
			[0, 2, 'DEFAULT'],
			[1, 0, 'DEFAULT'],
			[1, 2, 'DEFAULT'],
			[2, 0, 'DEFAULT'],
			[2, 1, 'DEFAULT'],
			[2, 2, 'DEFAULT'],
		]);
		Utils.assertLocationsAreEnemyWithFlag(g, 'FROZEN', [
			[0, 0, true],
			[0, 1, true],
			[0, 2, true],
			[1, 0, true],
			[1, 2, true],
			[2, 0, true],
			[2, 1, true],
			[2, 2, true],
		]);
	});

});

describe('Freeze Full Cycle Tests', () => {

	let g = new Grid(1, 3);
	g.placeObject(new BasicEnemy(new GridLocation(0, 0), 2));

	let w = new Freeze(new GridLocation(0, 1));
	g.placeObject(w);
	w.afterMyPlace(g);
	w.afterPlace(w, g, 'FIRST');

	let w2 = new PlusFlame(new GridLocation(0, 2));
	g.placeObject(w2);
	w2.afterMyPlace(g);
	w.afterPlace(w2, g, 'FIRST');
	w2.afterPlace(w2, g, 'FIRST');

	it('Weapons should be activated', () => {
		expect(g.getObject(new GridLocation(0, 1)).state).equals('ACTIVATED');
		expect(g.getObject(new GridLocation(0, 2)).state).equals('ACTIVATED');
	});

	it('Enemy should have be dead', () => {
		expect(g.getObject(new GridLocation(0, 0)).state).equals('DEAD');
	});

	it('Enemy should have be not frozen anymore', () => {
		Utils.assertLocationsAreEnemyWithFlag(g, 'FROZEN', [[0, 0, false]]);
	});

});
