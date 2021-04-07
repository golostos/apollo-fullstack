import { Model, Optional } from "sequelize/types"

export interface IUser {
    id: string
    email: string
    token: string
}

export interface UserCreationAttributes extends Optional<IUser, "id"> {}

export declare class User extends Model<IUser, UserCreationAttributes> implements IUser {
    id: string;
    email: string;
    token: string;
}

export interface ITrip {
    id: string
    launchId: string
    userId: string
}

export interface TripCreationAttributes extends Optional<ITrip, "id"> {}

export declare class Trip extends Model<ITrip, TripCreationAttributes> implements ITrip {
    id: string;
    launchId: string;
    userId: string;
}