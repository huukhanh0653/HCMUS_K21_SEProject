const request = require("supertest");
const express = require("express");
const router = require("./friendshipRoutes");
const FriendshipService = require("../services/FriendshipService");

jest.mock("../services/FriendshipService"); // Mock FriendshipService

const app = express();
app.use(express.json());
app.use("/api/friendships", router);

describe("Friendship Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/friendships/add", () => {
    it("should add a friend and return 201", async () => {
      const mockFriendship = { userID: "user1", friendID: "user2" };
      FriendshipService.addFriend.mockResolvedValue(mockFriendship);

      const response = await request(app)
        .post("/api/friendships/add")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockFriendship);
      expect(FriendshipService.addFriend).toHaveBeenCalledWith(
        "user1",
        "user2"
      );
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.addFriend.mockRejectedValue(new Error("Service error"));

      const response = await request(app)
        .post("/api/friendships/add")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });

  describe("GET /api/friendships/:userID", () => {
    it("should return a list of friends", async () => {
      const mockFriends = [{ userID: "user1", friendID: "user2" }];
      FriendshipService.getFriends.mockResolvedValue(mockFriends);

      const response = await request(app).get("/api/friendships/user1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFriends);
      expect(FriendshipService.getFriends).toHaveBeenCalledWith("user1");
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.getFriends.mockRejectedValue(
        new Error("Service error")
      );

      const response = await request(app).get("/api/friendships/user1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });

  describe("DELETE /api/friendships/remove", () => {
    it("should remove a friend and return 200", async () => {
      FriendshipService.removeFriend.mockResolvedValue();

      const response = await request(app)
        .delete("/api/friendships/remove")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Friend removed successfully" });
      expect(FriendshipService.removeFriend).toHaveBeenCalledWith(
        "user1",
        "user2"
      );
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.removeFriend.mockRejectedValue(
        new Error("Service error")
      );

      const response = await request(app)
        .delete("/api/friendships/remove")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });

  describe("POST /api/friendships/request", () => {
    it("should send a friend request and return 201", async () => {
      const mockRequest = { userID: "user1", friendID: "user2" };
      FriendshipService.sendFriendRequest.mockResolvedValue(mockRequest);

      const response = await request(app)
        .post("/api/friendships/request")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockRequest);
      expect(FriendshipService.sendFriendRequest).toHaveBeenCalledWith(
        "user1",
        "user2"
      );
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.sendFriendRequest.mockRejectedValue(
        new Error("Service error")
      );

      const response = await request(app)
        .post("/api/friendships/request")
        .send({ userID: "user1", friendID: "user2" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });

  describe("POST /api/friendships/request/accept", () => {
    it("should accept a friend request and return 200", async () => {
      FriendshipService.acceptFriendRequest.mockResolvedValue();

      const response = await request(app)
        .post("/api/friendships/request/accept")
        .send({ requestID: "request1" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Friend request accepted successfully",
      });
      expect(FriendshipService.acceptFriendRequest).toHaveBeenCalledWith(
        "request1"
      );
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.acceptFriendRequest.mockRejectedValue(
        new Error("Service error")
      );

      const response = await request(app)
        .post("/api/friendships/request/accept")
        .send({ requestID: "request1" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });

  describe("POST /api/friendships/request/decline", () => {
    it("should decline a friend request and return 200", async () => {
      FriendshipService.declineFriendRequest.mockResolvedValue();

      const response = await request(app)
        .post("/api/friendships/request/decline")
        .send({ requestID: "request1" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Friend request declined successfully",
      });
      expect(FriendshipService.declineFriendRequest).toHaveBeenCalledWith(
        "request1"
      );
    });

    it("should return 500 if service throws an error", async () => {
      FriendshipService.declineFriendRequest.mockRejectedValue(
        new Error("Service error")
      );

      const response = await request(app)
        .post("/api/friendships/request/decline")
        .send({ requestID: "request1" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Service error" });
    });
  });
});
