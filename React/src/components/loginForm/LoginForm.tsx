import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    TextField,
    TextFieldProps,
    InputAdornment,
    IconButton,
    ButtonGroup,
    Alert,
    Avatar
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { Controller } from "react-hook-form";
import ILoginFormProps from "./ILoginFormProps";

import Backdrop from '@mui/material/Backdrop';
import PersonIcon from '@mui/icons-material/Person';
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormInputs {
    username?: string | null;
    password?: string | null;
}

interface FormSelectProps {
    name: string;
    label: string;
}

const LoginSchema: z.ZodSchema<LoginFormInputs> = z.object({
    username: z.string().min(1, "You must provide a username!"),
    password: z.string().min(1, "You must provide a password!")
});

const BrandName = () => {
    return <span>Log in to PetrolIQ</span>;
};

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

const LoginForm: React.FC<ILoginFormProps> = (props) => {

    const [open, setOpen] = React.useState(true);
    const [processing, setProcessing] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [canCancel, setCanCancel] = React.useState<boolean>(true);

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [showAuthSuccess, setShowAuthSuccess] = React.useState<boolean>(false);
    const [showAuthFailure, setShowAuthFailure] = React.useState<boolean>(false);

    React.useEffect(() => {
        setShowAuthSuccess(props.loginSuccess);
        setLoading(false);
        new Promise(f => setTimeout(f, (props.authSuccessTimeoutSeconds * 1000)))
            .then(() => {
                setProcessing(false);
            });
    }, [props.loginSuccess]);

    React.useEffect(() => {
        setShowAuthFailure(props.loginFail);
        setLoading(false);
        setCanCancel(true);
        new Promise(f => setTimeout(f, (props.authFailTimeoutSeconds * 1000)))
            .then(() => {
                setProcessing(false);
            });
    }, [props.loginFail]);

    const handleClose = () => {
        props.loginCancelCallback(false);
        setLoading(false);
        setOpen(false);
    };

    const defaultValues: LoginFormInputs = {
        username: "",
        password: ""
    };

    const methods = useForm<LoginFormInputs>({
        resolver: zodResolver(LoginSchema),
        defaultValues
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (
        data: LoginFormInputs
    ) => {
        setCanCancel(false);
        setLoading(true);
        setProcessing(true);
        props.loginCallback(data.username, data.password);
        methods.reset();
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {
                <Box className="login-itemsbox" sx={{ width: 500, padding: "30px", backgroundColor: "common.white", filter: "drop-shadow(black 5px 5px 5px)" }}>
                    <Box className="title-box" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Avatar sx={{ width: 135, height: 135, margin: "auto" }}>
                            <PersonIcon sx={{ fontSize: "135px" }} />
                        </Avatar>
                        <Typography sx={{ marginBottom: "16px", marginTop: "16px" }} variant="h5" color="textPrimary" align="center">
                            <BrandName />
                        </Typography>
                    </Box>
                    <Box className="card-form-box">
                        <FormProvider {...methods}>
                            <Card component="form" onSubmit={methods.handleSubmit(onSubmit)} variant="outlined">
                                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <FormTextField name="username" label="Email Address" fullWidth={true} disabled={processing || showAuthFailure} sx={{ marginBottom: "14px" }} required={true} />
                                    <FormTextField type={showPassword ? "text" : "password"} name="password" label="Password" InputProps={{
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
                                    }} disabled={processing || showAuthFailure} required={true} />
                                </CardContent>
                                <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                    <Button disabled={!canCancel} type="button" variant="contained" size="large" onClick={handleClose} disableElevation={true}>
                                        Cancel
                                    </Button>
                                    <ButtonGroup aria-label="loading button group">
                                        <Button disabled={processing || showAuthFailure} type="button" variant="outlined" size="large" disableElevation={true}>
                                            Register
                                        </Button>
                                        <LoadingButton disabled={processing || showAuthFailure} loading={loading} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success">
                                            Login
                                        </LoadingButton>
                                    </ButtonGroup>
                                </CardActions>
                                {
                                    showAuthSuccess ?
                                        <Alert sx={{ justifyContent: "center" }} severity="success">
                                            Login successful
                                        </Alert> :
                                        null
                                }
                                {
                                    showAuthFailure ?
                                        <Alert sx={{ justifyContent: "center" }} severity="error">
                                            Login failed: {props.authFailMessage}
                                        </Alert> :
                                        null
                                }
                            </Card>
                        </FormProvider>
                    </Box>
                </Box>
            }
        </Backdrop>

    );
};

export default LoginForm;
