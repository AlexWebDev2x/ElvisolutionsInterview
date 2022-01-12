const dotenv = require('dotenv');
dotenv.config();

const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../../models/users');
const UserController = require('../../controllers/users');

describe('User Controller', function()
    {
        it('should get all users', async function()
            {
                const users = [
                    { id: 1, name: 'John', surname: 'Doe', birth_date: new Date('1973-05-16'), email: 'a@b.c', password: undefined, phone: '+11234567', identity: 'male', 
                    passport_number: 'AAA 123', createdAt: new Date('2022-01-08 23:25:52'), updatedAt: new Date('2022-01-11 16:06:40') },
                    { id: 2, name : "Christie", surname: "Doe", birth_date: new Date("1982-11-28T09"), email: "b@b.com", password: undefined, phone: "+79871234567", identity: "female", 
                    passport_number: "4321-098765", createdAt: new Date('2022-01-08 23:30:44'), updatedAt: new Date('2022-01-11 21:57:58') },
                ];

                const stub = sinon.stub(User, 'findAll').returns( users.map( u => ({ dataValues: u })) );

                const res = {
                    status(code) { this.code = code; return res; },
                    json(obj) { this.response = obj; return res;},
                };

                await UserController.getUsers( {}, res, () => {});
                            
                expect(stub.calledOnce).to.be.true;
                expect(res.code).to.equal(200);
                expect(res.response.status).to.equal('success');
                expect(res.response.data).to.deep.equal( users );

                stub.restore();
            });

        it('should create new user and remove invalid field "isAdmin"', async function()
            {
                // Reference value for new user
                const user = { name: 'Nick', surname: 'Doe', birth_date: new Date('2021-01-05'), email: 'c@b.c', password: '', phone: '+79871234567', identity: 'male', 
                               passport_number: 'ABCD 1234', createdAt: new Date('2022-01-09 01:09:10'), updatedAt: new Date('2022-01-11 21:55:26') };

                const stub = sinon.stub(User, 'create').returns({ dataValues: { id: 3, ...user } });

                const req = {
                    body: { ...user, isAdmin: true }    // reference value mixed with inappropriate field
                };

                const res = {
                    status(code) { this.code = code; return this; },
                    json(obj) { this.response = obj; return this; },
                };

                await UserController.createUser( req, res, () => {});
                            
                expect(stub.calledOnce).to.be.true;
                expect(res.code).to.equal(201);
                expect(res.response.status).to.equal('success');
                expect(res.response.data).not.to.have.property('isAdmin');
                expect(res.response.data).to.deep.equal( { id: 3, ...user, password: undefined } );
                
                stub.restore();
            });

        it('should update existing user and remove invalid field "isAdmin"', async function()
            {
                // Reference changes
                const changes = { passport_number: 'EFGH 5678' };

                // Value in DB
                const user = { id: 3, name: 'Nick', surname: 'Doe', birth_date: new Date('2021-01-05'), email: 'c@b.c', password: undefined, phone: '+79871234567', identity: 'male', 
                               passport_number: 'ABCD 1234', createdAt: new Date('2022-01-09 01:09:10'), updatedAt: new Date('2022-01-11 21:55:26') }

                const stub = sinon.stub(User, 'update').returns([ undefined, { dataValues: { ...user, ...changes } } ]);

                const req = {
                    params: { id: 3 },                  // make changes fot user with id 3
                    body: { ...changes, isAdmin: true } // Reference changes mixed with inappropriate field
                };

                const res = {
                    status(code) { this.code = code; return this; },
                    json(obj) { this.response = obj; return this; },
                };

                await UserController.updateUser( req, res, () => {});
                            
                expect(stub.calledOnce).to.be.true;
                expect(res.code).to.equal(200);
                expect(res.response.status).to.equal('success');
                expect(res.response.data).not.to.have.property('isAdmin');
                expect(res.response.data).to.deep.equal( { ...user, ...changes } );
                
                stub.restore();
            });
    });