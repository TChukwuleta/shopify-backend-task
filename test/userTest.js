const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const server = require('../index')
const userProfile = require('../models/userModel')

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

    registerUser() {
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

    loginUser() {
        return request(server)
        .post('/login')
        .send({
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
            const temp = await mockUser.registerUser()

            // Should only store one in database
            foundUser = await userProfile.find({ email: mockUser.email })
            expect(foundUser.length == 1)

            // // log in the user
            const response = await mockUser.loginUser()
            // expect(response.length == 1)
            console.log(response.header['set-cookie'])
            // console.log(response.Cookies.jwt)

            // // Delete user
            mockUser.deleteFromDb()

            // // Make sure it is deleted
            removeUser = await userProfile.find({ email: mockUser.email })
            console.log(removeUser)
            expect(removeUser.length == 0)
        })
    })
});

module.exports = {
    MockUser
}