import { createAction } from 'redux-actions';

const PENDING = 'PENDING',
	FULFILLED = 'FULFILLED',
	REJECTED = 'REJECTED';

const ACTION_CLEAR_ERROR = 'CLEAR_ERROR',
	ACTION_RESET_STATE = 'INITIAL_STATE';

class Module {
	constructor(name, initialState) {
		this.name = name;
		this.nameLen = name.length;

		this.initalState = {
			isLoading: false,
			error: null,
			...initialState
		};

		this.actions = {};
		this.nameActionTypes = {};

		this.registerAction = this.registerAction.bind(this);
		// this._getActionName = this._getActionName.bind(this);

		this.reducer = this.reducer.bind(this, getActionName);
		this.onPending = this.onPending.bind(this);
		this.onFulfilled = this.onFulfilled.bind(this);
		this.onRejected = this.onRejected.bind(this);
		this.onNotAsync = this.onNotAsync.bind(this);

		//Private methods
		function getActionName(nameActionType, type = '') {
			if (!this.nameActionTypes[nameActionType]) {
				this.nameActionTypes[nameActionType] = nameActionType.substring(
					this.nameLen + 1,
					nameActionType.length - (type.length ? type.length + 1 : 0)
				);
			}
			return this.nameActionTypes[nameActionType];
		}
	}

	/*_getActionName(nameActionType, type = '') {
		if (!this.nameActionTypes[nameActionType]) {
			this.nameActionTypes[nameActionType] = nameActionType.substring(
				this.nameLen + 1,
				nameActionType.length - (type.length ? type.length + 1 : 0)
			);
		}
		return this.nameActionTypes[nameActionType];
	}*/

	registerAction(name, handle, overwrite = false) {
		const actionName = `${this.name}/${name.toUpperCase()}`;
		if (!overwrite && this.actions[name]) {
			throw new Error(`Duplicate action name: ${actionName}`);
		}
		this.actions[name] = {
			name: actionName,
			get PENDING() {
				return `${this.name}_PENDING`;
			},
			get FULFILLED() {
				return `${this.name}_FULFILLED`;
			},
			get REJECTED() {
				return `${this.name}_REJECTED`;
			}
		};

		if (typeof handle !== 'function') {
			return () => dispatch => dispatch({ type: actionName });
		}
		return handle.bind(this, actionName);

		/*const action = new Action(this.name, name, handle);
		if (!overwrite && this.actions[name]) {
			throw new Error(`Duplicate action name: ${action.name}`);
		}
		this.actions[name] = action;
		return action;*/
	}

	onPending(state, type, payload) {
		return state;
	}

	onFulfilled(state, type, payload) {
		return state;
	}

	onRejected(state, type, payload) {
		return state;
	}

	onNotAsync(state, type, payload) {
		switch (type) {
			case ACTION_RESET_STATE:
				return { ...this.initalState }

		}
		return state;
	}

	reducer(getActionName, state = this.initalState, { type = '', payload = null }) {
		if (type.startsWith(this.name)) {
			if (type.endsWith(PENDING)) {
				return {
					...this.onPending(state, getActionName(type, PENDING), payload),
					isLoading: true,
					error: false
				}
			} else if (type.endsWith(FULFILLED)) {
				return {
					...this.onFulfilled(state, getActionName(type, FULFILLED), payload),
					isLoading: false,
					error: false
				}
			} else if (type.endsWith(REJECTED)) {
				return {
					...this.onRejected(state, getActionName(type, REJECTED), payload),
					isLoading: false,
					error: payload
				}
			} else {
				if (state.isLoading || state.error) {
					return {
						isLoading: false,
						error: false,
						...this.onNotAsync(state, getActionName(type), payload),
					}
				}
				const result = this.onNotAsync(state, getActionName(type), payload);
				if (state !== result) {
					return result
				}
			}
		}
		return state;
	}

	resetState = this.registerAction(ACTION_RESET_STATE);
	clearError = this.registerAction(ACTION_CLEAR_ERROR);
}

class Action {
	constructor(moduleName, name, handle) {
		this._name = `${moduleName}/${name.toUpperCase()}`;
		this._handle = handle;
		this._action = null;

		this.callAction = this.callAction.bind(this);
		this.callHandle = this.callHandle.bind(this);
	}

	get name() {
		return this._name;
	}

	callAction() {
		if (!this._action) {
			this._action = createAction(this._name, this._handle);
		}
		return this._action.apply(this, arguments);
	}

	callHandle() {
		return this._handle.apply(this, arguments);
	}
}

class Action1 {
	constructor(moduleName, name, handle) {
		this._name = `${moduleName}/${name.toUpperCase()}`;
		this._handle = handle;

		this.callAction = this.callAction.bind(this);
		this.callHandle = this.callHandle.bind(this);
	}

	get name() {
		return this._name;
	}

	callAction() {
		if (!this._action) {
			this._action = createAction(this._name, this._handle);
		}
		return this._action.apply(this, arguments);
	}

	callHandle() {
		return this._handle.apply(this, arguments);
	}
}

export default Module
