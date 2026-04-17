import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import checkPermission from '../../middlewares/check-permission.middleware.js';

// Module routers
import adminAuthRoutes    from '../../modules/admin/v1/auth.routes.js';
import adminProfileRoutes from '../../modules/admin/v1/profile.routes.js';
import subAdminRoutes     from '../../modules/sub-admin/v1/sub-admin.routes.js';
import staticPagesRoutes  from '../../modules/static-page/v1/static-pages.routes.js';
import adminPagesRoutes   from '../../modules/static-page/v1/admin-pages.routes.js';

// Existing module route handlers (add yours here as they are built)
// import brokerRoutes       from '../../modules/broker/v1/broker.routes.js';
// import customerRoutes     from '../../modules/customer/v1/customer.routes.js';
// import propertyRoutes     from '../../modules/property/v1/property.routes.js';
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

// router.use('/admin/brokers',       authMiddleware, checkPermission('brokers'),       brokerRoutes);
// router.use('/admin/customers',     authMiddleware, checkPermission('customers'),     customerRoutes);
// router.use('/admin/properties',    authMiddleware, checkPermission('properties'),    propertyRoutes);
// router.use('/admin/leads',         authMiddleware, checkPermission('leads'),         leadRoutes);
// router.use('/admin/plans',         authMiddleware, checkPermission('plans'),         planRoutes);
// router.use('/admin/notifications', authMiddleware, checkPermission('notifications'), notificationRoutes);
// router.use('/admin/revenue',       authMiddleware, checkPermission('revenue'),       revenueRoutes);
// router.use('/admin/analytics',     authMiddleware, checkPermission('analytics'),     analyticsRoutes);

export default router;