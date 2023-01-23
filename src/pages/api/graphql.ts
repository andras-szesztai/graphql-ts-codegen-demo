import { createYoga, createSchema } from 'graphql-yoga'

const typeDefs = `#graphql
  type CatFact {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    catFacts: [CatFact!]!
  }

  type CatFactId {
    id: ID!
  }

  type Mutation {
    createCatFact(title: String!, description: String!): CatFact!
    deleteCatFact(id: ID!): CatFactId!
  }
`

const resolvers = {
    Query: {
        catFacts: async () => {
            const catFacts = await fetch(`${process.env.MOCK_API_URL}/cat-fact`)
            return (await catFacts.json()).map((catFact: { _id: string }) => ({
                ...catFact,
                id: catFact._id,
            }))
        },
    },
    Mutation: {
        createCatFact: async (
            _: unknown,
            { title, description }: { title: string; description: string }
        ) => {
            const catFact = await fetch(
                `${process.env.MOCK_API_URL}/cat-fact`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        completed: false,
                    }),
                }
            )
            const jsonCatFact = await catFact.json()
            return {
                ...jsonCatFact,
                id: jsonCatFact._id,
            }
        },
        deleteCatFact: async (
            _: unknown,
            { id }: { id: string }
        ): Promise<{ id: string }> => {
            await fetch(`${process.env.MOCK_API_URL}/cat-fact/${id}`, {
                method: 'DELETE',
            })
            return { id }
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
