import * as Collections from 'typescript-collections';
import {Promise} from 'es6-promise';
import { WeaponType } from '../core/Types';
import { GridLocation } from '../core/Core';
import { BoardState } from '../core/Board';
import { LevelData } from '../core/Level';
import * as log from 'loglevel';
import * as _ from 'lodash';

export class UserAPI {

	currentBoardState: BoardState;

	takeAction(action: UserAction): Promise<any> {
		return action.go(this.currentBoardState, this);
	}
}

export abstract class UserAction {
	abstract go(bs: BoardState, api: UserAPI): Promise<any>;
}

export class LoadLevel extends UserAction {
	levelData : LevelData;

	go(bs: BoardState, api: UserAPI): Promise<any> {
		api.currentBoardState = new BoardState(this.levelData);
		return Promise.resolve();
	}
}

export class PlaceWeapon extends UserAction {
	type: WeaponType;
	location: GridLocation;

	go(bs: BoardState): Promise<any> {
		try {
			bs.beginTransaction();
			let w = bs.inventory.makeWeapon(this.type, this.location);
			bs.grid.placeObject(w);
			w.afterMyPlace(bs.grid);
			_.each(bs.grid.objectsFlat, function(o){
				o.afterPlace(w, bs.grid, 'FIRST');
			});
			bs.grid.runCleanup();
			bs.commitTransaction();
			return Promise.resolve();
		} catch (e) {
			log.error('Transaction fail');
			log.error(e);
			bs.revertTransaction();
			return Promise.reject(e);
		}
	}
}
