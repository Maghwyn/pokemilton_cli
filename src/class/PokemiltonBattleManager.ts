import { isCancel, log, select } from '@clack/prompts';
import pc from 'picocolors';

import Pokemilton from '@/class/Pokemilton';
import { killGame } from '@/utils/kill';
import PokemiltonMaster from '@/class/PokemiltonMaster';

export enum BATTLE_ACTION {
	ATTACK = 1,
	CATCH = 2,
	SWITCH = 3,
	RUN_AWAY = 4,
}

class PokemiltonBattleManager {
	private _masterPokemilton: Pokemilton;
	private _wildPokemilton: Pokemilton;
	private _isBattleActive: boolean;
	private _master: PokemiltonMaster;
	private _hasWon: boolean;

	constructor(
		masterPokemilton: Pokemilton,
		wildPokemilton: Pokemilton,
		master: PokemiltonMaster,
	) {
		this._masterPokemilton = masterPokemilton;
		this._wildPokemilton = wildPokemilton;
		this._master = master;
		this._isBattleActive = true;
		this._hasWon = false;
	}

	public async playerAction(action: BATTLE_ACTION) {
		switch (action) {
			case BATTLE_ACTION.ATTACK:
				this._attack(this._masterPokemilton, this._wildPokemilton);
				this._checkBattleStatus();
				break;
			case BATTLE_ACTION.CATCH:
				const isCatch = this._tryToCatch();
				if (isCatch) this._endBattle(true);
				break;
			case BATTLE_ACTION.SWITCH:
				if (this.masterHasPokemiltonAlive) {
					const pokemilton = await this._switchPokemilton();
					this._masterPokemilton = pokemilton;
				} else {
					this._endBattle(false);
				}
				break;
			case BATTLE_ACTION.RUN_AWAY:
				this._endBattle(false);
				break;
		}
	}

	public wildPokemiltonAction() {
		this._attack(this._wildPokemilton, this._masterPokemilton);
		this._checkBattleStatus();
	}

	public awardExperiencePoints() {
		this._masterPokemilton.gainExperience(this._wildPokemilton.level);
	}

	private async _switchPokemilton() {
		const pokemilton = (await select({
			message: 'Choose one of your pokemilton',
			options: this._master.collection.map((pokemilton) => {
				return { value: pokemilton, label: pokemilton.toString() };
			}),
		})) as Pokemilton;

		if (pokemilton.health <= 0) {
			log.warn(pc.yellow(`${pokemilton.name} is not able to fight because it is down !`));
			return this._switchPokemilton();
		}

		if (isCancel(pokemilton)) {
			killGame();
		}

		return pokemilton;
	}

	private _attack(selectedPokemilton: Pokemilton, targetPokemilton: Pokemilton) {
		selectedPokemilton.attack(targetPokemilton);
	}

	private _tryToCatch() {
		const percentage = (this._wildPokemilton.health / this._wildPokemilton.maxHealth) * 100;
		const chances = 100 - percentage;
		const dice = Math.random() * 100;

		if (dice < chances) {
			const consumed = this._master.consumePokeball();
			if (!consumed) return false;

			this._master.catchPokemilton(this._wildPokemilton);
			return true;
		}

		return false;
	}

	private _checkBattleStatus() {
		if (this._masterPokemilton.health <= 0) {
			this._masterPokemilton.isDown = true;
		}

		if (this._wildPokemilton.health <= 0) {
			this._endBattle(true);
		} else if (!this.masterHasPokemiltonAlive) {
			this._endBattle(false);
		}
	}

	private _endBattle(hasWon: boolean) {
		this._isBattleActive = false;
		this._hasWon = hasWon;
	}

	// - Getter/Setter

	get isBattleActive() {
		return this._isBattleActive;
	}

	get isForcedToSwitch() {
		return this._masterPokemilton.health <= 0;
	}

	get masterHasPokemiltonAlive() {
		return this._master.collection.some((pokemilton) => pokemilton.health > 0);
	}

	get hasWon() {
		return this._hasWon;
	}
}

export default PokemiltonBattleManager;
