import Module from './index';
import axios from 'axios';
import qs from 'qs';

const ACTION_GET_PROFILE = 'GET_PROFILE',
	ACTION_LOGIN = 'LOGIN',
	ACTION_LOGOUT = 'LOGOUT';

class Auth extends Module {
	constructor(name, api, storage) {
		super(name, {
			user: null
		});
		this.api = api;
		this.storage = storage;

		this._getJwt = this._getJwt.bind(this);
		this._setJwt = this._setJwt.bind(this);
		this._removeJwt = this._removeJwt.bind(this);
	}

	_getJwt() {
		const jwt = this.storage.get('jwt');
		if (jwt) {
			axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
			return jwt;
		}
	};

	_setJwt(jwt) {
		this.storage.set('jwt', jwt);
	};

	async _removeJwt() {
		await this.storage.remove('jwt');
		delete axios.defaults.headers.common.Authorization;
	};

	getProfile = this.registerAction(ACTION_GET_PROFILE, (type,) => async dispatch => {
		if (await this._getJwt()) {
			return dispatch({
				type,
				payload: axios.get(this.api)
			});
		}
	});

	login = this.registerAction(ACTION_LOGIN, (type, data) => async dispatch => {
		dispatch({ type: type.PENDING });
		try {
			const { data: { data: { token } } } = axios.post(`${this.api}/login`, data);
			this._setJwt(token);
			return dispatch(this.getProfile());
		} catch (e) {
			return dispatch({ type: type.REJECTED, payload: e });
		}
	});

	logout = this.registerAction(ACTION_LOGOUT, type => dispatch => dispatch({
		type,
		payload: this._removeJwt()
	}));

	onFulfilled(state, type, payload) {
		switch (type) {
			case ACTION_GET_PROFILE:
				return { ...state, user: payload.data.data };

			case ACTION_LOGOUT:
				return { ...state, user: null };
		}
		return super.onFulfilled(state, type, payload);
	}
}

export default Auth;