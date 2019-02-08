'use strict';

module.exports = {
	get Redux() {
		return require('react-redux');
	},

	get connect() {
		return require('react-redux').connect;
	},

	get Provider() {
		return require('react-redux').Provider;
	},

	get Module() {
		return {
			get Basic() {
				return require('./src/Module/index');
			},
			get Table() {
				return require('./src/Module/Table');
			},
			get Auth() {
				return require('./src/Module/Auth');
			}
		}
	},

	get LocalStorage() {
		return require('./src/LocalStorage');
	},

	get Store() {
		return require('./src/store');
	},

	get Utils() {
		return require('./src/utils');
	}
};
