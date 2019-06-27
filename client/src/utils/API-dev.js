import axios from "axios";
import env from "../../env";

export default {
	get() {
		return axios.get(`http://${env.IP_ADDRESS}:3001/`);
	},
	addFood(product) {
		return axios.post(`http://${env.IP_ADDRESS}:3001/newProduct`, product);
	},
	removeFood(product) {
		return axios.post(`http://${env.IP_ADDRESS}:3001/removeProduct`, product);
	},
	updateFood(product) {
		return axios.put(`http://${env.IP_ADDRESS}:3001/updateProduct`, product);
	},
	checkForOrCreateUser(data) {
		return axios.post(`http://${env.IP_ADDRESS}:3001/newUser`, data);
	},
	getCurrentUser(id) {
		return axios.get(`http://${env.IP_ADDRESS}:3001/findOneUser/${id}`);
	}
};
