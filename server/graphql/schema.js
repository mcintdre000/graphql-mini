let characters = require('./model')
const axios = require('axios')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID
} = require('graphql')

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        return {
            episode_id: { type: GraphQLInt },
            title: { type: GraphQLString },
            releaseDate: { 
                type: GraphQLString,
                resolve: person => {
                    return person.release_date
                }
            }
        }
    }
})

// const MovieType2 = new GraphQLObjectType({
//     name: 'Movie Planet',
//     fields: () => {
//         return {
//             name: { type: GraphQLString },
//             resolve: person => {
//                 return person.films.episode_id
//             }
//             }
//         }
//     })

const HomeWorldType = new GraphQLObjectType({
    name: 'HomeWorld',
    fields: () => {
      return {
        name: { type: GraphQLString },
        climate: { type: GraphQLString },
        population: { type: GraphQLString }
      }
    }
  })


const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => {
        return {
            id: { type: GraphQLInt },
            name: { type: GraphQLString },
            height: { type: GraphQLInt },
            films: {
                type: new GraphQLList(MovieType),
                resolve: (person) => {
                    return person.films.map(film => {
                        return axios.get(film).then(res => res.data)
                    })
                }

            },
            homeWorld: {
              type: HomeWorldType,
              resolve: (person) => {
                return axios.get(person.homeworld).then(res => res.data)
              }
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
        return{
            // define the keyword queries
            people: {
                type: new GraphQLList(PersonType),
                resolve: () => characters
            },
            person: {
                type: PersonType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) }
                },
                resolve: (root, args) => {
                    // console.log( '-----args', args)
                    // console.log( '-----root', root)
                    return characters.find(character => character.id === args.id)
                }
                // films: {
                //     MovieType,
                //     args: {
                //         id: {type: GraphQLNonNull(GraphQLInt)}
                //     },
                //     resolve: (root, args) => {
                //         console.log( '-----args', args)
                //         console.log( '-----root', root)
                //     }
                // }
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
      return {
        deletePerson: {
          type: PersonType,
          args: { id: { type: GraphQLNonNull(GraphQLInt) } },
          resolve: (parentVal, args) => {
            let character = characters.find(e => e.id === args.id)
            characters = characters.filter(person => person.id !== args.id)
            return {
              id: character.id,
              name: character.name
            }
          }
        }
      }
    }
  })
  
  module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
  })

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})