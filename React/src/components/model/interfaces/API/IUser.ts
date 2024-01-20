import IUserForRegistration from "./IUserForRegistration";

export default interface IUser extends IUserForRegistration {
    Id?: string;
    Password?: string;
    AssignedRoles?: string;
    RefreshToken?: string;
    RefreshTokenExpiryTime?: string;
}
