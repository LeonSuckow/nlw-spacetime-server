import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "path";
import { authRoutes } from "./modules/auth/auth.routes";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(fastifyJwt, {
  secret: "spacetime",
});

app.register(uploadRoutes);
app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });
