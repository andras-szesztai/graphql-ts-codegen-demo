import { gql } from '@apollo/client'

export const READ_ALL_CAT_FACTS = gql`
    query readAllCatFacts {
        catFacts {
            id
            title
            description
        }
    }
`

export const CREATE_CAT_FACT = gql`
    mutation createCatFact($title: String!, $description: String!) {
        createCatFact(title: $title, description: $description) {
            id
            title
            description
        }
    }
`

export const DELETE_CAT_FACT = gql`
    mutation deleteCatFact($id: ID!) {
        deleteCatFact(id: $id) {
            id
        }
    }
`
