import PokemiltonArena from './PokemiltonArena';
import Pokemilton from './Pokemilton';

class PokemiltonWorld {
	private _currentDay: number;
	private _logs: Array<string>;

	constructor() {
		this._currentDay = 0;
		this._logs = [];
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
