import staticPageService from '../static-pages.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * GET /api/v1/pages/:slug
 * Public — fetches a single static page by slug
 * Slugs: about-us | privacy-policy | terms-and-conditions | contact-us
 */
export const getPage = async (req, res, next) => {
  try {
    const page = await staticPageService.getBySlug(req.params.slug);
    res.status(200).json(successResponse(page));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/pages
 * Public — lists all published static pages (meta only)
 */
export const listPages = async (req, res, next) => {
  try {
    const pages = await staticPageService.listAll();
    res.status(200).json(successResponse(pages));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/pages/:slug
 * Admin only — update a static page's content
 */
export const updatePage = async (req, res, next) => {
  try {
    const page = await staticPageService.update(req.params.slug, req.body);
    res.status(200).json(successResponse(page, 'Page updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admin/pages/seed
 * Admin only — seed all default page content
 */
export const seedPages = async (req, res, next) => {
  try {
    const seeded = await staticPageService.seedDefaults();
    res.status(200).json(successResponse(seeded, `Seeded ${seeded.length} pages`));
  } catch (err) {
    next(err);
  }
};