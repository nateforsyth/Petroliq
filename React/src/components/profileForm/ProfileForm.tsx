import * as React from "react";
import IProfileFormProps from "./IProfileFormProps";
import { Box, Button, ButtonGroup, Card, CardActions, CardContent, IconButton, InputAdornment, TextField, TextFieldProps, Typography } from "@mui/material";

import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormSelectProps {
    name: string;
    label: string;
}

interface FormInputs {
    FirstName?: string | null;
    LastName?: string | null;
    UserName?: string | null;
    Email?: string | null;
    Password?: string | null; // TODO implement password changing functionality

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

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const defaultValues: FormInputs = {
        FirstName: props.user?.FirstName,
        LastName: props.user?.LastName,
        UserName: props.user?.UserName,
        Email: props.user?.Email,
        Password: props.user?.Password,
        Id: props.user?.Id,
        AssignedRoles: props.user?.AssignedRoles
    };

    const methods = useForm<FormInputs>({
        resolver: zodResolver(LoginSchema),
        defaultValues
    });

    const onSubmit: SubmitHandler<FormInputs> = async (
        data: FormInputs
    ) => {
        setSavingData(true);
        // console.log(`onSubmit invoked`, data);
        // props.loginCallback(data.username, data.password);
        methods.reset();
    };

    let htmlElement: JSX.Element =
        <div>
            <h4>View and update your profile and settings</h4>
            <Box className="login-itemsbox" sx={{ width: 500 }}>
                <Box className="card-form-box">
                    <FormProvider {...methods}>
                        <Card component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormTextField name="FirstName" label="First name" fullWidth={true} disabled={savingData} sx={{ marginBottom: "14px" }} />
                                <FormTextField name="LastName" label="Last name" fullWidth={true} disabled={savingData} sx={{ marginBottom: "14px" }} />
                                <FormTextField name="UserName" label="User name" fullWidth={true} disabled={savingData} sx={{ marginBottom: "14px" }} />
                                <FormTextField name="Email" label="Email" fullWidth={true} disabled={savingData} sx={{ marginBottom: "14px" }} />
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
                                    }} disabled={savingData} />
                                <hr />
                                <FormTextField name="Id" label="Id" fullWidth={true} disabled={true} sx={{ marginBottom: "14px" }} />
                                <FormTextField name="AssignedRoles" label="Assigned roles" fullWidth={true} disabled={true} sx={{ marginBottom: "14px" }} />
                            </CardContent>
                            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                <Button type="button" variant="contained" size="large" disableElevation={true}>
                                    Cancel
                                </Button>
                                <LoadingButton loading={savingData} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="success">
                                    Save
                                </LoadingButton>
                            </CardActions>
                        </Card>
                    </FormProvider>
                </Box>
            </Box>
        </div>;

    return htmlElement;
}

export default ProfileForm;
