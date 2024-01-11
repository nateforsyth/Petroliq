import IUserForRegistration from "./IUserForRegistration";

export default interface IUser extends IUserForRegistration {
    Id?: string;    
    AssignedRoles?: string;
}
