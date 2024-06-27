import jwt from "jsonwebtoken";
import { isAuthenticatedUser } from "./auth";
import User from '../models/users'

afterEach(() => {
  jest.restoreAllMocks()
})

const mockRequest = () => ({
  headers: {}
})

const mockRes = () => ({
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
})

const mockUser = {
  _id: "5588278df77df777752df2s",
  name: 'Test User',
  email: 'cityjmo@gmail.com',
  password: '&chrstismy1&hashedpassword'
}

const next = jest.fn()

describe('Auth Middleware', () => {
  it('should throw missing Authorization Header error', async () => {
    const req = mockRequest()
    const res = mockRes()

    await isAuthenticatedUser(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing Authorization header with Bearer token"
    })

  });

  it('should only accepts Bearer token Authorization', async () => {
    const req = mockRequest().headers = {
      headers: {
        authorization: "Not_Bearer mytoken"
      }
    }
    const res = mockRes()

    await isAuthenticatedUser(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing Authorization header with Bearer token"
    })

  });

  it('should throw missing JWT error', async () => {
    const req = mockRequest().headers = {
      headers: {
        authorization: "Bearer"
      }
    }
    const res = mockRes()

    await isAuthenticatedUser(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication Failed"
    })

  });
  it('should authenticate user', async () => {
    jest.spyOn(jwt,"verify").mockResolvedValueOnce({id:mockUser._id})
    jest.spyOn(User,"findById").mockResolvedValueOnce(mockUser)
    const req = mockRequest().headers = {
      headers: {
        authorization: "Bearer mytoken"
      }
    }
    const res = mockRes()

    await isAuthenticatedUser(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)

  });
})