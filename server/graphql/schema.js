const characters = require('./model')
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
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query
})