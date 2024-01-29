import * as React from "react";
import IProfileFormProps from "./IProfileFormProps";
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardActions, CardContent, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, TextFieldProps, Typography, useMediaQuery, useTheme } from "@mui/material";

import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PasswordChangeForm from "../passwordChangeForm/PasswordChangeForm";
import { UserService } from "../../../dataLayer/services/UserService";
import { User } from "../../model/API/User";
import { AuthService } from "../../../dataLayer/services/AuthService";
import { AppHelpers } from "../../../utilities/AppHelpers";
import IAuthResult from "../../model/interfaces/API/IAuthResult";
import IObjectUpdateResult from "../../model/interfaces/API/IObjectUpdateResult";
import IUserSettings from "../../model/interfaces/API/IUserSettings";
import IObjectDeleteResult from "../../model/interfaces/API/IObjectDeleteResult";
import IUser from "../../model/interfaces/API/IUser";
import UserDeletionForm from "../userDeletionForm/UserDeletionForm";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserSettings } from "../../model/API/UserSettings";

interface FormSelectProps {
    name: string;
    label: string;
}

interface FormInputs {
    FirstName?: string | null;
    LastName?: string | null;
    UserName?: string | null;
    Email?: string | null;

    Id?: string | null;
    AssignedRoles?: string | null;

    CountryName?: string | null;
    CurrencyUnit?: number | null; // CurrencyUnit enum
    CapacityUnit?: number | null; // CapacityUnit enum
    DistanceUnit?: number | null; // DistanceUnit enum
    BaseDiscount?: string | null;
    MinimumSpendForDiscount?: string | null;
    LastPricePerCapacityUnit?: string | null;
    AccruedDiscount?: string | null;
    IdealDiscount?: string | null;
    CurrentBatchId?: string | null;
    NextFillId?: string | null;
    AvgCapacityUnitPerDistanceUnit?: string | null;
    MaxVolumeQualifyingForDiscount?: string | null;
    RoundTo?: string | null;
    RoundUnitCostTo?: string | null;
}

