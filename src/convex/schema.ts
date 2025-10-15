import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    cafes: defineTable({
      name: v.string(),
      description: v.string(),
      image: v.string(),
      address: v.string(),
      phone: v.string(),
      isActive: v.boolean(),
      ownerId: v.id("users"),
      openingTime: v.optional(v.string()),
      closingTime: v.optional(v.string()),
      workingDays: v.optional(v.string()),
    }).index("by_owner", ["ownerId"]),

    menuItems: defineTable({
      cafeId: v.id("cafes"),
      name: v.string(),
      description: v.string(),
      price: v.number(),
      category: v.string(),
      image: v.string(),
      isAvailable: v.boolean(),
    }).index("by_cafe", ["cafeId"]),

    orders: defineTable({
      userId: v.id("users"),
      cafeId: v.id("cafes"),
      items: v.array(v.object({
        menuItemId: v.id("menuItems"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })),
      totalAmount: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("preparing"),
        v.literal("ready"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      customerName: v.string(),
      customerPhone: v.string(),
      notes: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_cafe", ["cafeId"])
      .index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;