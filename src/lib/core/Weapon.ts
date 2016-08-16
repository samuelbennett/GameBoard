import { GridLocation, GridObject, GridCursor } from './Core';
import { WeaponType, DirectionType, AfterPlaceStages } from './Types';
import { Grid } from './Board';
import { Obstruction } from './Object';
import { Enemy, ObstructionEnemy } from './Enemy';
import * as _ from 'lodash';

export abstract class Weapon extends GridObject {
	protected _type: WeaponType;

	constructor(startingLocation: GridLocation) {
		super(startingLocation);
	}

	preventsGameCompletion(): Boolean {
		return false;
	}

	static attack(g: Grid, locs: Array<GridLocation>) {
		locs.forEach( l => {
			let o = g.getObject(l);
			if ( o instanceof Enemy) {
				o.hit();
			}
		});
	}
}

export abstract class DirectionFlame extends Weapon {
	protected _directions: Array<DirectionType>;

	private extendInDirections(g: Grid): Array<GridLocation> {
		let startCursor = new GridCursor(this.location, g.xSize - 1, g.ySize - 1);
		let locsToAttck: Array<GridLocation> = [];
		this._directions.forEach(function(d){
			let c = startCursor.clone();
			while (c.valid(d)) {
				c.move(d);
				let o = g.getObject(c.loc);
				if ( o instanceof Obstruction) {
					break;
				}
				locsToAttck.push(c.loc.clone());
				if (o instanceof ObstructionEnemy && o.state !== 'DEAD') {
					break;
				}
			}
		});

		return locsToAttck;
	}

	afterMyPlace(g: Grid): void {
		this._state = 'ACTIVATED';
		let locsToAttck = this.extendInDirections(g);
		Weapon.attack(g, locsToAttck);
	}
}

export class PlusFlame extends DirectionFlame {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'PLUSFLAME';
		this._directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
	}

	clone(): PlusFlame {
		return new PlusFlame(this._location.clone());
	}
}

export class XFlame extends DirectionFlame {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'XFLAME';
		this._directions = ['NORTH_EAST', 'SOUTH_EAST', 'SOUTH_WEST', 'NORTH_WEST'];
	}

	clone(): XFlame {
		return new XFlame(this._location.clone());
	}
}

export abstract class Bomb extends Weapon {
	protected _destructionSize: number;
	private fuseLit: boolean;

	hit(): void {
		this.fuseLit = true;
	}

	afterPlace(w: Weapon, g: Grid, s: AfterPlaceStages): void {
		if (s === 'SECOND' && this.fuseLit) {
			this._state = 'ACTIVATED';
			let locsToAttck = this.extend(g);
			Weapon.attack(g, locsToAttck);
		}
	}

	private extend(g: Grid): Array<GridLocation> {
		let locsToAttck: Array<GridLocation> = [];
		_.range(-this._destructionSize, this._destructionSize).forEach(function(dx) {
			_.range(-this._destructionSize, this._destructionSize).forEach(function(dy) {
				let l = this.location.displace(dx, dy);
				if (!l.equals(this.location)) {
					locsToAttck.push(l);
				}
			});
		});
		return locsToAttck;
	}
}

export class SmallBomb extends Bomb {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'SMALLBOMB';
		this._destructionSize = 1;
	}

	clone(): SmallBomb {
		return new SmallBomb(this._location.clone());
	}
}

export class LargeBomb extends Bomb {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'LARGEBOMB';
		this._destructionSize = 2;
	}

	clone(): SmallBomb {
		return new SmallBomb(this._location.clone());
	}
}

export class Freeze extends Weapon {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'FREEZE';
	}

	afterMyPlace(g: Grid): void {
		this._state = 'ACTIVATED';
		//TODO
	}

	clone(): Freeze {
		return new Freeze(this._location.clone());
	}
}

