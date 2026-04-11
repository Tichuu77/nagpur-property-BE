export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findById(id, populate = '') {
    return this.model.findById(id).populate(populate);
  }

  findOne(filter, populate = '') {
    return this.model.findOne(filter).populate(populate);
  }

  findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 }, populate = '' } = options;
    return this.model.find(filter).populate(populate).sort(sort).skip(skip).limit(limit);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  create(payload) {
    return this.model.create(payload);
  }

  updateById(id, update, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  exists(filter) {
    return this.model.exists(filter);
  }
}