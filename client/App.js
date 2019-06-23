import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Container } from "native-base";
import { AuthSession } from "expo";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { getStatusBarHeight } from "react-native-status-bar-height";
import FullFridge from "./src/components/fullFridge";
import Home from "./src/pages/home";
import jwtDecode from "jwt-decode";
import API from "./src/utils/API";
import env from "./env";
import { Font, AppLoading } from "expo";
import { Ionicons } from "@expo/vector-icons";

const auth0ClientId = env.AUTH0_CLIENT_ID;
const auth0Domain = env.AUTH0_DOMAIN;

const styles = StyleSheet.create({
	container: {
		width: vw(100),
		height: vh(100) - getStatusBarHeight(),
		paddingTop: Platform.OS === 'ios' ? 0 : getStatusBarHeight()
	}
});

/**
 * Converts an object to a query string.
 */
function toQueryString(params) {
	return (
		"?" +
		Object.entries(params)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
			)
			.join("&")
	);
}

export default class App extends React.Component {
	state = {
		user: {},
		isReady: false
	};

	componentWillMount() {
		this.loadFonts();
	}

	async loadFonts() {
		await Font.loadAsync({
			Roboto: require("native-base/Fonts/Roboto.ttf"),
			Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
			FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
			MaterialCommunityIcons: require("native-base/Fonts/MaterialCommunityIcons.ttf"),
			...Ionicons.font
		});
		this.setState({ isReady: true });
	}

	login = async () => {
		// Retrieve the redirect URL, add this to the callback URL list
		// of your Auth0 application.
		const redirectUrl = AuthSession.getRedirectUrl();
		console.log(`Redirect URL: ${redirectUrl}`);

		// Structure the auth parameters and URL
		const queryParams = toQueryString({
			client_id: auth0ClientId,
			redirect_uri: redirectUrl,
			response_type: "id_token", // id_token will return a JWT token
			scope: "openid profile", // retrieve the user's profile
			nonce: "nonce" // ideally, this will be a random value
		});
		const authUrl = `${auth0Domain}/authorize` + queryParams;

		// Perform the authentication
		const response = await AuthSession.startAsync({ authUrl });

		if (response.type === "success") {
			this.handleResponse(response.params);
		}
	};

	handleResponse = response => {
		if (response.error) {
			Alert(
				"Authentication error",
				response.error_description || "something went wrong"
			);
			return;
		}

		// Retrieve the JWT token and decode it
		const jwtToken = response.id_token;
		const decoded = jwtDecode(jwtToken);
		let user;

		if (decoded.sub.split("|")[0] === "auth0") {
			user = {
				name: decoded.nickname,
				id: decoded.sub.split("|")[1]
			};
		} else {
			user = {
				name: decoded.name,
				id: decoded.sub.split("|")[1]
			};
		}

		API.checkForOrCreateUser(user).then(() => {
			console.log("Setting user ...")
			this.setState({ user });
		});
	};

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}
		const { user } = this.state;
		return (
			<Container style={styles.container}>
				{user.name ? <Home user={user} /> : <FullFridge login={this.login} />}
			</Container>
		);
	}
}
