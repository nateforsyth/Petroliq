import IUser from "../../../interfaces/API/IUser";
import { UserForRegistration } from "./UserForRegistration";

export class User extends UserForRegistration implements IUser {
    Id?: string;
    AssignedRoles?: string;

    CurrentBearerToken?: string;

    constructor(id?: string, firstName?: string, lastName?: string, userName?: string, email?: string, password?: string, roles?: string) {
        super(firstName, lastName, userName, email, password);
        
        this.Id = id;
        this.AssignedRoles = roles;
    }
}
