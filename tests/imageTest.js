const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
const server = require('../index')
const { MockUser } = require('./userTest')


describe("Image", () => {
    describe("endpoints", () => {
        it("Image list is empty for new users", async () => {
            const mockUser = new MockUser()
            mockUser.createUser()

            // Put into the database
            await mockUser.registerToDb()

            const token = await mockUser.getToken()

            // List all photos for user
            const photoResponse = await request(server)
            .get('/dashboard')
            .set("Authorization", token)

            expect(photoResponse.body.length == 0)

            // Delete from database
            await mockUser.deleteFromDb()
        })

        it('Uploads a photos', async () => {
            const mockUser = new MockUser()
            mockUser.createUser()

            // Put into the database
            await mockUser.registerToDb()

            // get token
            const token = await mockUser.getToken()

            // Upload Photo
            const onePhotoResponse = await request(server)
            .post('/dashboard')
            .set("Authorization", token)
            .field("name", "temp.jpg")
            .attach("file", `${__dirname}/mockPhotos/temp.jpg`);
            expect(onePhotoResponse.body.length === 1);

            const photoId = onePhotoResponse.body._id;

            // delete photo
            const deletePhotoResponse = await request(server)
                .delete("/")
                .set("Authorization", token)
                .send({ id: photoId });

            expect(deletePhotoResponse.body.length === 0);

            // wipe from db
            await mockUser.deleteFromDb();
        })
    })
})