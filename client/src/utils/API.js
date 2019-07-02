import axios from "axios";

export default {
	get() {
		return axios.get(`https://immense-ravine-93808.herokuapp.com/`);
	},
	addFood(product) {
		return axios.post(
			`https://immense-ravine-93808.herokuapp.com/newProduct`,
			product
		);
	},
	removeFood(product) {
		return axios.post(
			`https://immense-ravine-93808.herokuapp.com/removeProduct`,
			product
		);
	},
	updateFood(product) {
		return axios.put(
			`https://immense-ravine-93808.herokuapp.com/updateProduct`,
			product
		);
	},
	checkForOrCreateUser(data) {
		return axios.post(
			`https://immense-ravine-93808.herokuapp.com/newUser`,
			data
		);
	},
	getCurrentUser(id) {
		return axios.get(
			`https://immense-ravine-93808.herokuapp.com/findOneUser/${id}`
		);
	}
};
