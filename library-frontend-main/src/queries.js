import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            bookCount
            name
            born
            id
        }
    }
`

export const ALL_BOOKS = gql`
    query ($genre: String){
        allBooks ( genre: $genre ) {
            title
            author {
                name
                born
                id
                bookCount
            }
            genres
            published
            id
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook ($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`

export const EDIT_BORN = gql`
    mutation($name: String!, $setBornTo: Int!){
        editAuthor(name: $name, setBornTo: $setBornTo) {
            bookCount
            born
            id
            name
        }
    }
`

export const LOGIN = gql`
    mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
            id
        }
    }
`

export const PERSON_ADDED = gql`
    subscription {
        bookAdded {
            title
            author {
                name
                born
                id
                bookCount
            }
            genres
            published
            id
        }
    }
`