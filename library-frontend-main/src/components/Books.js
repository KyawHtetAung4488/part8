import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: filter ? { genre: filter } : null
  })
  

  if (!props.show) {
    return null
  }
  
  if(result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  // const filteredBooks = filter ? books.filter(b => b.genres.includes(filter)) : books
  
  let genres = []
  books.forEach(b => {
    b.genres.forEach(g => {
      if(genres.indexOf(g) === -1) {
        genres.push(g)
      }
    })
  })

  // console.log(Array.from(new Set(genres)));

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setFilter(null)} >All books</button>
        { genres.map(genre => {
          return <button onClick={() => setFilter(genre)} key={genre} >{ genre }</button>
        }) }
      </div>
    </div>
  )
}

export default Books
