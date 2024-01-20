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
    Alert
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { Controller } from "react-hook-form";

import Backdrop from '@mui/material/Backdrop';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IPasswordChangeFormProps from "./IPasswordChangeFormProps";

interface LoginFormInputs {
    userId?: string | null;
    oldPassword?: string | null;
    newPassword?: string | null;
}

interface FormSelectProps {
    name: string;
    label: string;
}

const LoginSchema: z.ZodSchema<LoginFormInputs> = z.object({
    userId: z.string().min(1, "You must provide a userId!"),
    oldPassword: z.string().min(1, "You must provide your current password!"),
    newPassword: z.string().min(1, "You must provide your new password!")
});

const BrandName = () => {
    return <span>Change your password</span>;
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

const PasswordChangeForm: React.FC<IPasswordChangeFormProps> = (props) => {

    const [open, setOpen] = React.useState(true);
    const [processing, setProcessing] = React.useState<boolean>(false);

    const [showOldPassword, setShowOldPassword] = React.useState<boolean>(false);
    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);

    const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownNewPassword = () => setShowNewPassword(!showNewPassword);

    const [showUpdateSuccess, setShowUpdateSuccess] = React.useState<boolean>(false);
    const [showUpdateFailure, setShowUpdateFailure] = React.useState<boolean>(false);

    React.useEffect(() => {
        setProcessing(false);
        setShowUpdateSuccess(props.updateSuccess);
    }, [props.updateSuccess]);

    React.useEffect(() => {
        setProcessing(false);
        setShowUpdateFailure(props.updateFail);
    }, [props.updateFail]);

    const handleClose = () => {
        props.passwordChangeCancelCallback(false);
        setOpen(false);
    };

    const defaultValues: LoginFormInputs = {
        userId: props.userToUpdate?.Id,
        oldPassword: "",
        newPassword: ""
    };

    const methods = useForm<LoginFormInputs>({
        resolver: zodResolver(LoginSchema),
        defaultValues
    });

    const onInvalid = (error: any) => {
        console.log(`onInvalid`, error);
    };

    const onSubmit: SubmitHandler<LoginFormInputs> = async (
        data: LoginFormInputs
    ) => {
        setProcessing(true);
        props.passwordChangeCallback(data.oldPassword, data.newPassword);
        methods.reset();
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {
                <Box className="login-itemsbox" sx={{ width: 500, padding: "15px", backgroundColor: "primary.main", filter: "drop-shadow(black 5px 5px 5px)" }}>
                    <Box className="title-box">
                        <Typography sx={{ marginBottom: "8px" }}>
                            <BrandName />
                        </Typography>
                    </Box>
                    <Box className="card-form-box">
                        <FormProvider {...methods}>
                            <Card component="form" onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <FormTextField name="userId" label="User Id" fullWidth={true} disabled={true} sx={{ marginBottom: "14px" }} />
                                    <FormTextField type={showOldPassword ? "text" : "password"} name="oldPassword" label="Old Password" InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility on both fields"
                                                    onClick={handleClickShowOldPassword}
                                                    onMouseDown={handleMouseDownOldPassword}
                                                >
                                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }} disabled={processing || showUpdateFailure} sx={{ marginBottom: "14px" }} />
                                    <FormTextField type={showNewPassword ? "text" : "password"} name="newPassword" label="New Password" InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility on both fields"
                                                    onClick={handleClickShowNewPassword}
                                                    onMouseDown={handleMouseDownNewPassword}
                                                >
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }} disabled={processing || showUpdateFailure} />
                                </CardContent>
                                <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                    <Button type="button" variant="contained" size="large" onClick={handleClose} disableElevation={true}>
                                        Cancel
                                    </Button>
                                    <LoadingButton disabled={processing || showUpdateFailure} loading={processing} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success">
                                        Submit
                                    </LoadingButton>
                                </CardActions>
                                {
                                    showUpdateSuccess ?
                                        <Alert sx={{ justifyContent: "center" }} severity="success">
                                            Password change successful, logging you out. Log back in to keep using the service.
                                        </Alert> :
                                        null
                                }
                                {
                                    showUpdateFailure ?
                                        <Alert sx={{ justifyContent: "center" }} severity="error">
                                            Password change failed: {props.userUpdateFailMessage}
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

export default PasswordChangeForm;
