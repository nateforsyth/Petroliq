export default interface IUserDeletionFormProps {
    userDeletionCallback: any;
    accountDeletionCancelCallback: any;

    userDeletionFailMessage: string;
    deletionSuccess: boolean;
    deletionFail: boolean;
}
