import IUserForRegistration from "../../../interfaces/API/IUserForRegistration";

export class UserForRegistration implements IUserForRegistration {
    FirstName?: string;
    LastName?: string;
    UserName?: string;
    Email?: string;
    Password?: string;

    constructor(firstName?: string, lastName?: string, userName?: string, email?: string, password?: string, ) {
        this.FirstName = firstName;
        this.LastName = lastName;
        this.UserName = userName;
        this.Email = email;
        this.Password = password;
    }
}
