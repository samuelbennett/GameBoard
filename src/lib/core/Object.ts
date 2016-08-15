import { GridLocation, GridObject } from './Core';
import { ObjectType } from './Types';
import { Grid } from './Board';

export class Obstruction extends GridObject {
	protected _type: ObjectType = 'OBSTRUCTION';

	constructor(startingLocation: GridLocation) {
		super(startingLocation);
	}

	preventsGameCompletion(): Boolean {
		return false;
	}

	clone(): Obstruction {
		return new Obstruction(this._location.clone());
	}
}

export class Empty extends GridObject {
	protected _type: ObjectType = 'EMPTY';

	constructor(startingLocation: GridLocation) {
		super(startingLocation);
	}

	preventsGameCompletion(): Boolean {
		return false;
	}

	clone(): Empty {
		return new Empty(this._location.clone());
	}
}
