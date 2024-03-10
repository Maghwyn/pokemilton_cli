import { SaveFileWorld } from '@/saves/save.type';

export enum GAME_EVENT {
	NOTHING = 0,
	POKEMILTON_BATTLE = 1,
}

class PokemiltonWorld {
	private _currentDay: number;
	private _logs: Array<string>;

	constructor() {
		this._currentDay = 0;
		this._logs = [];
	}

	static loadWorld(data: SaveFileWorld) {
		const world = new PokemiltonWorld();
		world._currentDay = data.day;
		world._logs = data.logs;
		return world;
	}

	oneDayPasses() {
		this._currentDay += 1;
	}

	generateRandomEvent() {
		const events = [GAME_EVENT.NOTHING, GAME_EVENT.POKEMILTON_BATTLE];
		return events[Math.floor(Math.random() * events.length)];
	}

	addLog(log: string) {
		const format = `Day ${this._currentDay} : ${log}`;
		this._logs.push(format);
	}

	// - Getter / Setter

	get today() {
		return this._currentDay;
	}

	get logs() {
		return this._logs;
	}
}

export default PokemiltonWorld;
