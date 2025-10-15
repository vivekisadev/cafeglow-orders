import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByCafe = query({
  args: { cafeId: v.id("cafes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_cafe", (q) => q.eq("cafeId", args.cafeId))
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
  },
});

export const create = mutation({
  args: {
    cafeId: v.id("cafes"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      ...args,
      isAvailable: true,
    });
  },
});
