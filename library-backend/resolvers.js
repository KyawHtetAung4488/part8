const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
          let filter = {}
          if(args.genre) {
            filter = {
              genres: args.genre
            }
          }
          return Book.find(filter).populate('author')
        },
        allAuthors: async () => Author.find({}),
        me: async (root, args, {currentUser}) => {
          if(!currentUser) {
            throw new AuthenticationError('not authenticate')
          }

          return currentUser
        }
    },
    Author: {
        bookCount: async (root) => (await Book.find({ author: root._id })).length
    },
    Mutation: {
      addBook: async (root, args, {currentUser}) => {
        if(!currentUser) {
          throw new AuthenticationError('not authenticate')
        }
        
        const author = await Author.findOne({ name: args.author })
        const book = new Book({...args})

        if(!author) {
          const newAuthor = new Author({
            name: args.author
          })

          try {
            const savedAuthor = await newAuthor.save()
            book.author = savedAuthor           
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
        } else {
          book.author = author
        }
        
        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book
      },
      editAuthor: async (root, args, {currentUser}) => {
        if(!currentUser) {
          throw new AuthenticationError('not authenticate')
        }

        const author = await Author.findOne({ name: args.name })
        if(!author) {
          throw new UserInputError('author not found')
        }

        author.born = args.setBornTo
        await author.save()

        return author
      },
      createUser: async (root, args) => {
        const user = new User({...args})

        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })

        if(!user || args.password !== 'password') {
          throw new UserInputError('wrong credential')
        }

        const userForToken = {
          username: user.username,
          id: user._id
        }

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

module.exports = resolvers