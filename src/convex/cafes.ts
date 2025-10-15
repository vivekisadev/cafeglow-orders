import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("cafes")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("cafes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image: v.string(),
    address: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("cafes", {
      ...args,
      isActive: true,
      ownerId: user._id,
    });
  },
});
