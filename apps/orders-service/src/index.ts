import Fastify from "fastify";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import mongoose from "mongoose";
import { redisClient } from "@repo/redis-client";

const fastify = Fastify({
  logger: true,
});

fastify.register(clerkPlugin);

fastify.get("/api/v1/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
fastify.get("/api/v1/orders/:id", { preHandler: shouldBeUser }, async (request, reply) => {
  const { id } = request.params as { id: string };
  
  try {
    // Try to get from cache first
    const cachedOrder = await redisClient.get(`order:${id}`);
    if (cachedOrder) {
      return reply.status(200).send(JSON.parse(cachedOrder));
    }
    
    // If not in cache, fetch from database
    // const order = await Order.findById(id);
    const order = { id, status: 'pending', total: 99.99 }; // Mock data
    
    // Cache the result for 5 minutes
    await redisClient.set(`order:${id}`, JSON.stringify(order), 300);
    
    return reply.status(200).send(order);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to fetch order' });
  }
});

const start = async () => {
  try {
    // Connect to MongoDB directly
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in env file!");
    }
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    
    await fastify.listen({ port: 8001 });
    console.log("Orders service is running on port 8001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
