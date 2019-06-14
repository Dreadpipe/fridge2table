import React from "react";
import Home from "./src/pages/home";
import Login from './src/pages/login';
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Home: Home,
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(AppNavigator);

function App() {
	return (
		<AppContainer />
	);
}

export default App;
