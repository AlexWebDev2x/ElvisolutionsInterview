import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import serverURI from './shared/serverURI';
import Layout from './containers/layout';
import UserList from './components/UserList';

function App()
{
    const [ users, setUsers ] = useState( [] );

    useEffect( () =>
        {
            // console.log(serverURI);

            axios.get(serverURI, { "Content-Type": "application/json" })
                 .then( answer =>
                    {
                        if (answer.data.status === 'success')
                            setUsers( Array.from(answer.data.data).map( u => ({ ...u, birth_date: new Date(u.birth_date) })) );
                        else
                            console.log('Get All users: incorrect answer:', answer);
                    })
                 .catch( err => 
                    console.log('Get All users exception:', err));
        },
        [] );

    const handleCreate = newUser =>
        {
            axios.post(serverURI, { ...newUser }, { "Content-Type": "application/json" })
                 .then( answer =>
                    {
                        if (answer.data.status === 'success')
                        {
                            const newUser = { ...answer.data.data, birth_date: new Date(answer.data.data.birth_date) };
                            setUsers( [ ...users, newUser ] );
                        }
                        else
                            console.log(`Create new user: incorrect answer:`, answer);
                    })
                 .catch( err => 
                    console.log(`Create new user exception:`, err));
        };
        
    const handleModify = (id, user) =>
        {
            if (id === '-1' || !user)
                return;

            axios.patch(serverURI + `/${ id }`, { ...user }, { "Content-Type": "application/json" })
                 .then( answer =>
                    {
                        if (answer.data.status === 'success')
                        {
                            const newUsers = users.map( u => u.id === id ? { ...answer.data.data, birth_date: new Date(answer.data.data.birth_date) } : u );
                            setUsers( newUsers );
                        }
                        else
                            console.log(`Patch a user with ID ${ id }: incorrect answer:`, answer);
                    })
                 .catch( err => 
                    console.log(`Patch a user with ID ${ id } exception:`, err));
        };

    const handleDelete = id =>
        {
            if (id === '-1')
                return;

            axios.delete(serverURI + `/${ id }`)
                 .then( answer =>
                    {
                        if (answer.status === 204)
                        {
                            const newUsers = users.filter( u => u.id !== id );
                            setUsers( newUsers );
                        }
                        else
                            console.log(`Delete a user with ID ${ id }: incorrect answer:`, answer);
                    })
                 .catch( err => 
                    console.log(`Delete a user with ID ${ id } exception:`, err));
        };

    return (
            <Layout>
                
                <Routes>

                    <Route path="/" exact element={ <Navigate to="/users" /> } />

                    <Route path="/users/*" exact element={ <UserList users={ users } onCreate={ handleCreate } onModify={ handleModify } onDelete={ handleDelete } /> } />

                    <Route path="*" element={   <h1 style={{ textAlign: 'center', fontWeight: '400', color: 'FireBrick' }}>
                                                    <strong>*** Error 404 ***</strong> Oops! There is no such resource...
                                                </h1> } />  
                </Routes>

            </Layout> 
        );
}

export default App;
