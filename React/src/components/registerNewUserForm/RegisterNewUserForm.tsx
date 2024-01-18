import * as React from "react";
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardActions, CardContent, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, TextFieldProps, Typography } from "@mui/material";

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
import { AppHelpers } from "../../utilities/AppHelpers";
import IAuthResult from "../../interfaces/API/IAuthResult";
import IRegisterNewUserFormProps from "./IRegisterNewUserFormProps";
import IUser from "../../interfaces/API/IUser";
import IUserForRegistration from "../../interfaces/API/IUserForRegistration";
import IUserSettingsForRegistration from "../../interfaces/API/IUserSettingsForRegistration";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IObjectAddResult from "../../interfaces/API/IObjectAddResult";
import { UserForRegistration } from "../model/API/UserForRegistration";
import { UserSettingsForRegistration } from "../model/API/UserSettingsForRegistration";
// import { NumberImport } from "./../numberInput/NumberInput";

interface FormSelectProps {
    name: string;
    label: string;
}

interface FormInputs {
    FirstName?: string | null;
    LastName?: string | null;
    UserName?: string | null;
    Email?: string | null;
    Password?: string | null;

    CountryName?: string | null;
    CurrencyUnit?: number | null; // CurrencyUnit enum
    CapacityUnit?: number | null; // CapacityUnit enum
    DistanceUnit?: number | null; // DistanceUnit enum
    BaseDiscount?: string | null;
    MinimumSpendForDiscount?: string | null;
    LastPricePerCapacityUnit?: string | null;
    AccruedDiscount?: string | null;
    RoundTo?: string | null;
}

