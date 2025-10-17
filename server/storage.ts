import { 
  type User, 
  type InsertUser, 
  type HabitEntry, 
  type InsertHabitEntry,
  type PushSubscription,
  type InsertPushSubscription,
  type NotificationPreferences,
  type InsertNotificationPreferences,
  users, 
  habitEntries,
  pushSubscriptions,
  notificationPreferences
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Habit tracking
  getHabitEntry(userId: string, date: string): Promise<HabitEntry | undefined>;
  saveHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry | undefined>;
  getUserHabitHistory(userId: string): Promise<HabitEntry[]>;
  
  // Push notifications
  savePushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getUserPushSubscriptions(userId: string): Promise<PushSubscription[]>;
  deletePushSubscription(userId: string): Promise<void>;
  
  // Notification preferences
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  saveNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined>;
  getAllUsersWithNotifications(): Promise<Array<{ user: User; preferences: NotificationPreferences; subscriptions: PushSubscription[] }>>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private habitEntries: Map<string, HabitEntry>;
  private pushSubscriptions: Map<string, PushSubscription>;
  private notificationPrefs: Map<string, NotificationPreferences>;

  constructor() {
    this.users = new Map();
    this.habitEntries = new Map();
    this.pushSubscriptions = new Map();
    this.notificationPrefs = new Map();
    
    // Add test user for development bypass mode
    const testUser: User = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'TestUser',
      password: 'hashedpassword',
      gender: 'unspecified',
      imanScore: 250,
      streak: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set('test-user-123', testUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      imanScore: 0,
      streak: 0,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getHabitEntry(userId: string, date: string): Promise<HabitEntry | undefined> {
    const entryKey = `${userId}-${date}`;
    return this.habitEntries.get(entryKey);
  }

  async saveHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const id = randomUUID();
    const now = new Date();
    const entry: HabitEntry = {
      ...insertEntry,
      id,
      completedHabits: (insertEntry.completedHabits || []) as string[],
      pointsEarned: insertEntry.pointsEarned || 0,
      createdAt: now
    };
    const entryKey = `${insertEntry.userId}-${insertEntry.date}`;
    this.habitEntries.set(entryKey, entry);
    return entry;
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry | undefined> {
    // Find entry by id
    const entry = Array.from(this.habitEntries.values()).find(e => e.id === id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...updates };
    const entryKey = `${entry.userId}-${entry.date}`;
    this.habitEntries.set(entryKey, updatedEntry);
    return updatedEntry;
  }

  async getUserHabitHistory(userId: string): Promise<HabitEntry[]> {
    return Array.from(this.habitEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Push notification methods
  async savePushSubscription(insertSubscription: InsertPushSubscription): Promise<PushSubscription> {
    const id = randomUUID();
    const now = new Date();
    const subscription: PushSubscription = {
      ...insertSubscription,
      id,
      createdAt: now
    };
    this.pushSubscriptions.set(insertSubscription.userId, subscription);
    return subscription;
  }

  async getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    const subscription = this.pushSubscriptions.get(userId);
    return subscription ? [subscription] : [];
  }

  async deletePushSubscription(userId: string): Promise<void> {
    this.pushSubscriptions.delete(userId);
  }

  // Notification preferences methods
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    return this.notificationPrefs.get(userId);
  }

  async saveNotificationPreferences(insertPrefs: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const id = randomUUID();
    const now = new Date();
    const preferences: NotificationPreferences = {
      ...insertPrefs,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.notificationPrefs.set(insertPrefs.userId, preferences);
    return preferences;
  }

  async updateNotificationPreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined> {
    const prefs = this.notificationPrefs.get(userId);
    if (!prefs) return undefined;
    
    const updatedPrefs = { ...prefs, ...updates, updatedAt: new Date() };
    this.notificationPrefs.set(userId, updatedPrefs);
    return updatedPrefs;
  }

  async getAllUsersWithNotifications(): Promise<Array<{ user: User; preferences: NotificationPreferences; subscriptions: PushSubscription[] }>> {
    const result = [];
    for (const [userId, preferences] of this.notificationPrefs.entries()) {
      if (preferences.enabled) {
        const user = this.users.get(userId);
        const subscriptions = await this.getUserPushSubscriptions(userId);
        if (user && subscriptions.length > 0) {
          result.push({ user, preferences, subscriptions });
        }
      }
    }
    return result;
  }
}

// PostgreSQL Storage Implementation using Drizzle
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });
    this.db = drizzle(pool, { schema: { users, habitEntries, pushSubscriptions, notificationPreferences } });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const result = await this.db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
      imanScore: 0,
      streak: 0
    }).returning();
    
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  async getHabitEntry(userId: string, date: string): Promise<HabitEntry | undefined> {
    const result = await this.db.select().from(habitEntries)
      .where(and(eq(habitEntries.userId, userId), eq(habitEntries.date, date)))
      .limit(1);
    
    return result[0];
  }

  async saveHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const result = await this.db.insert(habitEntries).values(insertEntry).returning();
    return result[0];
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry | undefined> {
    const result = await this.db.update(habitEntries)
      .set(updates)
      .where(eq(habitEntries.id, id))
      .returning();
    
    return result[0];
  }

  async getUserHabitHistory(userId: string): Promise<HabitEntry[]> {
    const result = await this.db.select().from(habitEntries)
      .where(eq(habitEntries.userId, userId))
      .orderBy(habitEntries.date);
    
    return result;
  }

  // Push notification methods for PostgreSQL
  async savePushSubscription(insertSubscription: InsertPushSubscription): Promise<PushSubscription> {
    // Delete existing subscription for this user first
    await this.db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, insertSubscription.userId));
    
    const result = await this.db.insert(pushSubscriptions).values(insertSubscription).returning();
    return result[0];
  }

  async getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    const result = await this.db.select().from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
    return result;
  }

  async deletePushSubscription(userId: string): Promise<void> {
    await this.db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
  }

  // Notification preferences methods for PostgreSQL
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    const result = await this.db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);
    return result[0];
  }

  async saveNotificationPreferences(insertPrefs: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const result = await this.db.insert(notificationPreferences).values(insertPrefs).returning();
    return result[0];
  }

  async updateNotificationPreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined> {
    const result = await this.db.update(notificationPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notificationPreferences.userId, userId))
      .returning();
    
    return result[0];
  }

  async getAllUsersWithNotifications(): Promise<Array<{ user: User; preferences: NotificationPreferences; subscriptions: PushSubscription[] }>> {
    // Get all users with enabled notifications
    const enabledUsers = await this.db.select()
      .from(users)
      .innerJoin(notificationPreferences, eq(users.id, notificationPreferences.userId))
      .innerJoin(pushSubscriptions, eq(users.id, pushSubscriptions.userId))
      .where(eq(notificationPreferences.enabled, 1));

    // Group results by user
    const userMap = new Map();
    for (const row of enabledUsers) {
      const userId = row.users.id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user: row.users,
          preferences: row.notification_preferences,
          subscriptions: []
        });
      }
      userMap.get(userId).subscriptions.push(row.push_subscriptions);
    }

    return Array.from(userMap.values());
  }
}

// Use PostgreSQL storage if DATABASE_URL is available, otherwise fallback to memory
export const storage = process.env.DATABASE_URL ? new PostgresStorage() : new MemStorage();
