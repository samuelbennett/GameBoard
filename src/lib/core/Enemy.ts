import * as Collections from 'typescript-collections';
import { GridLocation, GridObject } from './Core';
import { EnemyType, EnemyFlag } from './Types';
import { Grid } from './Board';

export abstract class Enemy extends GridObject {
	protected _type: EnemyType;
	protected _lives: number;
	protected _flags: Collections.Dictionary<EnemyFlag, boolean> = new Collections.Dictionary<EnemyFlag, boolean>();;


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

	setFlag(f: EnemyFlag, b:boolean) {
		this._flags.setValue(f, b);
	}

	getFlagSate(f: EnemyFlag) {
		if(!this._flags.containsKey(f)){
			return false;
		}
		return this._flags.getValue(f);
	}

	hit() {
		if (this._state === 'DEAD') {
			this._state = 'TO_BE_REMOVED';
			return;
		}

		if (this.getFlagSate('INVINCIBLE')) {
			return;
		}

		if (this.getFlagSate('FROZEN')) {
			this._lives = 0;
		}

		this._lives -= 1;

		if (this._lives <= 0) {
			this._lives = 0;
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

	setFlag(f: EnemyFlag, b:boolean) {
		if(f === 'FROZEN'){
			if(b){
				this.shieldDown();
			}
			else{
				this.shieldUp();
			}

		}
		this._flags.setValue(f, b);
	}

	private shieldUp(){
		//TODO
	}

	private shieldDown(){
		//TODO
	}

	clone(): SaintEnemy {
		return new SaintEnemy(this._location.clone());
	}
}
