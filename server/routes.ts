import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User mapping routes
  app.post("/api/user-mappings", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const mapping = await storage.createUserMapping(data);
      res.json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/user-mappings/:username", async (req, res) => {
    const mapping = await storage.getUserMapping(req.params.username);
    if (!mapping) {
      res.status(404).json({ message: "User mapping not found" });
    } else {
      res.json(mapping);
    }
  });

  app.get("/api/user-mappings/npub/:npub", async (req, res) => {
    const mapping = await storage.getUserMappingByNpub(req.params.npub);
    if (!mapping) {
      res.status(404).json({ message: "User mapping not found" });
    } else {
      res.json(mapping);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
