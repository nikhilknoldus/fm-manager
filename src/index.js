import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost"; //connect with our server which is running at backend
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import GettingGraphQLData from "./components/GettingGraphQLData";

const client = new ApolloClient({
	uri: "https://flexpax-test.herokuapp.com/v1/graphql",
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<ApolloHooksProvider client={client}>
			<GettingGraphQLData />
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
