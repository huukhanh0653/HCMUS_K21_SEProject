const UserService = require("./UserService");
const User = require("../models/User");
const admin = require("../config/firebaseAdmin");

jest.mock("../models/User");
jest.mock("../config/firebaseAdmin", () => ({
  auth: jest.fn().mockReturnThis(),
  listUsers: jest.fn(),
}));

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const mockUser = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        avatar: "avatar.png",
        isAdmin: false,
      };

      User.prototype.save = jest.fn().mockResolvedValue(mockUser);

      const result = await UserService.createUser(
        "testuser",
        "test@example.com",
        "password123",
        "user",
        "avatar.png"
      );

      expect(User.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe("getAllFirebaseUsers", () => {
    it("should return a list of Firebase users", async () => {
      const mockFirebaseUsers = {
        users: [
          {
            uid: "user1",
            email: "user1@example.com",
            displayName: "User One",
            photoURL: "photo1.png",
            providerData: [],
          },
          {
            uid: "user2",
            email: "user2@example.com",
            displayName: "User Two",
            photoURL: "photo2.png",
            providerData: [],
          },
        ],
      };

      admin.listUsers.mockResolvedValue(mockFirebaseUsers);

      const result = await UserService.getAllFirebaseUsers();

      expect(admin.listUsers).toHaveBeenCalled();
      expect(result).toEqual([
        {
          uid: "user1",
          email: "user1@example.com",
          displayName: "User One",
          photoURL: "photo1.png",
          providerData: [],
        },
        {
          uid: "user2",
          email: "user2@example.com",
          displayName: "User Two",
          photoURL: "photo2.png",
          providerData: [],
        },
      ]);
    });

    it("should throw an error if Firebase fails", async () => {
      admin.listUsers.mockRejectedValue(new Error("Firebase error"));

      await expect(UserService.getAllFirebaseUsers()).rejects.toThrow(
        "Firebase error"
      );
    });
  });

  describe("syncFirebaseUsers", () => {
    it("should synchronize Firebase users with MongoDB", async () => {
      const mockFirebaseUsers = [
        {
          email: "user1@example.com",
          displayName: "User One",
          photoURL: "photo1.png",
        },
        {
          email: "user2@example.com",
          displayName: "User Two",
          photoURL: "photo2.png",
        },
      ];

      const mockExistingUsers = [{ email: "user1@example.com" }];

      User.find.mockResolvedValue(mockExistingUsers);
      User.create = jest.fn().mockResolvedValue();

      jest
        .spyOn(UserService, "getAllFirebaseUsers")
        .mockResolvedValue(mockFirebaseUsers);

      const result = await UserService.syncFirebaseUsers();

      expect(UserService.getAllFirebaseUsers).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalledWith({
        email: { $in: ["user1@example.com", "user2@example.com"] },
      });
      expect(User.create).toHaveBeenCalledWith({
        username: "User Two",
        email: "user2@example.com",
        password: null,
        avatar: "photo2.png",
        isAdmin: false,
      });
      expect(result).toEqual({
        message: "Firebase users synchronized with MongoDB",
      });
    });
  });

  //   describe("getUserById", () => {
  //     it("should return a user by ID", async () => {
  //       const mockUser = {
  //         _id: "user1",
  //         username: "testuser",
  //         email: "test@example.com",
  //       };

  //       User.findById.mockResolvedValue(mockUser);

  //       const result = await UserService.getUserById("user1");

  //       expect(User.findById).toHaveBeenCalledWith("user1");
  //       expect(result).toEqual(mockUser);
  //     });
  //   });

  //   describe("updateUser", () => {
  //     it("should update a user successfully", async () => {
  //       const mockUpdatedUser = {
  //         _id: "user1",
  //         username: "updateduser",
  //         email: "updated@example.com",
  //       };

  //       User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

  //       const result = await UserService.updateUser("user1", {
  //         username: "updateduser",
  //       });

  //       expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
  //         "user1",
  //         { username: "updateduser" },
  //         { new: true }
  //       );
  //       expect(result).toEqual(mockUpdatedUser);
  //     });
  //   });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const mockDeletedUser = {
        _id: "user1",
        username: "testuser",
        email: "test@example.com",
      };

      User.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

      const result = await UserService.deleteUser("user1");

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("user1");
      expect(result).toEqual(mockDeletedUser);
    });
  });
});
