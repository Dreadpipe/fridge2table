import axios from 'axios';
import env from '../../env';

export default {
  get() {
    return axios.get(`http://${env.IP_ADDRESS}:3001/`);
  },
  checkForOrCreateUser(data) {
    return axios.post(`http://${env.IP_ADDRESS}:3001/newUser`, data);
  },
  getCurrentUser(id) {
    return axios.get(`http://${env.IP_ADDRESS}:3001/findOneUser/${id}`);
  }
};