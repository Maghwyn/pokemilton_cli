import { log } from '@clack/prompts';
import pc from 'picocolors';

import Pokemilton from '@/class/Pokemilton';
import { SaveFileMaster } from '@/saves/save.type';

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

	static loadMaster(data: SaveFileMaster) {
		const master = new PokemiltonMaster(data.name);
		master._healingItems = data.healingItems;
		master._reviveItems = data.reviveItems;
		master._pokeballs = data.pokeballs;

		master._pokemiltonCollection = data['pokemilton™Collection'].map((pokemilton) => {
			return Pokemilton.loadPokemilton(pokemilton);
		});

		return master;
	}

	public renamePokemilton(pokemilton: Pokemilton, name: string) {
		pokemilton.assignNewName(name);
	}

	public healPokemilton(pokemilton: Pokemilton) {
		if (this.reviveItems === 0) {
			log.warn(pc.yellow(`You don't have a single remaning healing item.`));
			return;
		}

		if (pokemilton.health === pokemilton.maxHealth) {
			log.warn(pc.yellow(`${pokemilton.name} is already full health !`));
			return;
		}

		this._healingItems -= 1;
		pokemilton.heal();
	}

	public revivePokemilton(pokemilton: Pokemilton) {
		if (this.reviveItems === 0) {
			log.warn(pc.yellow(`You don't have a single remaning revive item.`));
			return;
		}

		if (!pokemilton.isDown) {
			log.warn(pc.yellow(`${pokemilton.name} is not down, can't use the revive item !`));
			return;
		}

		this._reviveItems -= 1;
		pokemilton.revive();
	}

	public consumePokeball() {
		if (this._pokeballs === 0) {
			log.warn(pc.yellow(`You don't have a single remaining pokeballs.`));
			return false;
		}

		this._pokeballs -= 1;
		return true;
	}

	public catchPokemilton(pokemilton: Pokemilton) {
		this._pokemiltonCollection.push(pokemilton);
	}

	public releasePokemilton(pokemilton: Pokemilton) {
		this._pokemiltonCollection = this._pokemiltonCollection.filter(
			(poke) => poke !== pokemilton,
		);
	}

	public showCollection() {
		const collectionStr = this._pokemiltonCollection
			.map((pokemilton, index) => {
				return `${index}. ${pokemilton.toString()}`;
			})
			.join('\n');

		return collectionStr;
	}

	// - Getter/Setter

	get name() {
		return this._name;
	}

	get healingItems() {
		return this._healingItems;
	}

	get reviveItems() {
		return this._reviveItems;
	}

	get pokeballs() {
		return this._pokeballs;
	}

	get pokemiltons() {
		return this._pokemiltonCollection.map((pokemiltons) => {
			return pokemiltons.toObject();
		});
	}

	get collection() {
		return this._pokemiltonCollection;
	}
}

export default PokemiltonMaster;
