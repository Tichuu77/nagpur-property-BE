import revenueRepository from './revenue.repository.js';

const revenueService = {
  /** KPI stats for the 4 stat cards */
  getStats: () => revenueRepository.getStats(),

  /** Last 6 months monthly revenue + subscription count */
  getMonthlyRevenue: () => revenueRepository.getMonthlyRevenue(),

  /** Last 6 months subscriptions broken down by plan */
  getSubscriptionsByPlan: () => revenueRepository.getSubscriptionsByPlan(),

  /** Per-plan breakdown cards */
  getPlanBreakdown: () => revenueRepository.getPlanBreakdown(),

  /** Paginated transaction list */
  getTransactions: (params) => revenueRepository.getTransactions(params),
};

export default revenueService;