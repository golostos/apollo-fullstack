import {
    ApolloClient,
    ApolloProvider,
    gql,
    NormalizedCacheObject
} from '@apollo/client';
import { Global } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { cache } from './cache';
import Pages from './pages';
import injectStyles from './styles';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
    headers: {
        authorization: localStorage.getItem('token') || '',
    }
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Global styles={injectStyles()} />
        <Pages />
    </ApolloProvider>,
    document.getElementById('root')
)