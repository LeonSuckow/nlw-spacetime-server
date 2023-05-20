import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: "asc" },
    });
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    });

    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "a954061e-fd76-4e30-8657-2c968d5e8135",
      },
    });

    return memory;
  });

  app.put("/memories/:id", async (request) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    await prisma.memory.update({
      where: { id },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });
  });

  app.delete("/memories/:id", async (request) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramSchema.parse(request.params);

    await prisma.memory.delete({
      where: { id },
    });
  });
}
