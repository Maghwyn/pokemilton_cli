import { log } from '@clack/prompts';
import pc from 'picocolors';

import { STUDENTS } from '@/constants/students';
import { SaveFilePokemilton } from '@/saves/save.type';

class Pokemilton {
	private _name: string;
	private _level: number;
	private _experienceMeter: number;
	private _attackRange: number;
	private _defenseRange: number;
	private _health: number;
	private _maxHealth: number;
	private _catchPhrase: string;
	private _isDown: boolean;

	constructor() {
		this._name = this.generateRandomName();
		this._level = 1;
		this._experienceMeter = 0;
		this._attackRange = this.getRandomNumber(1, 8);
		this._defenseRange = this.getRandomNumber(1, 3);
		this._maxHealth = this.getRandomNumber(10, 30);
		this._health = this._maxHealth;
		this._catchPhrase = this.generateCatchPhrase();
		this._isDown = false;
	}

	static loadPokemilton(data: SaveFilePokemilton) {
		const pokemilton = new Pokemilton();
		pokemilton._name = data.name;
		pokemilton._level = data.level;
		pokemilton._experienceMeter = data.experienceMeter;
		pokemilton._attackRange = data.attackRange;
		pokemilton._defenseRange = data.defenseRange;
		pokemilton._health = data.health;
		pokemilton._maxHealth = data.maxHealth;
		pokemilton._catchPhrase = data.catchPhrase;
		pokemilton._isDown = data.isDown;
		return pokemilton;
	}

	generateRandomName() {
		const len = STUDENTS.length;
		const randomStudent1 = STUDENTS[Math.floor(Math.random() * len)];
		const randomStudent2 = STUDENTS[Math.floor(Math.random() * len)];
		return `${randomStudent1}${randomStudent2}`;
	}

	getRandomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	generateCatchPhrase() {
		const phrases = ['I choose you!', 'Let the battle begin!', 'Pokemilton, go!'];
		return phrases[Math.floor(Math.random() * phrases.length)];
	}

	attack(defender: Pokemilton) {
		const damage =
			this.getRandomNumber(this._attackRange * this._level, this._attackRange) -
			defender._defenseRange;
		defender._health -= damage;
		log.info(pc.blue(`${this._name} attacked ${defender._name} and dealt ${damage} damage!`));
	}

	gainExperience(opponentLevel: number) {
		const experienceGain = this.getRandomNumber(1, 5) * opponentLevel;
		this._experienceMeter += experienceGain;
		log.info(pc.blue(`${this._name} gained ${experienceGain} experience points!`));
		if (this._experienceMeter >= this._level * 100) {
			this.evolve();
		}
	}

	evolve() {
		this._level += 1;
		const attackIncrease = this.getRandomNumber(1, 5);
		const defenseIncrease = this.getRandomNumber(1, 5);
		const healthIncrease = this.getRandomNumber(1, 5);

		this._attackRange += attackIncrease;
		this._defenseRange += defenseIncrease;
		this._maxHealth += healthIncrease;
		this._health += healthIncrease;

		log.info(
			pc.blue(
				`${this._name} evolved into a higher level! New stats: Level ${this._level}, Attack Range ${this._attackRange}, Defense Range ${this._defenseRange}, Health ${this._health}, Max Health ${this._maxHealth}`,
			),
		);
	}

	sayCatchPhrase() {
		log.info(pc.blue(`${this._name} says: "${this._catchPhrase}"`));
	}

	// - Own functions

	assignNewName(name: string) {
		this._name = name;
	}

	heal() {
		this._health = this._maxHealth;
	}

	revive() {
		this._health = this._maxHealth / 2;
		this._isDown = false;
	}

	// - Getter Setter

	get health() {
		return this._health;
	}

	get maxHealth() {
		return this._maxHealth;
	}

	get isDown() {
		return this._isDown;
	}

	set isDown(value: boolean) {
		this._isDown = value;
	}

	get name() {
		return this._name;
	}

	get level() {
		return this._level;
	}

	// - Convertors

	toString() {
		const percentage = (this._health / this._maxHealth) * 100;
		const str = `${this._name} | Stats: level ${this._level}, ${this._experienceMeter} exp, ${this._health} hp, ${this._maxHealth} maxHp, ${this._attackRange} atk, ${this._defenseRange} def`;

		switch (true) {
			case percentage >= 50:
				return pc.green(str);
			case percentage >= 25:
				return pc.yellow(str);
			case percentage > 0:
				return pc.red(str);
			default:
				return pc.dim(str);
		}
	}

	toObject() {
		return {
			name: this._name,
			level: this._level,
			health: this._health,
			maxHealth: this._maxHealth,
			experienceMeter: this._experienceMeter,
			attackRange: this._attackRange,
			catchPhrase: this._catchPhrase,
			defenseRange: this._defenseRange,
			isDown: this._isDown,
		};
	}
}

export default Pokemilton;
