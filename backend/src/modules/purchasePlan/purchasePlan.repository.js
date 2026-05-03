import PurchasePlan from '../../models/purchaseSubscription.model.js';

const purchasePlanRepository = {
    async createPurchasePlan(payload) {
        const purchasePlan = await PurchasePlan.create(payload);
        return purchasePlan;
    },
};


export default purchasePlanRepository;