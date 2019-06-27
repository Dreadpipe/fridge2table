import axios from 'axios';
import env from '../../env';

export default {
  get() {
    return axios.get(`https://immense-ravine-93808.herokuapp.com/`);
  },
  addFood(product) {
    return axios.post(`https://immense-ravine-93808.herokuapp.com/newProduct`, product)
  },
  removeFood(product) {
    return axios.post(`https://immense-ravine-93808.herokuapp.com/removeProduct`, product)
  },
  updateFood(product) {
    return axios.put(`https://immense-ravine-93808.herokuapp.com/updateProduct`, product)
  },
  // scanFood(data, id) {
  //   return axios.get(`https://api.edamam.com/api/food-database/parser?upc=${data}&app_id=2738ba89&app_key=18838a2aa6866b92497c8ebae315be66`)
  //   .then((response) => {
  //     //console.log(response.data);  
  //     alert(`You just scanned: ${response.data.hints[0].food.label}`);
  //     const newProduct = {
  //       name: response.data.hints[0].food.label,
  //       category: "Dairy",
  //       id: response.data.hints[0].food.foodId,
  //       location: "Fridge",
  //       quantity: 1,
  //       userId: id
  //     };
  //     this.addFood(newProduct);
  //     //console.log(newProduct);
  //   })
  // },
  checkForOrCreateUser(data) {
    return axios.post(`https://immense-ravine-93808.herokuapp.com/newUser`, data);
  },
  getCurrentUser(id) {
    return axios.get(`https://immense-ravine-93808.herokuapp.com/findOneUser/${id}`);
  },
};