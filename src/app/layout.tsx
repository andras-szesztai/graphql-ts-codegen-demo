'use client'

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
} from '@apollo/client'

import './globals.css'

const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head />
            <body>
                <ApolloProvider client={client}>{children}</ApolloProvider>
            </body>
        </html>
    )
}
