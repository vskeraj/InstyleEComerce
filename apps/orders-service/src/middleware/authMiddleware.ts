import { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export const shouldBeUser = async(req: FastifyRequest, reply: FastifyReply) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }

  req.userId = userId;
};
