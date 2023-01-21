import { createYoga, createSchema } from 'graphql-yoga'

const typeDefs = `#graphql
  type Todo {
    title: String!
    description: String!
  }

  type Query {
    todos: [Todo]!
  }
`

const resolvers = {
    Query: {
        todos: async () => {
            const todos = await fetch(`${process.env.MOCK_API_URL}/todo`)
            return await todos.json()
        },
    },
}

const schema = createSchema({
    typeDefs,
    resolvers,
})

export default createYoga({
    schema,
    graphqlEndpoint: '/api/graphql',
})

export const config = {
    api: {
        bodyParser: false,
    },
}
