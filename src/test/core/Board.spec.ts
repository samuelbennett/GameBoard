import {expect, assert} from 'chai';
import * as Collections from 'typescript-collections';
import {BoardState, Grid, Inventory} from '../../lib/core/Board';
import {WeaponType} from '../../lib/core/Types';
import {PlusFlame} from '../../lib/core/Weapon';
import {GridLocation} from '../../lib/core/Core';
import {BasicEnemy} from '../../lib/core/Enemy';
import {Empty} from '../../lib/core/Object';
import {LevelData} from '../../lib/core/Level';

describe('BoardState Tests', () => {
	let defaultInit: LevelData = new LevelData();
	defaultInit.weapons = new Collections.Dictionary<WeaponType, number>();
	defaultInit.weapons.setValue('PLUSFLAME', 1);
	defaultInit.xSize = 10;
	defaultInit.ySize = 10;

	it('BoardState should have a grid and inventory', () => {
		let b = new BoardState(defaultInit);
		assert.isDefined(b.grid);
		assert.isDefined(b.inventory);
	});

	it('BoardState transaction should allow for a roll back', () => {
		let b = new BoardState(defaultInit);
		b.beginTransaction();
		expect(b.inventory.weapons.getValue('PLUSFLAME')).equal(1);
		b.grid.objects.forEach(r => r.forEach(o => {
			expect(o).instanceOf(Empty);
		}));
		let l = new GridLocation(5, 5);
		let w = b.inventory.makeWeapon('PLUSFLAME', l);
		expect(b.inventory.weapons.getValue('PLUSFLAME')).equal(0);
		b.grid.placeObject(w);
		b.revertTransaction();
		expect(b.inventory.weapons.getValue('PLUSFLAME')).equal(1);
		b.grid.objects.forEach(r => r.forEach(o => {
			expect(o).instanceOf(Empty);
		}));
	});
});

describe('Grid Tests', () => {
	let grid = new Grid(10, 10);

	it('Grid should be 10 by 10', () => {
		expect(grid.objects.length).equals(10);
		grid.objects.forEach(function(a){
			expect(a.length).equals(10);
		});
	});

	it('Grid should be 10 by 10 of Emptys', () => {
		grid.objects.forEach(function(a){
			a.forEach(function(item){
				expect(item).instanceOf(Empty);
			});
		});
	});

	it('Game should be finished if there are no objects in the grid', () => {
		expect(grid.isGameFinished()).equals(true);
	});

	it('Placing object should be gettable', () => {
		let l = new GridLocation(5, 5);
		let o = new PlusFlame(l);
		grid.placeObject(o);
		let r = grid.getObject(l);
		assert.strictEqual(o, r);
	});

	it('Game should be finished if there is just a weapon in the grid', () => {
		expect(grid.isGameFinished()).equals(true);
	});

	it('Placing object in same space should throw exception', () => {
		let l = new GridLocation(5, 5);
		let o = new PlusFlame(l);
		expect(function(){
			grid.placeObject(o);
		}).to.throw('Cannot place object on occupied space');
	});

	it('Placing a enemy should prevent game completion', () => {
		let l = new GridLocation(5, 6);
		let o = new BasicEnemy(l, 1);
		grid.placeObject(o);

		expect(grid.isGameFinished()).equals(false);
	});

	it('After cloneing grid should have same objects', () => {
		let g2 = grid.clone();
		grid.objectsFlat.forEach(function(item1){
			let item2 = g2.getObject(item1.location);
			expect(item1.location.x).equals(item2.location.x, 'x equals');
			expect(item1.location.y).equals(item2.location.y, 'y equals');
			expect(item1.state).equals(item2.state);
			expect(item1.type).equals(item2.type);
		});
	});
});

describe('Inventory Tests', () => {
	let dict = new Collections.Dictionary<WeaponType, number>();
	dict.setValue('PLUSFLAME', 2);
	let inv = new Inventory(dict);
	let l = new GridLocation(5, 5);

	it('Weapon count should be correct', () => {
		expect(inv.weapons.size()).to.equal(1);
		expect(inv.weapons.getValue('PLUSFLAME')).to.equal(2);
	});

	it('Should be able to make something that is in the inv', () => {
		let w = inv.makeWeapon('PLUSFLAME', l);

		expect(w).to.be.an.instanceOf(PlusFlame);
	});

	it('Should be able to make a second', () => {
		let w = inv.makeWeapon('PLUSFLAME', l);
		expect(w).to.be.an.instanceOf(PlusFlame);
	});

	it('Should not be able to create something which has run out', () => {
		expect(function(){
			inv.makeWeapon('PLUSFLAME', l);
		}).to.throw('No remaining inventory of weapon');
	});

	it('Should not be able to create something with no inventory', () => {
		expect(function(){
			inv.makeWeapon('XFLAME', l);
		}).to.throw('No remaining inventory of weapon');
	});
});

