
import Jobs from "../models/jobs"
import { getJobs, newJob, getJob, updateJob, deleteJob } from "./jobsController"
const mockJob = {
    _id: "5353af343f34343",
    title: "JAVASCRIPT Developer",
    description: "A JavaScript (JS) developer is a software engineer who specializes in the JavaScript programming language. JavaScript is a versatile language used primarily for web development, enabling interactive and dynamic content on websites. Here’s a breakdown of what a JS developer does",
    email: 'johnDoe@gmail.com',
    address: 'here , there , everywhere',
    company: 'world',
    industry: [],
    position: 2,
    salary: 15000,
    user: "5588278df77df777752df2s",
    postingDate: "2024-11-08T22:31:52.441Z",
    __v: 0
}

const mockReq = () => ({
    query: {},
    body: {},
    params: {
        id: ''
    }
})

const mockRes = () => ({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Jobs Controller', () => {
    describe('Get All Jobs', () => {
        it('should return all the Job ', async () => {
            jest.spyOn(Jobs, "find").mockReturnValueOnce({
                limit: () => ({ skip: jest.fn().mockReturnValue([mockJob]) })
            })

            const req = mockReq()
            const res = mockRes()

            await getJobs(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                jobs: [mockJob]
            })

        });

    })

    describe('Create Job', () => {
        it('should create a new mockJob', async () => {
            jest.spyOn(Jobs, "create").mockResolvedValueOnce(mockJob)

            const req = mockReq().body = {
                body: {
                    title: "JAVASCRIPT Developer",
                    description: "A JavaScript (JS) developer is a software engineer who specializes in the JavaScript programming language. JavaScript is a versatile language used primarily for web development, enabling interactive and dynamic content on websites. Here’s a breakdown of what a JS developer does",
                    email: 'johnDoe@gmail.com',
                    address: 'here , there , everywhere',
                    company: 'world',
                    position: 2,
                    salary: 15000,
                    user: "5588278df77df777752df2s",
                },
                user: {
                    id: "5588278df77df777752df2s"
                }
            }
            const res = mockRes()

            await newJob(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ job: mockJob })
        });
        it('should throw validation error', async () => {
            jest.spyOn(Jobs, "create").mockRejectedValueOnce({ name: 'ValidationError' })

            const req = mockReq().body = {
                body: {
                    title: "JAVASCRIPT Developer",
                },
                user: {
                    id: "5588278df77df777752df2s"
                }
            }
            const res = mockRes()

            await newJob(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: "Please enter all values",
            })
        });
    })

    describe('Find Job by id', () => {
        it('should return the Job corresponding to the given id', async () => {
            jest.spyOn(Jobs, "findById").mockReturnValueOnce(mockJob)

            const req = mockReq()
            req.params = { id: mockJob._id }
            const res = mockRes()

            await getJob(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ job: mockJob })

        });
        it('should throw Job not found error', async () => {
            jest.spyOn(Jobs, "findById").mockResolvedValueOnce(null)

            const req = mockReq()
            req.params = { id: mockJob._id }
            const res = mockRes()

            await getJob(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Job not found" })

        });
        it('should throw invalid ID error', async () => {
            jest.spyOn(Jobs, "findById").mockRejectedValueOnce({ name: "CastError" })

            const req = mockReq()
            req.params = { id: mockJob._id }
            const res = mockRes()

            await getJob(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ error: "Please enter correct id" })

        });
    })

    describe('Update Job', () => {
        it('should throw Job not found error', async () => {
            jest.spyOn(Jobs, "findById").mockResolvedValueOnce(null)

            const req = mockReq()
            req.params = { id: mockJob._id }
            const res = mockRes()

            await updateJob(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Job not found" })

        });
        it('should throw unauthorized to update this Job', async () => {

            const req = mockReq().body = {
                body: {
                    title: "JAVASCRIPT Developer",
                    email: 'johnDoe@gmail.com',
                    address: 'here , there , everywhere',
                    company: 'world game',
                    position: 3,
                    salary: 15000,
                    user: "5588278df77df777752df2s",
                },
                user: {
                    id: "200000"
                },
                params: { id: mockJob._id }
            }
            const res = mockRes()
            jest.spyOn(Jobs, "findById").mockReturnValueOnce(mockJob)
            jest.spyOn(Jobs, "findByIdAndUpdate").mockResolvedValueOnce({ ...mockJob, ...req.body })
            await updateJob(req, res)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({ error: "You are not allowed to update this job" })

        });
        it('should update Job by id', async () => {

            const req = mockReq().body = {
                body: {
                    title: "JAVASCRIPT Developer",
                    email: 'johnDoe@gmail.com',
                    address: 'here , there , everywhere',
                    company: 'world game',
                    position: 3,
                    salary: 15000,
                    user: "5588278df77df777752df2s",
                },
                user: {
                    id: "5588278df77df777752df2s"
                },
                params: { id: mockJob._id }
            }
            const res = mockRes()
            jest.spyOn(Jobs, "findById").mockReturnValueOnce(mockJob)
            jest.spyOn(Jobs, "findByIdAndUpdate").mockResolvedValueOnce({ ...mockJob, ...req.body })
            await updateJob(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ job: { ...mockJob, ...req.body } })

        });
    })

    describe('Delete Job', () => {
        it('should throw Job not found error', async () => {
            jest.spyOn(Jobs, "findById").mockResolvedValueOnce(null)

            const req = mockReq()
            req.params = { id: mockJob._id }
            const res = mockRes()

            await deleteJob(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Job not found" })

        });
        it('should delete Job by id', async () => {

            const req = mockReq().body = {
                params: { id: mockJob._id }
            }
            const res = mockRes()
            jest.spyOn(Jobs, "findById").mockReturnValueOnce(mockJob)
            jest.spyOn(Jobs, "findOneAndDelete").mockResolvedValueOnce({ ...mockJob })
            await deleteJob(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ job: { ...mockJob } })

        });
    })
})