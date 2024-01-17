import * as React from "react";
import IProfileFormProps from "./IProfileFormProps";
import { Avatar, Box, Button, ButtonGroup, Card, CardActions, CardContent, TextField, TextFieldProps, Typography } from "@mui/material";

import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PasswordChangeForm from "../passwordChangeForm/PasswordChangeForm";
import { UserService } from "../../dataLayer/services/UserService";
import IObjectUpdateResult from "../../interfaces/API/IObjectUpdateResult";
import { User } from "../model/API/User";
import { AuthService } from "../../dataLayer/services/AuthService";

interface FormSelectProps {
    name: string;
    label: string;
}

interface FormInputs {
    FirstName?: string | null;
    LastName?: string | null;
    UserName?: string | null;
    Email?: string | null;
    // Password?: string | null; // TODO implement password changing functionality

    Id?: string | null;
    AssignedRoles?: string | null;
}

const LoginSchema: z.ZodSchema<FormInputs> = z.object({
    FirstName: z.string().min(1, "You must provide a username!"),
    Email: z.string().min(1, "You must provide an email address!"),
    Password: z.string().min(8, "You must provide a password at least 8 characters long!"), // TODO update password validity checking
});

const FormTextFieldComp: React.FC<FormSelectProps & TextFieldProps> = ({
    name,
    label,
    ...textFieldProps
}: FormSelectProps) => {
    return (
        <Controller
            name={name}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    value={field.value}
                    className="form-textfield"
                    label={label}
                    onChange={(e) => {
                        field.onChange(e);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message || ""}
                ></TextField>
            )}
        />
    );
};

const FormTextField = React.memo(FormTextFieldComp);

