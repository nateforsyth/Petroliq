export default interface ILoginFormProps {
    loginCallback: any;
    loginCancelCallback: any;

    loginSuccess: boolean;
    authSuccessTimeoutSeconds: number;

    loginFail: boolean;
    authFailMessage: string;
    authFailTimeoutSeconds: number;
}
