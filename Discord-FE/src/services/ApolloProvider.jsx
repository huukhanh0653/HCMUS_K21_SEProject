// src/ApolloProvider.tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
//import { Message_API } from "../../apiConfig";

// API base URL from Vite environment
const Message_API = import.meta.env.VITE_MESSAGE_API;

const client = new ApolloClient({
  uri: `${Message_API}/graphql`, // đổi nếu backend bạn ở port khác
  cache: new InMemoryCache(),
});



export default function GraphQLProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
