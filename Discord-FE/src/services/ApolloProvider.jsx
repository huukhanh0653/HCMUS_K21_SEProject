// src/ApolloProvider.tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8082/graphql", // đổi nếu backend bạn ở port khác
  cache: new InMemoryCache(),
});



export default function GraphQLProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
