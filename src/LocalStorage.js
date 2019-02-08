
export default class LocalStorage {
	constructor() {
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
		this.remove = this.remove.bind(this);
	}

	get(name) {
		throw new Error('Implementation of the GET method is required');
	}

	set(name, value) {
		throw new Error('Implementation of the SET method is required');
	}

	remove(name) {
		throw new Error('Implementation of the REMOVE method is required');
	}
}