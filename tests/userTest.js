const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const server = require('../index')
const { userProfile } = require('../models/userModel')

class MockUser {
    createUser(){
        // Set current hash
        this.hash = Math.random() * 1000000

        // Sets current user
        this.user = new userProfile({
            firstName: "Tobechi",
            lastName: "Chukwuleta",
            images: [],
            email: "testmail@test.com",
            password: "Random Pass"
        })
    }

    loginUser() {
        return request(server)
        .post('/login')
        .send(this.user)
    }

    registerToDb() {
        return request(server)
        .post('/register')
        .send({
            firstName: "Tobechi",
            lastName: "Chukwuleta",
            images: [],
            email: "testmail@test.com",
            password: "Random Pass"
        })
    }

    async getToken() {
        const response = await this.loginUser()
        return response.body.token
    }

    deleteFromDb() {
        return userProfile.findByIdAndDelete(this.id)
    }
}

describe('MockUser', () => {
    describe("register and login", () => {
        it("Register user", async () => {
            let mockUser = new MockUser()
            mockUser.createUser()

            let foundUser = await userProfile.find({ email: mockUser.email })
            expect(foundUser.length == 0)

            // Insert into database
            const temp = await mockUser.registerToDb()

            // Should only store one in database
            foundUser = await userProfile.find({ email: mockUser.email })
            expect()

            // log in the user
            const response = await mockUser.loginUser()

            // Extract the jwt response 
            const { success, token } = response.body

            // Expect auth to be valid and jwt to be defined and > 0
            expect(success).to.be.true
            expect(token).length.to.be.gt(0)

            // Delete user
            mockUser.deleteFromDb()

            // Make sure it is deleted
            foundUser = await userProfile.find({ email: mockUser.email })
            expect(foundUser.length == 0)
        })
    })
});

module.exports = {
    MockUser
}