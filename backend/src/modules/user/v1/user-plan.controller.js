// user-plan.controller.js
import Subscription from '../../../models/purchaseSubscription.model.js';
import Plan from '../../../models/subscription.model.js';
import User from '../../../models/user.model.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * GET /api/v1/admin/users/:userId/plans
 */
export const listUserPlans = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return next({ status: 404, message: 'User not found' });

    const plans = await Subscription.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(successResponse(plans, 'User plans fetched'));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admin/users/:userId/plans
 * Body: { planId, startDate, endDate?, status?, paymentId?, orderId?, method? }
 */
export const createUserPlan = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { planId, startDate, endDate, status = 'Active', paymentId, orderId, method } = req.body;

    if (!planId || !startDate) {
      return next({ status: 400, message: 'planId and startDate are required' });
    }

    const [user, plan] = await Promise.all([
      User.findById(userId),
      Plan.findById(planId),
    ]);
    if (!user) return next({ status: 404, message: 'User not found' });
    if (!plan) return next({ status: 404, message: 'Plan not found' });

    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : undefined;

    // Auto-calculate end date from plan duration if not unlimited and no endDate given
    if (!plan.isDurationUnlimited && !end) {
      end = new Date(start);
      if (plan.durationUnit === 'days')   end.setDate(end.getDate() + plan.duration);
      if (plan.durationUnit === 'months') end.setMonth(end.getMonth() + plan.duration);
      if (plan.durationUnit === 'years')  end.setFullYear(end.getFullYear() + plan.duration);
    }

    const subscription = await Subscription.create({
      userId,
      planId: plan._id,
      planName: plan.name,
      startDate: start,
      endDate: end,
      status,
      isFree: plan.isFree,
      price: plan.price,
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      isDurationUnlimited: plan.isDurationUnlimited,
      limits: { ...plan.limits },
      paymentDetails: {
        paymentId:  paymentId  || undefined,
        orderId:    orderId    || undefined,
        amountPaid: plan.isFree ? 0 : plan.price,
        method:     method     || undefined,
      },
      usage: { propertiesPosted: 0, leadsUnlocked: 0, featuredPropertiesUsed: 0 },
    });

    res.status(201).json(successResponse(subscription, 'Plan assigned successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/users/:userId/plans/:planRecordId
 * Body: { planId?, startDate?, endDate?, status?, paymentId?, orderId?, method? }
 */
export const updateUserPlan = async (req, res, next) => {
  try {
    const { userId, planRecordId } = req.params;
    const { planId, startDate, endDate, status, paymentId, orderId, method } = req.body;

    const subscription = await Subscription.findOne({ _id: planRecordId, userId });
    if (!subscription) return next({ status: 404, message: 'Plan record not found' });

    // If switching plan
    if (planId && planId !== String(subscription.planId)) {
      const plan = await Plan.findById(planId);
      if (!plan) return next({ status: 404, message: 'Plan not found' });
      subscription.planId          = plan._id;
      subscription.planName        = plan.name;
      subscription.isFree          = plan.isFree;
      subscription.price           = plan.price;
      subscription.duration        = plan.duration;
      subscription.durationUnit    = plan.durationUnit;
      subscription.isDurationUnlimited = plan.isDurationUnlimited;
      subscription.limits          = { ...plan.limits };
      if (!plan.isDurationUnlimited && startDate && !endDate) {
        const start = new Date(startDate);
        const end   = new Date(start);
        if (plan.durationUnit === 'days')   end.setDate(end.getDate() + plan.duration);
        if (plan.durationUnit === 'months') end.setMonth(end.getMonth() + plan.duration);
        if (plan.durationUnit === 'years')  end.setFullYear(end.getFullYear() + plan.duration);
        subscription.endDate = end;
      }
    }

    if (startDate) subscription.startDate = new Date(startDate);
    if (endDate)   subscription.endDate   = new Date(endDate);
    if (status)    subscription.status    = status;

    subscription.paymentDetails = {
      ...subscription.paymentDetails,
      ...(paymentId && { paymentId }),
      ...(orderId   && { orderId }),
      ...(method    && { method }),
    };

    await subscription.save();
    res.status(200).json(successResponse(subscription, 'Plan updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/users/:userId/plans/:planRecordId
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