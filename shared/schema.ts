import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  gender: text("gender").notNull(), // "Brother" or "Sister"
  imanScore: integer("iman_score").default(0),
  streak: integer("streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitEntries = pgTable("habit_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  completedHabits: jsonb("completed_habits").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  pointsEarned: integer("points_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  endpoint: text("endpoint").notNull(),
  p256dhKey: text("p256dh_key").notNull(),
  authKey: text("auth_key").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  enabled: integer("enabled").default(1), // 1 = true, 0 = false
  morningReminders: integer("morning_reminders").default(1),
  afternoonReminders: integer("afternoon_reminders").default(1),
  eveningReminders: integer("evening_reminders").default(1),
  prayerReminders: integer("prayer_reminders").default(1),
  spiritualQuotes: integer("spiritual_quotes").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  password: true,
  gender: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Brother", "Sister"], {
    required_error: "Please select Brother or Sister",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertHabitEntrySchema = createInsertSchema(habitEntries).pick({
  userId: true,
  date: true,
  completedHabits: true,
  pointsEarned: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).pick({
  userId: true,
  endpoint: true,
  p256dhKey: true,
  authKey: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).pick({
  userId: true,
  enabled: true,
  morningReminders: true,
  afternoonReminders: true,
  eveningReminders: true,
  prayerReminders: true,
  spiritualQuotes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertHabitEntry = z.infer<typeof insertHabitEntrySchema>;
export type HabitEntry = typeof habitEntries.$inferSelect;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