const RegisterUserSchema: z.ZodSchema<FormInputs> = z.object({
    FirstName: z.string().min(1, "You must provide a first name!"),
    LastName: z.string(),
    UserName: z.string(),
    Email: z.string().includes("@").min(1, "You must provide an email address!"),
    Password: z.string().min(8, "You must provide a password at least 8 characters long!"),
    CountryName: z.string().min(1, "You must provide the country where you reside!"),
    // CurrencyUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }), // CurrencyUnit enum
    // CapacityUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }), // CapacityUnit enum
    // DistanceUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }), // DistanceUnit enum
    BaseDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    MinimumSpendForDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    LastPricePerCapacityUnit: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    AccruedDiscount: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" }),
    RoundTo: z.string().refine(v => { let n = Number(v); return !isNaN(n) && v?.length > 0 }, { message: "Invalid number" })
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

const RegisterNewUserForm: React.FunctionComponent<IRegisterNewUserFormProps> = (props) => {

    const [processing, setProcessing] = React.useState<boolean>(false);

    // user state
    const [user, setUser] = React.useState<IUserForRegistration>({});
    const [userSettings, setUserSettings] = React.useState<IUserSettingsForRegistration>({});

    const [userRegistrationSuccess, setUserRegistrationSuccess] = React.useState<boolean>(false);
    const [userRegistrationFail, setUserRegistrationFail] = React.useState<boolean>(false);
    const [userRegisterFailTimeoutSeconds, setUserRegisterFailTimeoutSeconds] = React.useState<number>(5);
    const [userRegistrationFailMessage, setUserRegistrationFailMessage] = React.useState<string>("");

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [selectedCapacityUnit, setSelectedCapacityUnit] = React.useState<number>(8467);
    const [selectedCurrencyUnit, setSelectedCurrencyUnit] = React.useState<number>(36);
    const [selectedDistanceUnit, setSelectedDistanceUnit] = React.useState<number>(107);

    const defaultValues: FormInputs = {
        FirstName: "",
        LastName: "",
        UserName: "",
        Email: "",
        Password: "",
        CountryName: "New Zealand",
        BaseDiscount: "0.06",
        MinimumSpendForDiscount: "40",
        LastPricePerCapacityUnit: "0",
        AccruedDiscount: "0",
        RoundTo: "2"
    };

    const methods = useForm<FormInputs>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues
    });

    React.useEffect(() => {
        if (props.resetForm) {
            // setuser(null);
        }
    }, [props.resetForm]);

    const onSubmit: SubmitHandler<FormInputs> = async (
        data: FormInputs
    ) => {
        data.CapacityUnit = selectedCapacityUnit;
        data.CurrencyUnit = selectedCurrencyUnit;
        data.DistanceUnit = selectedDistanceUnit;

        const user: UserForRegistration = {
            FirstName: data.FirstName ? data.FirstName : "",
            LastName: data.LastName ? data.LastName : "",
            UserName: data.UserName ? data.UserName : "",
            Email: data.Email ? data.Email : "",
            Password: data.Password ? data.Password : ""
        };

        const settings: UserSettingsForRegistration = {
            CountryName: data.CountryName ? data.CountryName : "",
            CurrencyUnit: selectedCurrencyUnit,
            CapacityUnit: selectedCapacityUnit,
            DistanceUnit: selectedDistanceUnit,
            BaseDiscount: data.BaseDiscount ? +data.BaseDiscount : 0.06,
            MinimumSpendForDiscount: data.MinimumSpendForDiscount ? +data.MinimumSpendForDiscount : 40,
            LastPricePerCapacityUnit: data.LastPricePerCapacityUnit ? +data.LastPricePerCapacityUnit : 0,
            AccruedDiscount: data.AccruedDiscount ? +data.AccruedDiscount : 0,
            RoundTo: data.RoundTo ? +data.RoundTo : 2
        };

        setUser(user);
        setUserSettings(settings);

        console.log(data, user, settings);
        setProcessing(true);

        await registerNewUser(user, settings);

        props.userRegistrationSubmitCallback();
        methods.reset();
    };

    const registerNewUser = async (userForRegistration: IUserForRegistration, settingsForRegistration: IUserSettingsForRegistration): Promise<void> => {
        if (userForRegistration !== null && userForRegistration.Email !== "" && userForRegistration.Password !== "" && settingsForRegistration !== null) {
            const userRegistrationResult: IObjectAddResult = await UserService.postRegisterUser(userForRegistration, settingsForRegistration);

            if (userRegistrationResult !== null) {
                setUserRegistrationSuccess(true);
                await new Promise(f => setTimeout(f, 3000));
                setProcessing(false);
                console.log(`password successfully changed`);
            }
            else {
                setUserRegistrationFailMessage(`Failed to register you as a new user, check the data you've provided and try again.`);
                setUserRegistrationFail(true);
                await new Promise(f => setTimeout(f, (userRegisterFailTimeoutSeconds * 1000)));
                setUserRegistrationFail(false);
            }
        }
        else {
            console.warn("Failed to invoke user registration, required data is missing");
        }
    };

    const avatarAlt: string = user && user !== null ?
        `${user.Email}` :
        "";

    const UserSettingsHeader = () => {
        return <span>User Settings</span>;
    };

    const AppSettingsHeader = () => {
        return <span>App Settings</span>;
    };

    const Subheading = () => {
        return <h4>Register for this service</h4>;
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

    let htmlElement: JSX.Element =
        <div>
            <Box className="register-user-form-box" sx={{ width: "100%" }}>
                <Avatar sx={{ width: 135, height: 135, margin: "auto", marginBottom: "16px", fontSize: "90px" }} alt={avatarAlt} src="/static/images/avatar/2.jpg" />
                <Box className="card-form-box">
                    <FormProvider {...methods}>
                        <Card component="form" onSubmit={methods.handleSubmit(onSubmit)} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", padding: "14px" }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "45%" }}>
                                    <Typography sx={{ marginBottom: "16px", marginTop: "16px" }} variant="h5" color="textPrimary" align="center">
                                        <UserSettingsHeader />
                                    </Typography>
                                    <FormTextField name="FirstName" label="First name" fullWidth={true} disabled={processing} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="LastName" label="Last name" fullWidth={true} disabled={processing} sx={{ marginBottom: "14px" }} />
                                    <FormTextField name="UserName" label="User name" fullWidth={true} disabled={processing} sx={{ marginBottom: "14px" }} autoComplete="true" />
                                    <FormTextField name="Email" label="Email" fullWidth={true} disabled={processing} sx={{ marginBottom: "14px" }} autoComplete="true" />
                                    <FormTextField type={showPassword ? "text" : "password"} name="Password" label="Password" InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }} disabled={processing} required={true} />
                                </CardContent>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "45%" }}>
                                    <Typography sx={{ marginBottom: "16px", marginTop: "16px" }} variant="h5" color="textPrimary" align="center">
                                        <AppSettingsHeader />
                                    </Typography>
                                    <FormTextField name="CountryName" label="Country Name" fullWidth={true} disabled={processing} sx={{ marginBottom: "14px" }} />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormControl fullWidth sx={{ marginBottom: "14px", width: "48%" }}>
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
                                        <FormControl fullWidth sx={{ marginBottom: "14px", width: "48%" }}>
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
                                        <FormControl fullWidth sx={{ marginBottom: "14px", width: "48%" }}>
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
                                            disabled={processing}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="MinimumSpendForDiscount"
                                            label="Minimum spend for discount"
                                            fullWidth={true}
                                            disabled={processing}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                        />
                                        <FormTextField
                                            name="LastPricePerCapacityUnit"
                                            label={`Last price per ${String.fromCharCode(selectedCapacityUnit)}`}
                                            fullWidth={true}
                                            disabled={processing}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
                                        <FormTextField
                                            name="AccruedDiscount"
                                            label="Accrued discount"
                                            fullWidth={true}
                                            disabled={true}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{String.fromCharCode(selectedCurrencyUnit)}</InputAdornment>,
                                            }}
                                        />
                                        <FormTextField
                                            name="RoundTo"
                                            label="Round to"
                                            fullWidth={true}
                                            disabled={processing}
                                            sx={{ marginBottom: "14px", width: "48%" }}
                                            inputProps={{ type: 'number' }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">decimal places</InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                <Button type="button" variant="outlined" size="large" disableElevation={true} color="info" disabled={false}>
                                    Cancel
                                </Button>
                                <LoadingButton loading={processing} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success" disabled={false}>
                                    Register
                                </LoadingButton>
                            </CardActions>
                            {
                                userRegistrationSuccess ?
                                    <Alert sx={{ justifyContent: "center" }} severity="success">
                                        Your account has been successfully registered, you may now log in...
                                    </Alert> :
                                    null
                            }
                            {
                                userRegistrationFail ?
                                    <Alert sx={{ justifyContent: "center" }} severity="error">
                                        User registration failed: {userRegistrationFailMessage}
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

export default RegisterNewUserForm;
