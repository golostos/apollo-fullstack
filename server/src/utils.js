// @ts-check
const { Op, Sequelize, DataTypes } = require('sequelize');
const { User, Trip } = require('./datasources/models');

/** @typedef {import('./types/graphql').Launch} Launch */

/** @typedef {import('./types/graphql').Scalars['ID']} ID */

/**
 * @param {Object} obj 
 * @param {string} obj.after
 * @param {number} obj.pageSize
 * @param {Launch[]} obj.results
 * @param {(item?: Launch) => string | null} [obj.getCursor]
 */
module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
        cursorIndex + 1,
        Math.min(results.length, cursorIndex + 1 + pageSize),
      )
    : results.slice(0, pageSize);
};

const createStore = () => {
  const sequelize = new Sequelize('spacex', 'spacex_user', 'user12345', {
    dialect: 'mysql'
  });

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, { sequelize, modelName: 'user' })

  Trip.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    launchId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'trip' })

  sequelize.sync()
 
  return { User, Trip };
};

module.exports.createStore = createStore

/**
 * @typedef {ReturnType<typeof createStore>} Store
 */
