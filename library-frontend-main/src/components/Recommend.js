import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = ({show}) => {
    const result = useQuery(ME)
    const result1 = useQuery(ALL_BOOKS)

    if(!show) {
        return null
    }

    const books = result1.data.allBooks
    const favoriteGenre = result.data.me.favoriteGenre

    const recommendBooks = books.filter(b => b.genres.includes(favoriteGenre))
    
    return (
        <div>
            <h2>recommendations</h2>
            books in your favorite genre <b>patterns</b>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>

                    {recommendBooks.map(b => (
                        <tr key={b.id}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
        </div>
    )
}

export default Recommend