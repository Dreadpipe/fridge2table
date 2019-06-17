import axios from 'axios';
import env from '../../env';

export default {
  get() {
    return axios.get(`http://${env.IP_ADDRESS}:3001/`);
  },
  scanFood(data) {
    return axios.get(`https://api.edamam.com/api/food-database/parser?upc=${data}&app_id=2738ba89&app_key=18838a2aa6866b92497c8ebae315be66`).then((response) => {
      console.log(response.data);  
      alert(`You just scanned: ${response.data.hints[0].food.label}`);
      })
  },
  checkForOrCreateUser(data) {
    return axios.post(`http://${env.IP_ADDRESS}:3001/newUser`, data);
  },
  getCurrentUser(id) {
    return axios.get(`http://${env.IP_ADDRESS}:3001/findOneUser/${id}`);
  }
};