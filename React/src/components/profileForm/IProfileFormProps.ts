import IUser from "../../interfaces/API/IUser";

export default interface IProfileFormProps {
    user: IUser | null;
    resetForm: boolean;
}
