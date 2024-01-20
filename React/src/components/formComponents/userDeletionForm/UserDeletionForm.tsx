import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardActions,
    Typography,
    Alert
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";

import Backdrop from '@mui/material/Backdrop';
import IUserDeletionFormProps from "./IUserDeletionFormProps";

interface LoginFormInputs { }

const LoginSchema: z.ZodSchema<LoginFormInputs> = z.object({});

const Heading = () => {
    return (
        <div>
            <h2>This is irreversible!</h2>
            <h3>Are you sure you want to delete your account?</h3>
        </div>
    );
};

const UserDeletionForm: React.FC<IUserDeletionFormProps> = (props) => {

    const [open, setOpen] = React.useState(true);
    const [processing, setProcessing] = React.useState<boolean>(false);

    const [showDeletionSuccess, setShowDeletionSuccess] = React.useState<boolean>(false);
    const [showDeletionFailure, setShowDeletionFailure] = React.useState<boolean>(false);

    React.useEffect(() => {
        setProcessing(false);
        setShowDeletionSuccess(props.deletionSuccess);
    }, [props.deletionSuccess]);

    React.useEffect(() => {
        setProcessing(false);
        setShowDeletionFailure(props.deletionFail);
    }, [props.deletionFail]);

    const handleClose = () => {
        props.accountDeletionCancelCallback(false);
        setOpen(false);
    };

    const defaultValues: LoginFormInputs = {};

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
        props.userDeletionCallback();
        methods.reset();
    };

    const titleContainerStyle: React.CSSProperties = {
        marginBottom: "8px"
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {
                <Box className="login-itemsbox" sx={{ width: 500, padding: "15px", backgroundColor: "error.dark", filter: "drop-shadow(black 5px 5px 5px)" }}>
                    <Box className="title-box">
                        {/* <Typography sx={{ marginBottom: "8px" }}>
                            <Heading />
                        </Typography> */}
                        <div style={titleContainerStyle}>
                            <h2>This is irreversible!</h2>
                            <h3>Are you sure you want to delete your account?</h3>
                        </div>
                    </Box>
                    <Box className="card-form-box">
                        <FormProvider {...methods}>
                            <Card component="form" onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
                                <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: "14px" }}>
                                    <Button type="button" variant="outlined" size="large" onClick={handleClose} disableElevation={true} color="info">
                                        Cancel
                                    </Button>
                                    <LoadingButton disabled={processing || showDeletionFailure} loading={processing} loadingPosition="start" startIcon={<SaveIcon />} type="submit" variant="contained" size="large" disableElevation={true} color="warning">
                                        Yes
                                    </LoadingButton>
                                </CardActions>
                                {
                                    showDeletionSuccess ?
                                        <Alert sx={{ justifyContent: "center" }} severity="success">
                                            Account deletion successful, logging you out.
                                        </Alert> :
                                        null
                                }
                                {
                                    showDeletionFailure ?
                                        <Alert sx={{ justifyContent: "center" }} severity="error">
                                            Account deletion failed: {props.userDeletionFailMessage}
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

export default UserDeletionForm;
