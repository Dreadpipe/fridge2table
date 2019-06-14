import axios from 'axios';
import env from '../../env';

export default {
  get() {
    return axios.get(`http://${env.IP_ADDRESS}:3001/`);
  },
};