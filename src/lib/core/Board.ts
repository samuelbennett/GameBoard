import * as Collections from 'typescript-collections';
import { EnemyType, WeaponType } from './Types';
import { Enemy, BasicEnemy } from './Enemy';
import { Weapon, PlusFlame, XFlame, SmallBomb, LargeBomb, Freeze } from './Weapon';
import { GridLocation, GridObject } from './Core';
import { LevelData } from './Level';
import { Empty } from './Object';
import * as _ from 'lodash';

export class TransactionError extends Error {
	constructor(public message: string) {
			super(message);
			this.name = 'TransactionError';
			this.message = message;
			this.stack = (<any>new Error()).stack;
		}
		toString() {
			return this.name + ': ' + this.message;
		}
}

export class BoardState {
	private _grid: Grid;
	private _inventory: Inventory;

	private withinTransactionBlock: boolean = false;
	private backup: { grid: Grid, inventory: Inventory; };

	constructor(bs: LevelData) {
		let g = new Grid(bs.xSize, bs.ySize);
		this._grid = g;
		this._inventory = new Inventory(bs.weapons);
		if (bs.board !== undefined) {
			_.each(bs.board, function(w){
				g.placeObject(w);
			});
		}
	}

	get grid(): Grid {
		return this._grid;
	}

	get inventory(): Inventory {
		return this._inventory;
	}

	beginTransaction() {
		if (this.withinTransactionBlock)
			throw new TransactionError('Still within transaction cannot begin new one');
		this.withinTransactionBlock = true;
		this.backup = { grid: this._grid.clone(), inventory: this._inventory.clone() };
	}

	commitTransaction() {
		if (!this.withinTransactionBlock)
			throw new TransactionError('Not within transaction cannot commit');
		this.withinTransactionBlock = false;
	}

	revertTransaction() {
		if (!this.withinTransactionBlock)
			throw new TransactionError('Not within transaction cannot revert');
		this._grid = this.backup.grid;
		this._inventory = this.backup.inventory;
		this.withinTransactionBlock = false;
	}
}

export class Grid {
	private _xSize: number;
	private _ySize: number;
	private _objects: Array<Array<GridObject>>;

	constructor(xSize: number, ySize: number) {
		this._xSize = xSize;
		this._ySize = ySize;
		this._objects = [];

		for (var i = 0; i < ySize; i++) {
			this._objects[i] = [];
		}
		for (var i = 0; i < ySize; i++) {
			for (var j = 0; j < xSize; j++) {
				let l = new GridLocation(j, i);
				this.forcePlaceObject(new Empty(l));
			}
		}
	}

	get xSize(): number {
		return this._xSize;
	}

	get ySize(): number {
		return this._ySize;
	}

	placeObject(newObject: GridObject): void {
		let l = newObject.location;
		if (!this.getObject(l).isEmpty()) {
			throw new Error('Cannot place object on occupied space');
		}
		this.forcePlaceObject(newObject);
	}

	private forcePlaceObject(newObject: GridObject): void {
		let l = newObject.location;
		this._objects[l.y][l.x] = newObject;
	}

	getObject(l: GridLocation): GridObject {
		return this._objects[l.y][l.x];
	}

	get objects(): Array<Array<GridObject>> {
		return this._objects;
	}

	get objectsFlat(): Array<GridObject> {
		return _.flatten(this._objects);
	}

	isGameFinished(): Boolean {
		return _.every(this.objectsFlat, function(o){
			return !o.preventsGameCompletion();
		});
	}

	runCleanup(): void {
		_.each(this.objectsFlat, (o) => {
			if (o.state === 'TO_BE_REMOVED') {
				this.forcePlaceObject(new Empty(o.location));
			}
		});
	}

	clone(): Grid {
		let g = new Grid(this._xSize, this._ySize);
		_.each(this.objectsFlat, function(o){
			let c = o.clone();
			g.placeObject(c);
		});
		return g;
	}
}

export class Inventory {
	private _weapons: Collections.Dictionary<WeaponType, number>;
	constructor(startingInventory: Collections.Dictionary<WeaponType, number>) {
		this._weapons = startingInventory;
	}

	get weapons(): Collections.Dictionary<WeaponType, number> {
		return this._weapons;
	}

	makeWeapon(weaponType: WeaponType, l: GridLocation): Weapon {
		if (!this._weapons.containsKey(weaponType) || this._weapons.getValue(weaponType) <= 0) {
			throw new Error('No remaining inventory of weapon');
		}

		let w: Weapon;
		switch (weaponType) {
			case 'PLUSFLAME':
				w = new PlusFlame(l);
				break;
			case 'XFLAME':
				w = new XFlame(l);
				break;
			case 'SMALLBOMB':
				w = new SmallBomb(l);
				break;
			case 'LARGEBOMB':
				w = new LargeBomb(l);
				break;
			case 'FREEZE':
				w = new Freeze(l);
				break;
			default:
				throw new Error('Unkown Weapon Type');
		}

		let count: number = this._weapons.getValue(weaponType);
		this._weapons.setValue(weaponType, count - 1);

		return w;
	}

	clone(): Inventory {
		let d = new Collections.Dictionary<WeaponType, number>();
		this._weapons.forEach((w, c) => d.setValue(w, c));
		return new Inventory(d);
	}
}
