// src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "/graphql",        // trỏ đúng tới GraphQL endpoint của bạn
    credentials: "include", // nếu cần cookie/session
  }),
  cache: new InMemoryCache(),
});
