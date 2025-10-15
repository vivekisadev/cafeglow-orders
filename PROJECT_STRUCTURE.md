# CafeFlow Backend - Simplified Project Structure

## 📁 Folder Structure

```
backend/
├── 📁 config/                 # Configuration files
│   └── connection.js         # MongoDB connection
├── 📁 middleware/             # Custom middleware
│   └── isLoggedIn.js          # Authentication middleware
├── 📁 models/                 # Database models
│   ├── admin.model.js        # Admin user model
│   ├── order.model.js        # Order model
│   └── product.model.js      # Product model
├── 📁 routes/                 # API routes (NEW ORGANIZED STRUCTURE)
│   ├── index.js               # Main route aggregator
│   ├── auth.routes.js         # Authentication routes (login/register)
│   ├── product.routes.js      # Product management routes
│   ├── order.routes.js        # Order management routes
│   ├── page.routes.js         # Page serving routes
│   └── developer.routes.js    # Developer tools routes
├── 📁 views/                  # EJS templates
│   ├── dashboard.ejs          # Admin dashboard
│   ├── admin-login.ejs        # Admin login page
│   └── admin-register.ejs     # Admin registration page
├── 📁 public/                 # Static files
│   ├── css/                   # Stylesheets
│   ├── js/                    # Client-side JavaScript
│   └── images/                # Image assets
├── app.js                     # Main application file
├── package.json               # Dependencies
└── .env                       # Environment variables
```

## 🚀 API Endpoints (NEW STRUCTURE)

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin info

### Product Routes (`/api`)
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Add new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Order Routes (`/api`)
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order (admin only)
- `POST /api/orders` - Place new order (public)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Page Routes (`/`)
- `GET /` - Customer menu page
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/login` - Admin login page
- `GET /admin/register` - Admin registration page
- `GET /menu` - Customer menu page

### Developer Routes (`/api/developer`)
- `GET /api/developer/admins` - Get all admin accounts
- `POST /api/developer/admins` - Create new admin
- `DELETE /api/developer/admins/:id` - Delete admin
- `POST /api/developer/admins/reset` - Reset all admins

## 🔧 Key Improvements

1. **Clear Separation**: Each route file handles a specific domain
2. **Consistent Naming**: All route files follow `*.routes.js` pattern
3. **Proper Prefixes**: API routes are properly namespaced
4. **Centralized Import**: All routes are imported through `routes/index.js`
5. **Cleaner app.js**: Main file now only contains configuration and middleware
6. **Better Organization**: Related functionality is grouped together

## 📝 Usage Notes

- All admin-protected routes use the `isLoggedIn` middleware
- Authentication is handled via JWT tokens stored in httpOnly cookies
- CORS is configured to allow credentials for cookie-based auth
- Database models remain unchanged to preserve data integrity
- All existing functionality is preserved with cleaner organization