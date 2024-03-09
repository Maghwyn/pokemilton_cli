import Pokemilton from '@/class/Pokemilton';

class PokemiltonMaster {
	private _name: string;
	private _pokemiltonCollection: Array<Pokemilton>;
	private _healingItems: number;
	private _reviveItems: number;
	private _pokeballs: number;

	constructor(name: string) {
		this._name = name;
		this._pokemiltonCollection = [];
		this._healingItems = 5; // Initial number of healing items
		this._reviveItems = 3; // Initial number of revive items
		this._pokeballs = 10; // Initial number of JOHNEBALLS
	}

	renamePokemilton(pokemilton: Pokemilton) {}

	healPokemilton(pokemilton: Pokemilton) {}

	revivePokemilton(pokemilton: Pokemilton) {}

	releasePokemilton(pokemilton: Pokemilton) {}

	showCollection() {}
}

export default PokemiltonMaster;
