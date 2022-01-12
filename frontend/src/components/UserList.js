import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Users from './Users';
import User from './User';


function UserList(props)
{
    const [ selected, setSelected ] = useState("-1");

    useEffect( () =>
        {
            if (props.users.findIndex( u => u.id === selected) === -1)
                setSelected( '-1' );
        },
        [ props.users, selected ]);

    // console.log('UserList, selected:', selected, Number.parseInt(selected) > -1? props.users.find( u => u.id === selected) : undefined);

    return (
        <div>

            <Routes>

                <Route path="/" exact element={ <Users  users={ props.users } 
                                                        selected={ selected }
                                                        onSelectionChanged={ /* (n) => { console.log('onSelectionChanged:', n); */ setSelected/* (n); } */ } 
                                                        onDelete={ props.onDelete } /> } />

                <Route exact path="/modify" element={ <User onCreate={ props.onCreate } onModify={ props.onModify } /> } />
                <Route path="/modify/:id" element={ <User user={ Number.parseInt(selected) > -1? props.users.find( u => u.id === selected) : undefined } 
                                                          onCreate={ props.onCreate } 
                                                          onModify={ props.onModify } /> } />

            </Routes>

        </div> );
}

UserList.propTypes = 
    {
        users: PropTypes.array.isRequired,
        onCreate: PropTypes.func.isRequired,
        onModify: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
    };

export default UserList;
