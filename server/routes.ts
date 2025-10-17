import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertHabitEntrySchema, insertPushSubscriptionSchema, insertNotificationPreferencesSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { NotificationService } from "./notificationService";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user (password hashing handled in storage layer)
      const user = await storage.createUser(validatedData);

      // Set session and save it
      req.session.userId = user.id;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data provided" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session and save it
      req.session.userId = user.id;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Update user (Iman score, streak, etc.)
  app.patch("/api/users/me", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.session.userId!, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Get today's habit entry
  app.get("/api/habits/today", requireAuth, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const entry = await storage.getHabitEntry(req.session.userId!, today);
    res.json({ entry });
  });

  // Save/update habit entry
  app.post("/api/habits", requireAuth, async (req, res) => {
    try {
      const { completedHabits, pointsEarned } = req.body;
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Habit request data:', { completedHabits, pointsEarned, userId: req.session.userId, today });
      
      // Validate input
      if (!Array.isArray(completedHabits) || typeof pointsEarned !== 'number') {
        console.error('Invalid data types:', { completedHabits: typeof completedHabits, pointsEarned: typeof pointsEarned });
        return res.status(400).json({ error: "Invalid data format" });
      }
      
      // Check if entry exists for today
      const existingEntry = await storage.getHabitEntry(req.session.userId!, today);
      
      if (existingEntry) {
        // Update existing entry
        const updatedEntry = await storage.updateHabitEntry(existingEntry.id, {
          completedHabits,
          pointsEarned
        });
        res.json({ entry: updatedEntry });
      } else {
        // Create new entry with explicit validation
        const entryData = {
          userId: req.session.userId!,
          date: today,
          completedHabits: completedHabits || [],
          pointsEarned: pointsEarned || 0
        };
        
        console.log('Creating new entry:', entryData);
        
        // Validate with schema
        const validatedData = insertHabitEntrySchema.parse(entryData);
        const entry = await storage.saveHabitEntry(validatedData);
        res.json({ entry });
      }
    } catch (error) {
      console.error('Habit entry error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid habit data" });
    }
  });

  // Get user's habit history
  app.get("/api/habits/history", requireAuth, async (req, res) => {
    const history = await storage.getUserHabitHistory(req.session.userId!);
    res.json({ history });
  });

  // PUSH NOTIFICATION ROUTES

  // Subscribe to push notifications
  app.post("/api/notifications/subscribe", requireAuth, async (req, res) => {
    try {
      const { subscription } = req.body;
      
      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({ error: "Invalid subscription data" });
      }

      const subscriptionData = insertPushSubscriptionSchema.parse({
        userId: req.session.userId!,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth
      });

      const savedSubscription = await storage.savePushSubscription(subscriptionData);
      res.json({ subscription: savedSubscription });
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(400).json({ error: "Failed to save subscription" });
    }
  });

  // Unsubscribe from push notifications
  app.post("/api/notifications/unsubscribe", requireAuth, async (req, res) => {
    try {
      await storage.deletePushSubscription(req.session.userId!);
      res.json({ success: true });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Get notification preferences
  app.get("/api/notifications/preferences", requireAuth, async (req, res) => {
    try {
      const preferences = await storage.getNotificationPreferences(req.session.userId!);
      
      if (!preferences) {
        // Return default preferences
        const defaultPrefs = {
          enabled: false,
          morningReminders: true,
          afternoonReminders: true,
          eveningReminders: true,
          prayerReminders: true,
          spiritualQuotes: true
        };
        return res.json(defaultPrefs);
      }

      // Convert integer fields to boolean
      const formattedPrefs = {
        enabled: Boolean(preferences.enabled),
        morningReminders: Boolean(preferences.morningReminders),
        afternoonReminders: Boolean(preferences.afternoonReminders),
        eveningReminders: Boolean(preferences.eveningReminders),
        prayerReminders: Boolean(preferences.prayerReminders),
        spiritualQuotes: Boolean(preferences.spiritualQuotes)
      };

      res.json(formattedPrefs);
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({ error: "Failed to get preferences" });
    }
  });

  // Save notification preferences
  app.post("/api/notifications/preferences", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Convert boolean to integer for database storage
      const preferencesData = {
        userId,
        enabled: req.body.enabled ? 1 : 0,
        morningReminders: req.body.morningReminders ? 1 : 0,
        afternoonReminders: req.body.afternoonReminders ? 1 : 0,
        eveningReminders: req.body.eveningReminders ? 1 : 0,
        prayerReminders: req.body.prayerReminders ? 1 : 0,
        spiritualQuotes: req.body.spiritualQuotes ? 1 : 0
      };

      // Check if preferences already exist
      const existingPrefs = await storage.getNotificationPreferences(userId);
      
      let savedPreferences;
      if (existingPrefs) {
        savedPreferences = await storage.updateNotificationPreferences(userId, preferencesData);
      } else {
        savedPreferences = await storage.saveNotificationPreferences(preferencesData);
      }

      res.json({ preferences: savedPreferences });
    } catch (error) {
      console.error("Save preferences error:", error);
      res.status(400).json({ error: "Failed to save preferences" });
    }
  });

  // Test notification endpoint (for development)
  app.post("/api/notifications/test", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { title, body } = req.body;
      
      const success = await NotificationService.sendToUser(userId, {
        title: title || "Test Notification ✨",
        body: body || "This is a test notification from Reverta!",
        url: "/my-journey"
      });

      res.json({ success });
    } catch (error) {
      console.error("Test notification error:", error);
      res.status(500).json({ error: "Failed to send test notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
