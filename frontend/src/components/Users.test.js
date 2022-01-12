/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Users from './Users';

describe('UserList component', () =>
{
    test('should render a table with a user and "Create" button enabled but other buttons disabled', () => 
        {
            const users = [ 
                { id: 1, name: 'John', surname: 'Doe', 'birth_date': new Date('01-01-2000'), email: 'a@b.c', password: '', phone: '+11234567', identity: 'person', passport_number: 'AAA 123' }
            ];
            const selected = '-1';

            render( <BrowserRouter> <Users users={ users } selected={ selected } onSelectionChanged={ () => {} } onDelete={ () => {} } /> </BrowserRouter>);

            const johnDoe = screen.getByText(/John Doe/i);
            const createButton = screen.getByText(/Create/i).closest('button');
            const viewButton = screen.getByText(/View/i).closest('button');
            const editButton = screen.getByText(/Edit/i).closest('button');
            const deleteButton = screen.getByText(/Delete/i).closest('button');
           
            expect(johnDoe).toBeInTheDocument();

            expect(createButton).not.toHaveAttribute('disabled');
            expect(viewButton).toHaveAttribute('disabled');
            expect(editButton).toHaveAttribute('disabled');
            expect(deleteButton).toHaveAttribute('disabled');
        });
    
    test('should render a table with selected user and all buttons enabled', () => 
        {
            const users = [ 
                { id: 1, name: 'John', surname: 'Doe', 'birth_date': new Date('01-01-2000'), email: 'a@b.c', password: '', phone: '+11234567', identity: 'person', passport_number: 'AAA 123' }
            ];
            const selected = '1';

            render( <BrowserRouter> <Users users={ users } selected={ selected } onSelectionChanged={ () => {} } onDelete={ () => {} } /> </BrowserRouter>);
            
            const johnDoe = screen.getByText(/John Doe/i);
            const createButton = screen.getByText(/Create/i).closest('button');
            const viewButton = screen.getByText(/View/i).closest('button');
            const editButton = screen.getByText(/Edit/i).closest('button');
            const deleteButton = screen.getByText(/Delete/i).closest('button');
           
            expect(johnDoe).toBeInTheDocument();

            expect(createButton).not.toBeDisabled();
            expect(viewButton).not.toBeDisabled();
            expect(editButton).not.toBeDisabled();
            expect(deleteButton).not.toBeDisabled();
        });
})
