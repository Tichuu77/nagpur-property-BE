import Subscription from '../../../models/purchaseSubscription.model.js';
import User from '../../../models/user.model.js';
import { successResponse } from '../../../utils/api-response.js';

const PLAN_TIER = { free: 0, basic: 1, premium: 2, enterprise: 3 };

/**
 * GET /api/v1/admin/users/:userId/plans
 * List all plan records for a user
 */
export const listUserPlans = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return next({ status: 404, message: 'User not found' });

    const plans = await Subscription.find({ userId })
      .populate('planId', 'name price duration durationUnit')
      .sort({ createdAt: -1 });

    res.status(200).json(successResponse(plans, 'User plans fetched'));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admin/users/:userId/plans
 * Assign a new plan to a user
 * Body: { planName, amount, startDate, endDate, status, paymentId? }
 */
export const createUserPlan = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { planName, amount, startDate, endDate, status = 'Active', paymentId } = req.body;

    if (!planName || !amount || !startDate || !endDate) {
      return next({ status: 400, message: 'planName, amount, startDate and endDate are required' });
    }

    const user = await User.findById(userId);
    if (!user) return next({ status: 404, message: 'User not found' });

    const end = new Date(endDate);
    const now = new Date();

    const plan = await Subscription.create({
      userId,
      planId: null,
      startDate: new Date(startDate),
      endDate: end,
      status,
      paymentDetails: {
        paymentId: paymentId || undefined,
        amountPaid: Number(amount),
      },
      usage: { propertiesPosted: 0, leadsUnlocked: 0, featuredPropertiesUsed: 0 },
    });

    // Sync user.plan and planExpiry when plan is active and not expired
    if (status === 'Active' && end > now) {
      const planKey = planName.toLowerCase();
      const currentTier = PLAN_TIER[user.plan] ?? 0;
      const newTier = PLAN_TIER[planKey] ?? 0;
      if (newTier >= currentTier) {
        user.plan = planKey;
        user.planExpiry = end;
        await user.save();
      }
    }

    // Attach planName for response (no Plan model row in this flow)
    const out = plan.toObject();
    out.planName = planName;

    res.status(201).json(successResponse(out, 'Plan assigned successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/users/:userId/plans/:planRecordId
 * Update a plan record
 */
export const updateUserPlan = async (req, res, next) => {
  try {
    const { userId, planRecordId } = req.params;
    const { planName, amount, startDate, endDate, status, paymentId } = req.body;

    const plan = await Subscription.findOne({ _id: planRecordId, userId });
    if (!plan) return next({ status: 404, message: 'Plan record not found' });

    if (planName) plan.set('planName', planName);
    if (startDate) plan.startDate = new Date(startDate);
    if (endDate) plan.endDate = new Date(endDate);
    if (status) plan.status = status;
    if (amount) plan.paymentDetails = { ...plan.paymentDetails, amountPaid: Number(amount) };
    if (paymentId) plan.paymentDetails = { ...plan.paymentDetails, paymentId };

    await plan.save();

    // Re-sync user plan if this is the active record
    if (plan.status === 'Active' && plan.endDate > new Date() && planName) {
      const user = await User.findById(userId);
      if (user) {
        user.plan = planName.toLowerCase();
        user.planExpiry = plan.endDate;
        await user.save();
      }
    }

    res.status(200).json(successResponse(plan, 'Plan updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/users/:userId/plans/:planRecordId
 * Remove a plan record
 */
export const deleteUserPlan = async (req, res, next) => {
  try {
    const { userId, planRecordId } = req.params;

    const plan = await Subscription.findOneAndDelete({ _id: planRecordId, userId });
    if (!plan) return next({ status: 404, message: 'Plan record not found' });

    res.status(200).json(successResponse(null, 'Plan record deleted'));
  } catch (err) {
    next(err);
  }
};