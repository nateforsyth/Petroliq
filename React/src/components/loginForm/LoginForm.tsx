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
    ButtonGroup
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { Controller } from "react-hook-form";
import ILoginFormProps from "./ILoginFormProps";

import Backdrop from '@mui/material/Backdrop';
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
    const [loggingIn, setLoggingIn] = React.useState<boolean>(false);

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleClose = () => {
        props.loginCancelCallback(false);
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
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
        setLoggingIn(true);
        props.loginCallback(data.username, data.password);
        methods.reset();
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {
                <Box className="login-itemsbox" sx={{ width: 500 }}>
                    <Box className="title-box">
                        <Typography>
                            <BrandName />
                        </Typography>
                    </Box>
                    <Box className="card-form-box">
                        <FormProvider {...methods}>
                            <Card component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <FormTextField name="username" label="username" fullWidth={true} disabled={loggingIn} sx={{ marginBottom: "14px" }} />
                                    <FormTextField type={showPassword ? "text" : "password"} name="password" label="password" InputProps={{
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
                                    }} disabled={loggingIn} />
                                </CardContent>
                                <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                    <Button type="button" variant="contained" size="large" onClick={handleClose} disableElevation={true}>
                                        Cancel
                                    </Button>
                                    <ButtonGroup aria-label="loading button group">
                                        <Button type="button" variant="outlined" size="large" disableElevation={true}>
                                            Register
                                        </Button>
                                        <LoadingButton loading={loggingIn} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success">
                                            Login
                                        </LoadingButton>
                                    </ButtonGroup>
                                </CardActions>
                            </Card>
                        </FormProvider>
                    </Box>
                </Box>
            }
        </Backdrop>

    );
};

export default LoginForm;
