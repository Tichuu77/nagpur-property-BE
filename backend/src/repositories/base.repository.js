export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(payload) {
    return this.model.create(payload);
  }
}
