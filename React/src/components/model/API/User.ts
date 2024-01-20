import IUser from "../interfaces/API/IUser";
import { UserForRegistration } from "./UserForRegistration";

export class User extends UserForRegistration implements IUser {
    Id?: string;
    Password?: string;
    AssignedRoles?: string;
    RefreshToken?: string;
    RefreshTokenExpiryTime?: string;

    constructor(id?: string, firstName?: string, lastName?: string, userName?: string, email?: string, password?: string, roles?: string, refreshToken?: string, refreshTokenExpiryTime?: string) {
        super(firstName, lastName, userName, email, password);
        
        this.Id = id;
        this.Password = password;
        this.AssignedRoles = roles;
        this.RefreshToken = refreshToken;
        this.RefreshTokenExpiryTime = refreshTokenExpiryTime;
    }
}
