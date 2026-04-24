import { Router } from 'express';

// Module routers
import adminAuthRoutes    from '../../modules/admin/v1/auth.routes.js';
import adminProfileRoutes from '../../modules/admin/v1/profile.routes.js';
import subAdminRoutes     from '../../modules/sub-admin/v1/sub-admin.routes.js';
import staticPagesRoutes  from '../../modules/static-page/v1/static-pages.routes.js';
import adminPagesRoutes   from '../../modules/static-page/v1/admin-pages.routes.js';

// Existing module route handlers (add yours here as they are built)
import propertyRoutes     from '../../modules/property/v1/property.routes.js';
import userRoutes       from '../../modules/user/v1/user.routes.js';
 
// import customerRoutes     from '../../modules/customer/v1/customer.routes.js';
// import leadRoutes         from '../../modules/lead/v1/lead.routes.js';
// import planRoutes         from '../../modules/plans/v1/plan.routes.js';
// import notificationRoutes from '../../modules/notification/v1/notification.routes.js';
// import revenueRoutes      from '../../modules/revenue/v1/revenue.routes.js';
// import analyticsRoutes    from '../../modules/analytics/v1/analytics.routes.js';

const router = Router();

// ─── Public auth routes (no JWT required) ──────────────────────────────────────
router.use('/admin/auth', adminAuthRoutes);

// ─── Profile routes (any authenticated admin / sub-admin) ─────────────────────
// profile routes apply their own authMiddleware internally (see profile.routes.js)
router.use('/admin/profile', adminProfileRoutes);

// ─── Sub-admin management (admin role only, enforced inside sub-admin routes) ──
router.use('/admin/sub-admins', subAdminRoutes);

// ─── Static pages (public) ─────────────────────────────────────────────────────
router.use('/pages', staticPagesRoutes);
 
// ─── Static pages (admin CRUD) ─────────────────────────────────────────────────
router.use('/admin/pages', adminPagesRoutes);

// ─── Protected module routes ───────────────────────────────────────────────────
// Pattern: authMiddleware → checkPermission(module) → module router
//
// Uncomment and wire up each module as its router is created.
// The checkPermission middleware handles both admin (pass-through) and sub-admin (DB check).

router.use('/admin/properties',  propertyRoutes);
router.use('/admin/users',  userRoutes);

export default router;