import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Container, Root, Spinner } from "native-base";
import { AuthSession } from "expo";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { getStatusBarHeight } from "react-native-status-bar-height";
import FullFridge from "./src/components/fullFridge";
import Home from "./src/pages/home";
import jwtDecode from "jwt-decode";
import API from "./src/utils/API-dev"; // REMOVE FOR FINAL DEPLOYMENT
// import API from "./src/utils/API";
import env from "./env";
import { Font, AppLoading } from "expo";
import { Ionicons } from "@expo/vector-icons";

const auth0ClientId = env.AUTH0_CLIENT_ID;
const auth0Domain = env.AUTH0_DOMAIN;

const styles = StyleSheet.create({
	container: {
		width: vw(100),
		height: vh(100) - getStatusBarHeight(),
		paddingTop: Platform.OS === "ios" ? 0 : getStatusBarHeight()
	}
});

// Converts an object to a query string
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
		isReady: false,
		spinnerOrNo: false
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
		// Spinner is displayed in the view while the login function is processed
		this.setState({ spinnerOrNo: true });
		// Variable to retrieve the redirect URL that gets put into the query parameters that are sent to Auth0
		const redirectUrl = AuthSession.getRedirectUrl();
		console.log(`Redirect URL: ${redirectUrl}`);

		// Object with all the query parameters to add to the authUrl below, fed through the toQueryString function, which takes them and turns them into a legitimate single query string
		const queryParams = toQueryString({
			client_id: auth0ClientId,
			redirect_uri: redirectUrl,
			response_type: "id_token", // id_token will return a JWT token
			scope: "openid profile", // retrieve the user's profile
			nonce: "nonce" // ideally, this will be a random value
		});
		const authUrl = `${auth0Domain}/authorize` + queryParams;

		// The authentication is performed by feeding the authUrl into AuthSession.startAsync
		const response = await AuthSession.startAsync({ authUrl });

		// If the response is successful, login function fires the handleResponse function; if it's unsuccessful, the spinner view is dropped and the user is brought back to the login view
		if (response.type === "success") {
			this.handleResponse(response.params);
		} else {
			this.setState({ spinnerOrNo: false });
		}
	};

	handleResponse = response => {
		if (response.error) {
			Alert(
				"Authentication error",
				response.error_description || "something went wrong"
			);
			this.setState({ spinnerOrNo: false });
			return;
		}

		// The JWT token from the response is received and decoded
		const jwtToken = response.id_token;
		const decoded = jwtDecode(jwtToken);
		let user;

		// Necessary details about the user are pulled from the decoded JWT token, depending on whether the user signs in with just a name and e-mail address or through third-part authentication via Google or Facebook
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

		// The user's details are fed into checkForOrCreateUser to determine whether they've signed into the site before, then the user is set in the state object
		API.checkForOrCreateUser(user)
			.then(() => {
				this.setState({ user, spinnerOrNo: false });
			})
			.catch(err => console.error(err));
	};

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}
		const { user } = this.state;
		return (
			<Root>
				<Container style={styles.container}>
					{(() => {
						if (user.name && !this.state.spinnerOrNo) {
							return <Home user={user} />;
						} else if (!this.state.spinnerOrNo) {
							return <FullFridge login={this.login} />;
						} else {
							return (
								<Spinner
									color="#193652"
									style={{ flex: 1, backgroundColor: "#EBF5FF" }}
								/>
							);
						}
					})()}
				</Container>
			</Root>
		);
	}
}
