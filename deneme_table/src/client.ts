import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://hasura.demo.windeskfm.com/v1/graphql',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': 'CqM8*iLbz%',
    },
  }),
  cache: new InMemoryCache({}),
});
export default client;
