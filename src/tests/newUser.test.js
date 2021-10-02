const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index.js')
const User = require('../models/user.js')

chai.should()
chai.use(chaiHttp)

describe('Test for the creation of new users.', () => 
{
    it('It should create a new user.', (done) => 
    {
        const newUser = 
        {
            name : 'Test Test',
            username: 'test',
            email: 'test@test.com',
            password: 'testPassword',
            phone: 5555555
        }

        chai.request(app)
            .post('/users/register')
            .send(newUser)
            .end((err, response) => 
            {
                response.should.have.status(201)
                response.should.be.an('object')
                done()
            })
    })

    // it('It should return the user previously created.', async (done) => 
    // {
        
    // })
    
    after(async () => 
    {
        await User.deleteOne({email: "test@test.com"})
    })
})