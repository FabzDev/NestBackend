import { User } from "../entities/user.entity";

export interface LoggedUser {
    user: User;
    jwt: string;
}