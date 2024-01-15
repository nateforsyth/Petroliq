import IUser from "../../interfaces/API/IUser";

export default interface IPasswordChangeFormProps {
    userToUpdate: IUser|null;

    updateSuccess: boolean;
    updateFail: boolean;
    userUpdateFailMessage: string;

    passwordChangeCancelCallback: any;
    passwordChangeCallback: any;
}
