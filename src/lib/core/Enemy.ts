import { GridLocation, GridObject } from './Core';
import { EnemyType, SettableEnemyStates } from './Types';
import { Grid } from './Board';

export abstract class Enemy extends GridObject {
	protected _type: EnemyType;
	protected _lives: number;

	constructor(startingLocation: GridLocation) {
		super(startingLocation);
	}

	get lives(): number {
		return this._lives;
	}

	isDead(): Boolean {
		return this._lives === 0;
	}

	preventsGameCompletion(): Boolean {
		return !this.isDead();
	}

	setState(s: SettableEnemyStates) {
		this._state = s;
	}

	hit() {
		if (this._state === 'DEAD') {
			this._state = 'TO_BE_REMOVED';
			return;
		}

		if (this._state === 'INVINCIBLE') {
			return;
		}

		if (this._state === 'FROZEN') {
			this._lives = 0;
			return;
		}

		this._lives -= 1;

		if (this._lives <= 0) {
			this._state = 'DEAD';
		}
	}
}

export class BasicEnemy extends Enemy {
	constructor(startingLocation: GridLocation, lives: number) {
		super(startingLocation);
		this._type = 'BASIC_ENEMY';
		this._lives = lives;
	}

	clone(): BasicEnemy {
		return new BasicEnemy(this._location.clone(), this._lives);
	}
}

export class ObstructionEnemy extends Enemy {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'OBSTRUCTION_ENEMY';
		this._lives = 1;
	}

	clone(): ObstructionEnemy {
		return new ObstructionEnemy(this._location.clone());
	}
}

export class SaintEnemy extends Enemy {
	constructor(startingLocation: GridLocation) {
		super(startingLocation);
		this._type = 'SAINT_ENEMY';
		this._lives = 1;
	}

	clone(): SaintEnemy {
		return new SaintEnemy(this._location.clone());
	}
}
