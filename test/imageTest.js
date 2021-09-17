const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
const fs = require('fs')
const server = require('../index')
const { MockUser } = require('./userTest')


describe("Image", () => {
    describe("endpoints", () => {
        it("Image list is empty for new users", async () => {
            const mockUser = new MockUser()
            mockUser.createUser()

            // Put into the database
            await mockUser.registerUser()

            const token = await mockUser.getToken()
            console.log('token', token)

            // List all photos for user
            const photoResponse = await request(server)
            .get('/dashboard')

            expect(photoResponse.body.length == 0)

            // Delete from database
            await mockUser.deleteFromDb()
        })

        it('Uploads a photos', async () => {
            const mockUser = new MockUser()
            mockUser.createUser()

            // Put into the database
            await mockUser.registerUser()

            // Upload Photo
            const onePhotoResponse = await request(server)
            .post('/dashboard')
            .set('content-type', 'multipart/form-data')
            .field("name", "background.png")
            .attach("file", fs.readFileSync(`${__dirname}/mockPhotos/background.png`));
            expect(onePhotoResponse.body.length === 1);

            // wipe from db
            await mockUser.deleteFromDb();
        })
    })
})