const ProfileForm: React.FunctionComponent<IProfileFormProps> = (props) => {

    const [savingData, setSavingData] = React.useState<boolean>(false);

    // canvas state
    const [changingPassword, setChangingPassword] = React.useState<boolean>(false);

    // child component state for auth
    const [userUpdateSuccess, setUserUpdateSuccess] = React.useState<boolean>(false);
    const [userUpdateFail, setUserUpdateFail] = React.useState<boolean>(false);
    const [userUpdateFailMessage, setUserUpdateFailMessage] = React.useState<string>("");

    // user state
    const [user, setuser] = React.useState(props.user);

    const userUpdateFailTimeoutSeconds: number = 5;

    const defaultValues: FormInputs = {
        FirstName: user === null ? "" : user.FirstName,
        LastName: user === null ? "" : user.LastName,
        UserName: user === null ? "" : user.UserName,
        Email: user === null ? "" : user.Email,
        Id: user === null ? "" : user.Id,
        AssignedRoles: user === null ? "" : user.AssignedRoles
    };

    const methods = useForm<FormInputs>({
        resolver: zodResolver(LoginSchema),
        defaultValues
    });

    React.useEffect(() => {
        if (props.resetForm) {
            console.log(`ProfileForm > props.resetForm: ${props.resetForm}`);
            setuser(null);
        }
    }, [props.resetForm]);

    const onSubmit: SubmitHandler<FormInputs> = async (
        data: FormInputs
    ) => {
        setSavingData(true);
        methods.reset();
    };

    const handleClickChangePassword = () => {
        setChangingPassword(true);
    };

    const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
        console.log(`password successfully changed`);

        if (props.user !== null) {
            // const currentBearerToken: string = AuthService.getBrowserAuthToken(); // TODO replace getBrowserAuthToken with HttpOnly cookie
            const currentRefreshToken: string = AuthService.getBrowserRefreshToken(); // TODO replace getBrowserAuthToken with HttpOnly cookie
            const currentBearerTokenExpiry: string = AuthService.getBrowserAuthTokenExpiry(); // TODO replace getBrowserAuthToken with HttpOnly cookie
            const userId: string = props.user !== null && props.user !== undefined && props.user.Id !== "" && props.user.Id !== undefined ? props.user?.Id : "";

            // if (props.user !== null && currentBearerToken !== undefined && currentBearerToken !== null && currentBearerToken !== "" && userId !== "") {
            //     const passwordChangeResult: IObjectUpdateResult = await UserService.postChangeUserPassword(currentBearerToken, userId, oldPassword, newPassword);

            //     if (passwordChangeResult !== null) {
            //         setUserUpdateSuccess(true);
            //         await new Promise(f => setTimeout(f, 3000));
            //         setChangingPassword(false);
            //     }
            //     else {
            //         setUserUpdateFailMessage(`Password change failed, check your passwords and try again.`);
            //         setUserUpdateFail(true);
            //         await new Promise(f => setTimeout(f, (userUpdateFailTimeoutSeconds * 1000)));
            //         setUserUpdateFail(false);
            //     }
            // }
        }
        else { // session expired, trigger clear of user profile data in app state

        }
    };

    const avatarAlt: string = props.user && props.user !== null ?
        `${props.user.Email}` :
        "";

    const UserSettingsHeader = () => {
        return <span>User Settings</span>;
    };

    const AppSettingsHeader = () => {
        return <span>App Settings</span>;
    };

    const Subheading = () => {
        return <h4>View and update your profile and settings</h4>;
    }

    const passwordChangeForm: JSX.Element = changingPassword ?
        <div><PasswordChangeForm userToUpdate={props.user} updateSuccess={userUpdateSuccess} updateFail={userUpdateFail} passwordChangeCancelCallback={setChangingPassword} passwordChangeCallback={handlePasswordChange} userUpdateFailMessage={userUpdateFailMessage} /></div> :
        <div></div>;

    let htmlElement: JSX.Element =
        <div>
            {passwordChangeForm}
            {
                user === null ?
                    null :
                    <Subheading />
            }
            <Box className="profile-form-itemsbox" sx={{ width: "100%" }}>
                <Avatar sx={{ width: 135, height: 135, margin: "auto", marginBottom: "16px", fontSize: "90px" }} alt={avatarAlt} src="/static/images/avatar/2.jpg" />
                <Box className="card-form-box">
                    <FormProvider {...methods}>
                        <Card component="form" onSubmit={methods.handleSubmit(onSubmit)} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", padding: "14px" }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "45%" }}>
                                    <Typography sx={{ marginBottom: "16px", marginTop: "16px" }} variant="h5" color="textPrimary" align="center">
                                        <UserSettingsHeader />
                                    </Typography>
                                    <FormTextField name="FirstName" label="First name" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="LastName" label="Last name" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="UserName" label="User name" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="Email" label="Email" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <hr />
                                    <FormTextField name="Id" label="Id" fullWidth={true} disabled={true} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="AssignedRoles" label="Assigned roles" fullWidth={true} disabled={true} sx={{ marginBottom: "14px" }} />
                                </CardContent>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "45%" }}>
                                    <Typography sx={{ marginBottom: "16px", marginTop: "16px" }} variant="h5" color="textPrimary" align="center">
                                        <AppSettingsHeader />
                                    </Typography>
                                    <FormTextField name="Placeholder1" label="Placeholder text field 1" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="Placeholder2" label="Placeholder text field 2" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="Placeholder3" label="Placeholder text field 3" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="Placeholder4" label="Placeholder text field 4" fullWidth={true} disabled={savingData || user === null} sx={{ marginBottom: "14px" }} />
                                </CardContent>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "end", padding: "14px" }}>
                                <ButtonGroup aria-label="loading button group">
                                    <Button type="button" variant="outlined" size="large" disableElevation={true} onClick={handleClickChangePassword} disabled={user === null}>
                                        Change Password
                                    </Button>
                                    <Button type="button" variant="outlined" size="large" disableElevation={true} color="error" disabled={user === null}>
                                        Delete my account
                                    </Button>
                                    <LoadingButton loading={savingData} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success" disabled={user === null}>
                                        Save
                                    </LoadingButton>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    </FormProvider>
                </Box>
            </Box>
        </div>;

    return htmlElement;
}

export default ProfileForm;
