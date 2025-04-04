const FriendshipService = require("./FriendshipService");
const Friendship = require("../models/Friendship");
const FriendRequest = require("../models/FriendRequest");

jest.mock("../models/Friendship");
jest.mock("../models/FriendRequest");

describe("FriendshipService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addFriend", () => {
    it("should add a friend successfully", async () => {
      const userID = "user1";
      const friendID = "user2";

      Friendship.findOne.mockResolvedValue(null); // No existing friendship
      Friendship.prototype.save = jest
        .fn()
        .mockResolvedValue({ userID, friendID });

      const result = await FriendshipService.addFriend(userID, friendID);

      expect(Friendship.findOne).toHaveBeenCalledWith({
        $or: [
          { userID, friendID },
          { userID: friendID, friendID: userID },
        ],
      });
      expect(Friendship.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({ userID, friendID });
    });

    it("should throw an error if friendship already exists", async () => {
      const userID = "user1";
      const friendID = "user2";

      Friendship.findOne.mockResolvedValue({ userID, friendID }); // Existing friendship

      await expect(
        FriendshipService.addFriend(userID, friendID)
      ).rejects.toThrow("Friendship already exists");
    });
  });

  describe("sendFriendRequest", () => {
    it("should send a friend request successfully", async () => {
      const userID = "user1";
      const friendID = "user2";

      FriendRequest.findOne.mockResolvedValue(null); // No existing request
      FriendRequest.prototype.save = jest
        .fn()
        .mockResolvedValue({ sender: userID, receiver: friendID });

      const result = await FriendshipService.sendFriendRequest(
        userID,
        friendID
      );

      expect(FriendRequest.findOne).toHaveBeenCalledWith({
        $or: [
          { sender: userID, receiver: friendID },
          { sender: friendID, receiver: userID },
        ],
      });
      expect(FriendRequest.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({ sender: userID, receiver: friendID });
    });

    it("should throw an error if friend request already exists", async () => {
      const userID = "user1";
      const friendID = "user2";

      FriendRequest.findOne.mockResolvedValue({
        sender: userID,
        receiver: friendID,
      }); // Existing request

      await expect(
        FriendshipService.sendFriendRequest(userID, friendID)
      ).rejects.toThrow("Friend request already exists");
    });
  });

//   describe("getFriends", () => {
//     it("should return a list of friends", async () => {
//       const userID = "user1";
//       const friendships = [
//         {
//           userID: { _id: "user1" },
//           friendID: { _id: "user2", username: "Friend2" },
//         },
//         {
//           userID: { _id: "user3", username: "Friend3" },
//           friendID: { _id: "user1" },
//         },
//       ];

//       Friendship.find.mockResolvedValue(friendships);

//       const result = await FriendshipService.getFriends(userID);

//       expect(Friendship.find).toHaveBeenCalledWith({
//         $or: [{ userID }, { friendID: userID }],
//       });
//       expect(result).toEqual([
//         { _id: "user2", username: "Friend2" },
//         { _id: "user3", username: "Friend3" },
//       ]);
//     });

//     it("should throw an error if userID is not provided", async () => {
//       await expect(FriendshipService.getFriends()).rejects.toThrow(
//         "userID is required"
//       );
//     });
//   });

  describe("removeFriend", () => {
    it("should remove a friend successfully", async () => {
      const userID = "user1";
      const friendID = "user2";

      Friendship.deleteMany.mockResolvedValue({ deletedCount: 1 });

      await FriendshipService.removeFriend(userID, friendID);

      expect(Friendship.deleteMany).toHaveBeenCalledWith({
        $or: [
          { userID, friendID },
          { userID: friendID, friendID: userID },
        ],
      });
    });

    it("should throw an error if no friendship is found to remove", async () => {
      const userID = "user1";
      const friendID = "user2";

      Friendship.deleteMany.mockResolvedValue({ deletedCount: 0 });

      await expect(
        FriendshipService.removeFriend(userID, friendID)
      ).rejects.toThrow("No friendship found to remove");
    });
  });

  describe("acceptFriendRequest", () => {
    it("should accept a friend request successfully", async () => {
      const requestID = "request1";
      const request = { _id: requestID, sender: "user1", receiver: "user2" };

      FriendRequest.findById.mockResolvedValue(request);
      FriendshipService.addFriend = jest.fn().mockResolvedValue();
      FriendRequest.deleteOne.mockResolvedValue();

      await FriendshipService.acceptFriendRequest(requestID);

      expect(FriendRequest.findById).toHaveBeenCalledWith(requestID);
      expect(FriendshipService.addFriend).toHaveBeenCalledWith(
        "user1",
        "user2"
      );
      expect(FriendRequest.deleteOne).toHaveBeenCalledWith({ _id: requestID });
    });

    it("should throw an error if friend request is not found", async () => {
      const requestID = "request1";

      FriendRequest.findById.mockResolvedValue(null);

      await expect(
        FriendshipService.acceptFriendRequest(requestID)
      ).rejects.toThrow("Friend request not found");
    });
  });
});
