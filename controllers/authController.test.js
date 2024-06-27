import { loginUser, registerUser } from './authController'
import User from "../models/users.js";
import bcrypt from "bcryptjs";

jest.mock("../utils/helpers", () => ({
    getJwtToken: jest.fn().mockResolvedValue('jwt_token')
}));


afterEach(() => {
    jest.restoreAllMocks() 
}) 


const mockRequest = () => {
    return {
        body: {
            name: 'Test User',
            email: 'cityjmo@gmail.com',
            password: '&chrstismy1&onlylfe'
        }
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    }
}

const mockUser = {
    _id: "5588278df77df777752df2s",
    name: 'Test User',
    email: 'cityjmo@gmail.com',
    password: '&chrstismy1&hashedpassword'
}

describe("Register User", () => {
    it("should register user", async () => {
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce('hashedpassword')
        jest.spyOn(User, "create").mockResolvedValueOnce(mockUser)
        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes)

        expect(bcrypt.hash).toHaveBeenCalledWith('&chrstismy1&onlylfe', 10)
        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.json).toHaveBeenCalledWith({ token: "jwt_token" })
    })

    it('should throw validation error ', async () => {
        const mockReq = mockRequest().body = { body: {} }
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values",
        })
    });
})

describe('Login User', () => {
    it('should throw missing email or password error ', async () => {

        const mockReq = mockRequest().body = { body: {} }
        const mockRes = mockResponse()
        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter email & Password",
        })
    });
    it('should throw Invalid Email or Password error on not existing Email ', async () => {
        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(null) })
        jest.spyOn(bcrypt, "compare").mockReturnValue({ select: jest.fn().mockReturnValue(null) })

        const mockReq = mockRequest()
        const mockRes = mockResponse()
        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password",
        })
    });
    it('should throw Invalid Email or Password error on Invalid Password', async () => {
        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) })

        const mockReq = mockRequest()
        const mockRes = mockResponse()
        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password",
        })
    }); 
    it('should Log User on valid Email and Password', async () => {
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true)
        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) })

        const mockReq = mockRequest()
        const mockRes = mockResponse()
        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            token: "jwt_token",
        })
    });
})