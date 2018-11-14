import Module from './index';
import axios from 'axios';
import qs from 'qs';

const ACTION_GET = 'GET',
	ACTION_GET_BY_ID = 'GET_BY_ID',
	ACTION_SAVE = 'SAVE',
	ACTION_REMOVE = 'REMOVE';

export default class Table extends Module {
	constructor(name, api, isMultipart = false) {
		super(name, {
			data: {
				results: [],
				total: 0,
			}
		});
		this.api = api;
		this.isMultipart = isMultipart;
	}

	get = this.registerAction(ACTION_GET, (type, params) => dispatch => dispatch({
		type,
		payload: axios.get(this.api, { params, paramsSerializer: params => qs.stringify(params) })
	}));

	getById = this.registerAction(ACTION_GET_BY_ID, (type, id) => dispatch => dispatch({
		type,
		payload: axios.get(`${this.api}/${id}`)
	}));

	save = this.registerAction(ACTION_SAVE, (type, data) => dispatch => {
		const { id } = data;
		let options;

		if (this.isMultipart) {
			const formData = new FormData();

			for (const key in data) {
				if (data.hasOwnProperty(key) && data[key] instanceof File) {
					formData.append(key, data[key]);
					delete data[key];
				}
			}

			formData.append('json', JSON.stringify(data));

			data = formData;
			options = { headers: { 'Content-Type': 'multipart/form-data' } };
		}

		return dispatch({
			type,
			payload: id ? axios.put(`${this.api}/${id}`, data, options) : axios.post(this.api, data, options)
		});
	});

	remove = this.registerAction(ACTION_REMOVE, (type, id, filter, page) => async dispatch => {
		try {
			await axios.delete(`${this.api}/${id}`);
			return dispatch(this.get({ filter, page }));
		} catch (e) {
			return dispatch({ type: type.REJECTED, payload: e });
		}
	});
}