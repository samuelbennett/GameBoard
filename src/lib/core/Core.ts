import { ObjectType, DirectionType, ObjectStates, AfterPlaceStages } from './Types';
import { Grid } from './Board';
import { Weapon } from './Weapon';

export class GridLocation {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	displace(dx: number, dy: number): GridLocation {
		return new GridLocation(this.x + dx, this.y + dy);
	}

	equals(l: GridLocation) {
		return l.x === this.x && l.y === this.y;
	}

	clone(): GridLocation {
		return new GridLocation(this.x, this.y);
	}
}

export class GridCursor {
	loc: GridLocation;
	maxX: number;
	maxY: number;

	constructor(loc: GridLocation, maxX: number, maxY: number) {
		this.loc = loc;
		this.maxX = maxX;
		this.maxY = maxY;
	}

	move(d: DirectionType) {
		if (!this.valid(d)) {
			throw new Error('Invalid movement');
		}

		switch (d) {
			case 'NORTH':
				this.loc.y -= 1;
				break;
			case 'EAST':
				this.loc.x += 1;
				break;
			case 'SOUTH':
				this.loc.y += 1;
				break;
			case 'WEST':
				this.loc.x -= 1;
				break;
			case 'NORTH_EAST':
				this.loc.y -= 1;
				this.loc.x += 1;
				break;
			case 'SOUTH_EAST':
				this.loc.y += 1;
				this.loc.x += 1;
				break;
			case 'SOUTH_WEST':
				this.loc.y += 1;
				this.loc.x -= 1;
				break;
			case 'NORTH_WEST':
				this.loc.y -= 1;
				this.loc.x -= 1;
				break;
			default:
				throw new Error('Invalid movement');
		}
	}

	//movement is a valid option (doesnt go outside area)
	valid(d: DirectionType): boolean {
		switch (d) {
			case 'NORTH':
				return this.loc.y > 0;
			case 'EAST':
				return this.loc.x < this.maxX;
			case 'SOUTH':
				return this.loc.y < this.maxY;
			case 'WEST':
				return this.loc.x > 0;
			case 'NORTH_EAST':
				return this.loc.y > 0 && this.loc.x < this.maxX;
			case 'SOUTH_EAST':
				return this.loc.y < this.maxY && this.loc.x < this.maxX;
			case 'SOUTH_WEST':
				return this.loc.x > 0 && this.loc.y < this.maxY;
			case 'NORTH_WEST':
				return this.loc.y > 0 && this.loc.x > 0;
			default:
				throw new Error('Invalid movement');
		}
	}

	clone(): GridCursor {
		return new GridCursor(this.loc.clone(), this.maxX, this.maxY);
	}
}

export abstract class GridObject {
	protected _location: GridLocation;
	protected _type: ObjectType;
	protected _state: ObjectStates = 'DEFAULT';

	constructor(startingLocation: GridLocation) {
		this._location = startingLocation;
	}

	get location(): GridLocation{
		return this._location;
	}

	get state(): String{
		return this._state;
	}

	get type(): String{
		return this._type;
	}

	afterMyPlace(g: Grid): void {}
	afterPlace(w: Weapon, g: Grid, s: AfterPlaceStages): void {}
	//called after any weapon is placed on the grid eg frozen bomb needs to unfreeze
	hit(): void {} //called when hit by a damaging weapon

	abstract preventsGameCompletion(): Boolean

	abstract clone(): GridObject;

	isEmpty(): boolean {
		return this._type === 'EMPTY';
	}
}
