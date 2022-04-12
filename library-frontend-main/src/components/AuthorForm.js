import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BORN } from '../queries'

const AuthorForm = ({authors, setError}) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [changeBorn, result] = useMutation(EDIT_BORN)

    const submit = (event) => {
        event.preventDefault()

        changeBorn({ variables: { name, setBornTo: parseInt(born) } })

        setName('')
        setBorn('')
    }

    useEffect(() => {
        if(result.data && !result.data.editAuthor) {
            setError('author not found')
        }
    }, [result.data])

    return (
        <div>
            <h2>Set Birth Year</h2>
            <form onSubmit={submit}>
                <div>
                    <select onChange={({target}) => setName(target.value)}>
                        <option value="" >Select Author name</option>
                        {authors.map(a => (
                            <option value={a.name} key={a.name}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    born 
                    <input value={born}
                        type="number"
                        onChange={({target}) => setBorn(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default AuthorForm