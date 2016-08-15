import {expect, assert} from 'chai';

import {GridLocation} from '../../lib/core/Core';
import {Grid} from '../../lib/core/Board';
import {PlusFlame, Weapon} from '../../lib/core/Weapon';
import {BasicEnemy} from '../../lib/core/Enemy';
import {Empty} from '../../lib/core/Object';

describe('PlusFlame Tests', () => {

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

	// it('Dead enemys after being hit a second time should ready for removal', () => {
	// 	//e§w.activate(g); //second activation
	// 	expect(g.getObject(new GridLocation(0, 1)).state).equals('TO_BE_REMOVED');
	// 	expect(g.getObject(new GridLocation(1, 0)).state).equals('TO_BE_REMOVED');
	// 	expect(g.getObject(new GridLocation(1, 2)).state).equals('TO_BE_REMOVED');
	// 	expect(g.getObject(new GridLocation(2, 1)).state).equals('TO_BE_REMOVED');
	// });

	// it('Removals should get replaced with emptys', () => {
	// 	//w.activate(g); //second activation
	// 	g.runCleanup();
	// 	expect(g.getObject(new GridLocation(0, 1))).instanceOf(Empty);
	// 	expect(g.getObject(new GridLocation(1, 0))).instanceOf(Empty);
	// 	expect(g.getObject(new GridLocation(1, 2))).instanceOf(Empty);
	// 	expect(g.getObject(new GridLocation(2, 1))).instanceOf(Empty);
	// });

});
