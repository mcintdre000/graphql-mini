import React from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { GET_PEOPLE } from '../queries/PeopleQuery'

export const DELETE_PERSON = gql`
    mutation deletePerson($id: Int!) {
      deletePerson(id:$id) {
        id
        name
      }
    }
`

const DeletePerson = props => {
  return (
    <Mutation mutation={DELETE_PERSON} update={(cache, { data: {deletePerson}}) => {
        let { people } = cache.readQuery({ query: GET_PEOPLE })
        const updatedPeople = people.filter(e => e.id !== deletePerson.id)
        cache.writeQuery({
            query: GET_PEOPLE,
            data: { people: updatedPeople}
        })
    }}
    >

      { (deletePerson, { loading, error }) => {
        return (
          <div>
            { props.children(loading, error, deletePerson) }
          </div>
        )
      } }

    </Mutation>
  )
}

export default DeletePerson