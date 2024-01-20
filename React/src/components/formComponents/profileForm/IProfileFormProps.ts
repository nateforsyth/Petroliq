import IUser from "../../model/interfaces/API/IUser";
import IUserSettings from "../../model/interfaces/API/IUserSettings";

export default interface IProfileFormProps {
    user: IUser | null;
    userSettings: IUserSettings | null;
    resetForm: boolean;

    userUpdatedOrDeletedCallback: any;
}
