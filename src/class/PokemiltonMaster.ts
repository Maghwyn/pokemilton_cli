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

	public renamePokemilton(pokemilton: Pokemilton, name: string) {
		if (!this._doesOwnPokemilton(pokemilton)) return; // TODO: Error
		pokemilton.assignNewName(name);
	}

	public healPokemilton(pokemilton: Pokemilton) {
		if (!this._doesOwnPokemilton(pokemilton)) return; // TODO: Error
		if (pokemilton.health === pokemilton.maxHealth) return; // TODO: Error
		this._healingItems -= 1;
		pokemilton.heal();
	}

	public revivePokemilton(pokemilton: Pokemilton) {
		if (!this._doesOwnPokemilton(pokemilton)) return; // TODO: Error
		if (!pokemilton.isDown) return; // TODO: Error
		this._reviveItems -= 1;
		pokemilton.revive();
	}

	public consumePokeball() {
		this._pokeballs -= 1;
	}

	public catchPokemilton(pokemilton: Pokemilton) {
		if (this._doesOwnPokemilton(pokemilton)) return; // TODO: Error
		this._pokemiltonCollection.push(pokemilton);
	}

	public releasePokemilton(pokemilton: Pokemilton) {
		if (!this._doesOwnPokemilton(pokemilton)) return; // TODO: Error
		const index = this._pokemiltonCollection.indexOf(pokemilton);
		this._pokemiltonCollection.slice(index, 1);
	}

	public showCollection() {
		const collectionStr = this._pokemiltonCollection
			.map((pokemilton, index) => {
				return `${index}. ${pokemilton.toString()}`;
			})
			.join('\n');

		return collectionStr;
	}

	private _doesOwnPokemilton(pokemilton: Pokemilton) {
		return this._pokemiltonCollection.includes(pokemilton);
	}
}

export default PokemiltonMaster;