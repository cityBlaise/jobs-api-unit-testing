import User from "./users";

afterEach(() => {
  jest.restoreAllMocks()
})

describe('User Model', () => {
  it('should throw validation error for required fields', async () => {
    const user = new User({});
    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        name: {},
        password: {},
        email: {},
      }
    })
    const errorsKeys = ['name', 'password', 'email']
    try {
      await user.validate()
    } catch ({ errors }) {
      errorsKeys.forEach(value => expect(errors[value]).toBeDefined())
    }
  });
  it('should throw password length error', async () => {
    const user = new User({
      name: "john",
      email: "johnDoe@gmail.com",
      password: "1",
    });
    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        password: {
          message: "Your password must be at least 8 characters long"
        },
      }
    })
    try {
      await user.validate()
    } catch ({ errors }) {
      expect(errors['password']).toBeDefined()
      expect(errors['password'].message).toBe("Your password must be at least 8 characters long")
    }
  });

  it('should create a new User', async () => {
    const user = new User({
      name: "john",
      email: "johnDoe@gmail.com",
      password: "password",
    })
    expect(user).toHaveProperty("_id")
  });
});