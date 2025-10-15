import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Create sample cafes
    const cafe1 = await ctx.db.insert("cafes", {
      name: "Sunrise Café",
      description: "Your morning coffee destination with fresh pastries and artisan brews",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      isActive: true,
      ownerId: "dummy" as any,
    });

    const cafe2 = await ctx.db.insert("cafes", {
      name: "The Cozy Corner",
      description: "Comfort food and specialty drinks in a warm atmosphere",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
      address: "456 Oak Avenue, Midtown",
      phone: "(555) 987-6543",
      isActive: true,
      ownerId: "dummy" as any,
    });

    // Create menu items for Sunrise Café
    await ctx.db.insert("menuItems", {
      cafeId: cafe1,
      name: "Cappuccino",
      description: "Rich espresso with steamed milk and foam",
      price: 4.50,
      category: "Coffee",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe1,
      name: "Croissant",
      description: "Buttery, flaky French pastry",
      price: 3.50,
      category: "Pastries",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe1,
      name: "Avocado Toast",
      description: "Fresh avocado on sourdough with cherry tomatoes",
      price: 8.50,
      category: "Food",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe1,
      name: "Iced Latte",
      description: "Smooth espresso with cold milk over ice",
      price: 5.00,
      category: "Coffee",
      image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
      isAvailable: true,
    });

    // Create menu items for The Cozy Corner
    await ctx.db.insert("menuItems", {
      cafeId: cafe2,
      name: "Hot Chocolate",
      description: "Rich Belgian chocolate with whipped cream",
      price: 4.75,
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe2,
      name: "Blueberry Muffin",
      description: "Homemade muffin bursting with fresh blueberries",
      price: 3.75,
      category: "Pastries",
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe2,
      name: "Caesar Salad",
      description: "Crisp romaine with parmesan and house-made dressing",
      price: 9.50,
      category: "Food",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      isAvailable: true,
    });

    await ctx.db.insert("menuItems", {
      cafeId: cafe2,
      name: "Matcha Latte",
      description: "Premium Japanese matcha with steamed milk",
      price: 5.50,
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536013564743-8e29d0e5b8c1?w=400",
      isAvailable: true,
    });

    return { success: true, message: "Sample data created successfully" };
  },
});
