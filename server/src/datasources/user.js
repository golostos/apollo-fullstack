// @ts-check
const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

/** @typedef {import("../utils").Store} Store */

/** 
 * @typedef {Object} Context 
 * @property {InstanceType<Store['User']>} [user]
 */

class UserAPI extends DataSource {
  /**
   * @param {Object} obj
   * @param {Store} obj.store
   */
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   * @param {import('apollo-datasource').DataSourceConfig<Context>} config
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   * @param {Object} obj
   * @param {string} [obj.email]
   */  
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.User.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  /**
   * @param {Object} obj
   * @param {string[]} obj.launchIds
   */
  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  /**
   * @param {Object} obj
   * @param {string} obj.launchId
   */
  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.Trip.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0] : false;
  }

  /**
   * @param {Object} obj
   * @param {string} obj.launchId
   */
  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.Trip.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.Trip.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.launchId).filter(l => !!l)
      : [];
  }

  /**
   * @param {Object} obj
   * @param {string} obj.launchId
   */
  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.Trip.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
