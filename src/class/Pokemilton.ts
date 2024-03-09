import { STUDENTS } from '@/constants/students';

class Pokemilton {
	private _name: string;
	private _level: number;
	private _experienceMeter: number;
	private _attackRange: number;
	private _defenseRange: number;
	private _healthPool: number;
	private _catchPhrase: string;

	constructor() {
		this._name = this.generateRandomName();
		this._level = 1;
		this._experienceMeter = 0;
		this._attackRange = this.getRandomNumber(1, 8);
		this._defenseRange = this.getRandomNumber(1, 3);
		this._healthPool = this.getRandomNumber(10, 30);
		this._catchPhrase = this.generateCatchPhrase();
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
		defender._healthPool -= damage;
		console.log(`${this._name} attacked ${defender._name} and dealt ${damage} damage!`);
	}

	gainExperience(opponentLevel: number) {
		const experienceGain = this.getRandomNumber(1, 5) * opponentLevel;
		this._experienceMeter += experienceGain;
		console.log(`${this._name} gained ${experienceGain} experience points!`);
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
		this._healthPool += healthIncrease;

		console.log(
			`${this._name} evolved into a higher level! New stats: Level ${this._level}, Attack Range ${this._attackRange}, Defense Range ${this._defenseRange}, Health Pool ${this._healthPool}`,
		);
	}

	sayCatchPhrase() {
		console.log(`${this._name} says: "${this._catchPhrase}"`);
	}
}

export default Pokemilton;
