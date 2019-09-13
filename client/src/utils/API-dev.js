import axios from 'axios';
import getEnvVars from '../../env';

const { IP_ADDRESS } = getEnvVars();

export default {
	get() {
		return axios.get(`http://${IP_ADDRESS}:3001/`);
	},
	addFood(product) {
		return axios.post(`http://${IP_ADDRESS}:3001/newProduct`, product);
	},
	removeFood(product) {
		return axios.post(`http://${IP_ADDRESS}:3001/removeProduct`, product);
	},
	updateFood(product) {
		return axios.put(`http://${IP_ADDRESS}:3001/updateProduct`, product);
	},
	checkForOrCreateUser(data) {
		return axios.post(`http://${IP_ADDRESS}:3001/newUser`, data);
	},
	getCurrentUser(id) {
		return axios.get(`http://${IP_ADDRESS}:3001/findOneUser/${id}`);
	},
	updateUser(query) {
		return axios.put(`http://${IP_ADDRESS}:3001/updateUser`, query);
	},
	postGroceryItem(item) {
		return axios.post(`http://${IP_ADDRESS}:3001/newGroceryItem`, item);
	},
	updateGroceryItem(item) {
		return axios.put(`http://${IP_ADDRESS}:3001/updateGroceryItem`, item);
	},
	removeGroceryItem(item) {
		return axios.post(`http://${IP_ADDRESS}:3001/removeGroceryItem`, item);
	}
};
