import PokemiltonArena from './PokemiltonArena';
import Pokemilton from './Pokemilton';
import { SaveFileWorld } from '@/saves/save.type';

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

	// ?
	randomizeEvent() {}

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
