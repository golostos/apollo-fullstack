// @ts-check
const { Model } = require('sequelize');

class User extends Model { }

class Trip extends Model { }

module.exports = {
    User,
    Trip
}