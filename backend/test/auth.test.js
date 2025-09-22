import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" }); // Ensure env vars are loaded

describe("Auth API", () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined in .env");
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await User.deleteMany({ email: /testuser/ });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `testuser${Date.now()}@example.com`,
        password: "password123",
        role: "captain",
        vesselName: "Voyager",
        vesselType: "cargo",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    const email = `testuser${Date.now()}@example.com`;
    const password = "password123";

    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email,
      password,
      role: "captain",
      vesselName: "Navigator",
      vesselType: "cargo",
    });

    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