const RegisterUserSchema: z.ZodSchema<FormInputs> = z.object({
    Id: z.string().min(1, "You must provide an Id!"),
    FirstName: z.string().min(1, "You must provide a first name!"),
    LastName: z.string(),
    UserName: z.string(),
    Email: z.string().includes("@").min(1, "You must provide an email address!"),
    CountryName: z.string().min(1, "You must provide the country where you reside!"),
    BaseDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    MinimumSpendForDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    LastPricePerCapacityUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    AccruedDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    IdealDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    CurrentBatchId: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    NextFillId: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    AvgCapacityUnitPerDistanceUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    MaxVolumeQualifyingForDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    RoundTo: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    RoundUnitCostTo: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" })
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
    const navigate: NavigateFunction = useNavigate();

    const theme = useTheme();
    const wide = useMediaQuery(theme.breakpoints.up('lg'));

    const [savingData, setSavingData] = React.useState<boolean>(false);

    // canvas state
    const [changingPassword, setChangingPassword] = React.useState<boolean>(false);
    const [deletingAccount, setDeletingAccount] = React.useState<boolean>(false);

    // user child component state for update
    const [userUpdateSuccess, setUserUpdateSuccess] = React.useState<boolean>(false);
    const [userUpdateFail, setUserUpdateFail] = React.useState<boolean>(false);
    const [userUpdateFailMessage, setUserUpdateFailMessage] = React.useState<string>("");

    // user state
    const [user, setUser] = React.useState<IUser | null>(props.user);

    // user settings child component state for deletion
    const [userDeletionSuccess, setUserDeletionSuccess] = React.useState<boolean>(false);
    const [userDeletionFail, setUserDeletionFail] = React.useState<boolean>(false);
    const [userDeletionFailMessage, setUserDeletionFailMessage] = React.useState<string>("");

    // user settings state
    const [userSettings, setUserSettings] = React.useState<IUserSettings | null>(props.userSettings);
    const [selectedCapacityUnit, setSelectedCapacityUnit] = React.useState<number>(userSettings?.CapacityUnit ?? 8467);
    const [selectedCurrencyUnit, setSelectedCurrencyUnit] = React.useState<number>(userSettings?.CurrencyUnit ?? 36);
    const [selectedDistanceUnit, setSelectedDistanceUnit] = React.useState<number>(userSettings?.DistanceUnit ?? 107);

    const userUpdateFailTimeoutSeconds: number = 5;
    const userDeletionFailTimeoutSeconds: number = 5;

    const getFormValues = (): FormInputs => {
        console.log(`getFormValues invoked; ${user?.UserName}`);
        const values: FormInputs = {
            FirstName: user?.FirstName ?? "",
            LastName: user?.LastName ?? "",
            UserName: user?.UserName ?? "",
            Email: user?.Email ?? "",
            Id: user?.Id ?? "",
            AssignedRoles: user?.AssignedRoles ?? "",
            CountryName: userSettings?.CountryName ?? "",
            BaseDiscount: `${userSettings?.BaseDiscount ?? "0.06"}`,
            MinimumSpendForDiscount: `${userSettings?.MinimumSpendForDiscount ?? "40"}`,
            LastPricePerCapacityUnit: `${userSettings?.LastPricePerCapacityUnit ?? "0"}`,
            AccruedDiscount: `${userSettings?.AccruedDiscount ?? "0"}`,
            IdealDiscount: `${userSettings?.IdealDiscount ?? "0.10"}`,
            CurrentBatchId: `${userSettings?.CurrentBatchId ?? "0"}`,
            NextFillId: `${userSettings?.NextFillId ?? "0"}`,
            AvgCapacityUnitPerDistanceUnit: `${userSettings?.AvgCapacityUnitPerDistanceUnit ?? "0"}`,
            MaxVolumeQualifyingForDiscount: `${userSettings?.MaxVolumeQualifyingForDiscount ?? "50"}`,
            RoundTo: `${userSettings?.RoundTo ?? "2"}`,
            RoundUnitCostTo: `${userSettings?.RoundUnitCostTo ?? "3"}`
        };

        return values;
    };

    const [formValues, setFormValues] = React.useState<FormInputs>(getFormValues());

    const methods = useForm<FormInputs>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: formValues
    });

    React.useEffect(() => {
        console.log(`profileform updated; props: ${props.user?.UserName}, state: ${user?.UserName}`);
        if (props.resetForm) {
            setUser(null);
            setUserSettings(null);
        }
        setFormValues(getFormValues());
    }, [props.resetForm, props.user, props.userSettings, user?.UserName]);

    const onInvalid = (error: any) => {
        console.log(`onInvalid`, error);
    };

    const onSubmit: SubmitHandler<FormInputs> = async (
        data: FormInputs
    ) => {
        setSavingData(true);
        const userData: User = {
            Id: data.Id ?? "",
            FirstName: data.FirstName ? data.FirstName : "",
            LastName: data.LastName ? data.LastName : "",
            UserName: data.UserName ? data.UserName : "",
            Email: data.Email ? data.Email : "",

            // must provide values to API, but empty strings are OK
            Password: "",
            AssignedRoles: "",
            RefreshToken: "",
            RefreshTokenExpiryTime: ""
        };

        const settingsData: UserSettings = {
            Id: "",
            UserId: data.Id ?? "",
            CountryName: data.CountryName ? data.CountryName : "",
            CurrencyUnit: selectedCurrencyUnit,
            CapacityUnit: selectedCapacityUnit,
            DistanceUnit: selectedDistanceUnit,
            BaseDiscount: data.BaseDiscount ? +data.BaseDiscount : 0.06,
            MinimumSpendForDiscount: data.MinimumSpendForDiscount ? +data.MinimumSpendForDiscount : 40,
            LastPricePerCapacityUnit: data.LastPricePerCapacityUnit ? +data.LastPricePerCapacityUnit : 0,
            AccruedDiscount: data.AccruedDiscount ? +data.AccruedDiscount : 0,
            IdealDiscount: data.IdealDiscount ? +data.IdealDiscount : 0.10,
            CurrentBatchId: data.CurrentBatchId ? +data.CurrentBatchId : 0,
            NextFillId: data.NextFillId ? +data.NextFillId : 0,
            AvgCapacityUnitPerDistanceUnit: data.AvgCapacityUnitPerDistanceUnit ? +data.AvgCapacityUnitPerDistanceUnit : 0,
            MaxVolumeQualifyingForDiscount: data.MaxVolumeQualifyingForDiscount ? +data.MaxVolumeQualifyingForDiscount : 50,
            RoundTo: data.RoundTo ? +data.RoundTo : 2,
            RoundUnitCostTo: data.RoundUnitCostTo ? +data.RoundUnitCostTo : 3
        };

        console.log(userData.UserName);

        await handleUpdateUser(userData, settingsData);

        // methods.reset();
    };

    const handleUpdateUser = async (userToUpdate: User, settingsToUpdate: UserSettings) => {
        const currentBearerTokenExpiry: string = AuthService.getBrowserAuthTokenExpiry();
        const currentBearerTokenExpiryDt: Date = new Date(currentBearerTokenExpiry);

        if (props.user !== null && props.user.Id !== undefined) {
            if (currentBearerTokenExpiryDt > new Date()) {
                console.log(currentBearerTokenExpiryDt);
                await updateUser(userToUpdate, settingsToUpdate);
            }
            else { // need to refresh access token before continuing
                const authResult: IAuthResult = await AuthService.refreshToken(props.user.Id);
                console.log(authResult);

                if (authResult !== null && authResult.resposeCode === 200) {
                    await updateUser(userToUpdate, settingsToUpdate);
                }
                else {
                    console.warn("Failed to refresh access token, user needs to log in again");
                }
            }
        }
        else { // session expired, trigger clear of user profile data in app state
            AppHelpers.forceLogout();
        }
    };

    const updateUser = async (userToUpdate: User, settingsToUpdate: UserSettings): Promise<void> => {
        console.log(userToUpdate, settingsToUpdate);
        if (userToUpdate !== null && userToUpdate.Email !== "" && settingsToUpdate !== null) {
            const userUpdateResult: IObjectUpdateResult = await UserService.postUpdateUser(userToUpdate, settingsToUpdate);

            if (userUpdateResult !== null && userUpdateResult.resposeCode === 200) {
                await new Promise(f => {
                    console.log(userUpdateResult);

                    const updatedUser: IUser = JSON.parse(JSON.stringify(userUpdateResult.data.User));
                    const updatedUserSettings: IUserSettings = JSON.parse(JSON.stringify(userUpdateResult.data.UserSettings));

                    setUserUpdateSuccess(true);

                    setTimeout(f, 3000);

                    setUser(updatedUser);
                    setUserSettings(updatedUserSettings);
                    props.userUpdatedOrDeletedCallback(updatedUser, updatedUserSettings);

                    setSavingData(false);

                    console.log(`user and settings successfully updated; ${updatedUser.UserName}`);
                    setUserUpdateSuccess(false);
                });
            }
            else {
                await new Promise(f => {
                    setUserUpdateFailMessage(`Failed to update your details, check the data you've provided and try again.`);
                    setUserUpdateFail(true);
                    setTimeout(f, (userUpdateFailTimeoutSeconds * 1000));
                    setUserUpdateFail(false);
                });
            }
        }
        else {
            console.warn("Failed to invoke user update, required data is missing");
        }
    };

    const handleClickChangePassword = () => {
        setChangingPassword(true);
    };

    const handleClickDeleteAccount = () => {
        setDeletingAccount(true);
    };

    const handleCapacityUnitChange = (event: any) => {
        setSelectedCapacityUnit(event.target.value);
    };

    const handleCurrencyUnitChange = (event: any) => {
        setSelectedCurrencyUnit(event.target.value);
    };

    const handleDistanceUnitChange = (event: any) => {
        setSelectedDistanceUnit(event.target.value);
    };

    const handleDeleteAccount = async () => {
        const currentBearerTokenExpiry: string = AuthService.getBrowserAuthTokenExpiry();
        const currentBearerTokenExpiryDt: Date = new Date(currentBearerTokenExpiry);

        if (props.user !== null && props.user.Id !== undefined) {
            if (currentBearerTokenExpiryDt > new Date()) {
                await deleteAccount(props.user);
            }
            else { // need to refresh access token before continuing
                const authResult: IAuthResult = await AuthService.refreshToken(props.user.Id);

                if (authResult !== null && authResult.resposeCode === 200) {
                    await deleteAccount(props.user);
                }
                else {
                    console.warn("Failed to refresh access token, user needs to log in again");
                }
            }

            AppHelpers.forceLogout();
        }
        else { // session expired, trigger clear of user profile data in app state
            AppHelpers.forceLogout();
        }

        props.userUpdatedOrDeletedCallback(null, null);
        navigate("/");
    };

    const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
        const currentBearerTokenExpiry: string = AuthService.getBrowserAuthTokenExpiry();
        const currentBearerTokenExpiryDt: Date = new Date(currentBearerTokenExpiry);

        if (props.user !== null && props.user.Id) {
            if (currentBearerTokenExpiryDt > new Date()) {
                await changePassword(props.user.Id, oldPassword, newPassword);
            }
            else { // need to refresh access token before continuing
                const authResult: IAuthResult = await AuthService.refreshToken(props.user.Id);

                if (authResult !== null && authResult.resposeCode === 200) {
                    await changePassword(props.user.Id, oldPassword, newPassword);
                }
                else {
                    console.warn("Failed to refresh access token, user needs to log in again");
                    AppHelpers.forceLogout();
                }
            }
        }
        else { // session expired, trigger clear of user profile data in app state
            AppHelpers.forceLogout();
        }
    };

    const deleteAccount = async (userToDelete: IUser): Promise<void> => {
        const userDeleteResult: IObjectDeleteResult = await UserService.postDeleteUser(userToDelete);

        if (userDeleteResult !== null) {
            if (userDeleteResult.resposeCode === 200) {
                await new Promise(f => {
                    setUserDeletionSuccess(true);
                    setTimeout(f, 3000);
                    setDeletingAccount(false);
                    console.log(`Your account has been successfully deleted`);
                    setUserDeletionSuccess(false);
                });
            }
            else {
                await new Promise(f => {
                    setUserDeletionFailMessage(`${userDeleteResult.resposeCode}: Failed to delete your account, try again or contact the administrator.`);
                    setUserDeletionFail(true);
                    setTimeout(f, (userDeletionFailTimeoutSeconds * 1000));
                    setUserDeletionFail(false);
                });
            }
        }
        else {
            await new Promise(f => {
                setUserDeletionFailMessage(`User deletion request is missing required data, try again or contact the administrator.`);
                setUserDeletionFail(true);
                setTimeout(f, (userDeletionFailTimeoutSeconds * 1000));
                setUserDeletionFail(false);
            });
        }
    };

    const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
        const passwordChangeResult: IObjectUpdateResult = await UserService.postChangeUserPassword(userId, oldPassword, newPassword);

        if (passwordChangeResult !== null) {
            if (passwordChangeResult.resposeCode === 200) {
                await new Promise(f => {
                    setUserUpdateSuccess(true);
                    setTimeout(f, 3000);
                    setChangingPassword(false);
                    setUserUpdateSuccess(false);
                    console.log(`Password successfully changed`);
                });
            }
            else {
                await new Promise(f => {
                    setUserUpdateFailMessage(`${passwordChangeResult.resposeCode}: Password change failed, check your passwords and try again.`);
                    setUserUpdateFail(true);
                    setTimeout(f, (userUpdateFailTimeoutSeconds * 1000));
                    setUserUpdateFail(false);
                });
            }
        }
        else {
            await new Promise(f => {
                setUserUpdateFailMessage(`Password change request is missing required data, try again or contact the administrator.`);
                setUserUpdateFail(true);
                setTimeout(f, (userUpdateFailTimeoutSeconds * 1000));
                setUserUpdateFail(false);
            });
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
        <div><PasswordChangeForm
            userToUpdate={props.user}
            updateSuccess={userUpdateSuccess}
            updateFail={userUpdateFail}
            passwordChangeCancelCallback={setChangingPassword}
            passwordChangeCallback={handlePasswordChange}
            userUpdateFailMessage={userUpdateFailMessage}
        />
        </div> :
        <div></div>;

    const accountDeletionForm: JSX.Element = deletingAccount ?
        <div>
            <UserDeletionForm
                userDeletionCallback={handleDeleteAccount}
                accountDeletionCancelCallback={setDeletingAccount}
                userDeletionFailMessage={userDeletionFailMessage}
                deletionSuccess={userDeletionSuccess}
                deletionFail={userDeletionFail}
            />
        </div> :
        <div></div>;

    const elementWidth: string = wide ? "50%" : "initial";
    const flexDirection: string = wide ? "row" : "column";

    let htmlElement: JSX.Element =
        <div>
            {passwordChangeForm}
            {accountDeletionForm}
            {
                user === null ?
                    null :
                    <Subheading />
            }
            <Box className="profile-form-itemsbox">
                <Avatar sx={{ width: 135, height: 135, margin: "auto", marginBottom: "16px", fontSize: "90px" }} alt={avatarAlt} src="/static/images/avatar/2.jpg" />
                <Box className="card-form-box">
                    <FormProvider {...methods}>
                        <Card component="form" onSubmit={methods.handleSubmit(onSubmit, onInvalid)} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", padding: "14px" }}>
                            <CardContent
                                sx={{ display: 'flex', flexDirection: flexDirection }}
                            >
                                <CardContent
                                    sx={{ display: 'flex', flexDirection: 'column', width: elementWidth }}
                                >
                                    <Typography
                                        sx={{ marginBottom: "16px", marginTop: "16px" }}
                                        variant="h5"
                                        color="textPrimary"
                                        align="center">
                                        <UserSettingsHeader />
                                    </Typography>
                                    <FormTextField
                                        name="FirstName"
                                        label="First name"
                                        fullWidth={true}
                                        disabled={savingData || user === null}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.FirstName}
                                    />
                                    <FormTextField
                                        name="LastName"
                                        label="Last name"
                                        fullWidth={true}
                                        disabled={savingData || user === null}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.LastName}
                                    />
                                    <FormTextField
                                        name="UserName"
                                        label="User name"
                                        fullWidth={true}
                                        disabled={savingData || user === null}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.UserName}
                                    />
                                    <FormTextField
                                        name="Email"
                                        label="Email"
                                        fullWidth={true}
                                        disabled={savingData || user === null}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.Email}
                                    />
                                    <hr />
                                    <FormTextField
                                        name="Id"
                                        label="Id"
                                        fullWidth={true}
                                        disabled={true}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.Id}
                                    />
                                    <FormTextField
                                        name="AssignedRoles"
                                        label="Assigned roles"
                                        fullWidth={true}
                                        disabled={true}
                                        sx={{ marginBottom: "14px" }}
                                        value={user?.AssignedRoles}
                                    />
                                </CardContent>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', width: elementWidth }}>
                                    <Typography
                                        sx={{ marginBottom: "16px", marginTop: "16px" }}
                                        variant="h5"
                                        color="textPrimary"
                                        align="center">
                                        <AppSettingsHeader />
                                    </Typography>
                                    <FormTextField name="CountryName" label="Country Name" fullWidth={true} disabled={savingData || userSettings === null} sx={{ marginBottom: "14px" }} />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormControl id="capacityUnit" fullWidth sx={{ marginBottom: "14px", width: "48%" }} disabled={savingData || userSettings === null}>
                                            <InputLabel id="capacityUnitLabel">Capacity Unit</InputLabel>
                                            <Select
                                                labelId="capacityUnitSelectLabel"
                                                id="capacityUnitSelect"
                                                value={selectedCapacityUnit}
                                                label="Capacity Unit"
                                                onChange={handleCapacityUnitChange}
                                            >
                                                <MenuItem value={8467}>Litre, ℓ</MenuItem>
                                                <MenuItem value={103}>Gallon, g</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl id="currencyUnit" fullWidth sx={{ marginBottom: "14px", width: "48%" }} disabled={savingData || userSettings === null}>
                                            <InputLabel id="currencyUnitLabel">Currency Unit</InputLabel>
                                            <Select
                                                labelId="currencyUnitSelectLabel"
                                                id="currencyUnitSelect"
                                                value={selectedCurrencyUnit}
                                                label="Currency Unit"
                                                onChange={handleCurrencyUnitChange}
                                            >
                                                <MenuItem value={36}>Dollar, $</MenuItem>
                                                <MenuItem value={8364}>Euro, €</MenuItem>
                                                <MenuItem value={8369}>Peso, ₱</MenuItem>
                                                <MenuItem value={163}>Pound, £</MenuItem>
                                                <MenuItem value={165}>Yen, ¥</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormControl id="distanceUnit" fullWidth sx={{ marginBottom: "14px", width: "48%" }} disabled={savingData || userSettings === null}>
                                            <InputLabel id="distanceUnitLabel">Distance Unit</InputLabel>
                                            <Select
                                                labelId="distanceUnitSelectLabel"
                                                id="distanceUnitSelect"
                                                value={selectedDistanceUnit}
                                                label="Distance Unit"
                                                onChange={handleDistanceUnitChange}
                                            >
                                                <MenuItem value={107}>Kilometers, km</MenuItem>
                                                <MenuItem value={109}>Miles, mi</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormTextField
                                            name="BaseDiscount"
                                            label={`Base discount per ${String.fromCharCode(selectedCapacityUnit)}`}
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.BaseDiscount}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="MinimumSpendForDiscount"
                                            label="Minimum spend for discount"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.MinimumSpendForDiscount}
                                        />
                                        <FormTextField
                                            name="LastPricePerCapacityUnit"
                                            label={`Last price per ${String.fromCharCode(selectedCapacityUnit)}`}
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.LastPricePerCapacityUnit}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="AccruedDiscount"
                                            label="Accrued discount"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.AccruedDiscount}
                                        />
                                        <FormTextField
                                            name="IdealDiscount"
                                            label="Ideal discount"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.IdealDiscount}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="AvgCapacityUnitPerDistanceUnit"
                                            label="Average capacity unit per distance unit"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{String.fromCharCode(selectedCapacityUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.AvgCapacityUnitPerDistanceUnit}
                                        />
                                        <FormTextField
                                            name="MaxVolumeQualifyingForDiscount"
                                            label="Max volume qualifying for discount"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{String.fromCharCode(selectedCapacityUnit)}</InputAdornment>,
                                            }}
                                            value={userSettings?.MaxVolumeQualifyingForDiscount}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="RoundTo"
                                            label="Round to"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">decimal places</InputAdornment>,
                                            }}
                                            value={userSettings?.RoundTo}
                                        />
                                        <FormTextField
                                            name="RoundUnitCostTo"
                                            label="Round unit cost to"
                                            fullWidth={true}
                                            disabled={savingData || userSettings === null}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">decimal places</InputAdornment>,
                                            }}
                                            value={userSettings?.RoundUnitCostTo}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="CurrentBatchId"
                                            label="Current batch Id"
                                            fullWidth={true}
                                            disabled={true}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            value={userSettings?.CurrentBatchId}
                                        />
                                        <FormTextField
                                            name="NextFillId"
                                            label="Next fill Id"
                                            fullWidth={true}
                                            disabled={true}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            value={userSettings?.NextFillId}
                                        />
                                    </Box>
                                </CardContent>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "end", padding: "14px 28px" }}>
                                <ButtonGroup aria-label="loading button group">
                                    <Button type="button" variant="outlined" size="large" disableElevation={true} onClick={handleClickChangePassword} disabled={savingData || user === null}>
                                        Change Password
                                    </Button>
                                    <Button type="button" variant="outlined" size="large" disableElevation={true} color="error" disabled={savingData || user === null} onClick={handleClickDeleteAccount}>
                                        Delete my account
                                    </Button>
                                    <LoadingButton loading={savingData} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success" disabled={user === null}>
                                        Save
                                    </LoadingButton>
                                </ButtonGroup>
                            </CardActions>
                            {
                                userUpdateSuccess ?
                                    <Alert sx={{ justifyContent: "center" }} severity="success">
                                        Your account has been successfully updated, you may need to log back in...
                                    </Alert> :
                                    null
                            }
                            {
                                userUpdateFail ?
                                    <Alert sx={{ justifyContent: "center" }} severity="error">
                                        User update failed: {userUpdateFailMessage}
                                    </Alert> :
                                    null
                            }
                        </Card>
                    </FormProvider>
                </Box>
            </Box>
        </div>;

    return htmlElement;
}

export default ProfileForm;
