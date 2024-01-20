import axios, { AxiosResponse } from "axios";
import IUser from "../../components/model/interfaces/API/IUser";

// Config imports
import settingsJson from "./../../settings.json";
import IUserForRegistration from "../../components/model/interfaces/API/IUserForRegistration";
import IUserSettingsForRegistration from "../../components/model/interfaces/API/IUserSettingsForRegistration";
import IObjectAddResult from "../../components/model/interfaces/API/IObjectAddResult";
import IObjectUpdateResult from "../../components/model/interfaces/API/IObjectUpdateResult";
import IObjectDeleteResult from "../../components/model/interfaces/API/IObjectDeleteResult";
import IUserSettings from "../../components/model/interfaces/API/IUserSettings";

export class UserService {

    public static fetchUserSettingsByUserId = async (userId: string): Promise<IUserSettings> => {
        let userSettings: IUserSettings = {};

        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/UserSettings/FetchById`;

            return await axios.post(
                requestUrl,
                {
                    "Id": `${userId}`,
                    "UseUserId": true
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
                .then((fetchUserSettingsResult: AxiosResponse<any, any>) => {
                    userSettings = JSON.parse(JSON.stringify(fetchUserSettingsResult.data));
                    return userSettings;
                })
                .catch((err: any) => {
                    console.warn(err);
                    return userSettings;
                });
        }
        catch (error: any) {
            console.warn(error);
            return userSettings;
        }
    }

    public static fetchUserById = async (userId: string): Promise<IUser> => {
        let user: IUser = {};

        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User/FetchById`;

            return await axios.post(
                requestUrl,
                {
                    "Id": `${userId}`,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
                .then((fetchUserResult: AxiosResponse<any, any>) => {
                    user = JSON.parse(JSON.stringify(fetchUserResult.data));
                    return user;
                })
                .catch((err: any) => {
                    console.warn(err);
                    return user;
                });
        }
        catch (error: any) {
            console.warn(error);
            return user;
        }
    }

    public static postUpdateUserSettings = async (settings: IUserSettings): Promise<IObjectUpdateResult> => {
        let updateResult: IObjectUpdateResult = {};
        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User`;
            return await axios.put(
                requestUrl,
                {
                    "Id": `${settings.UserId}`,
                    "UseUserId": true,
                    "UpdatedUserSettings": {
                        "Id": ``,
                        "UserId": ``,
                        "CountryName": `${settings.CountryName}`,
                        "CurrencyUnit": settings.CurrencyUnit,
                        "CapacityUnit": settings.CapacityUnit,
                        "DistanceUnit": settings.DistanceUnit,
                        "BaseDiscount": settings.BaseDiscount,
                        "MinimumSpendForDiscount": settings.MinimumSpendForDiscount,
                        "LastPricePerCapacityUnit": settings.LastPricePerCapacityUnit,
                        "AccruedDiscount": settings.AccruedDiscount,
                        "RoundTo": settings.RoundTo
                    }
                },
                {
                    headers: {
                        "Accept": "application/json",
                    },
                    withCredentials: true
                },
            )
                .then((passwordChangeResult: AxiosResponse<any, any>) => {
                    if (passwordChangeResult !== null) {
                        updateResult = {
                            resposeCode: 200,
                            message: "Password successfully changed",
                            objectType: "UserSettings",
                            data: passwordChangeResult.data
                        };

                        return updateResult;
                    }
                    else {
                        updateResult = {
                            resposeCode: 404,
                            message: `Failed to update UserSettings for User: ${settings.UserId}`,
                            objectType: "User"
                        };

                        return updateResult;
                    }
                })
                .catch((err: any) => {
                    console.warn(err);
                    updateResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return updateResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            updateResult = {
                resposeCode: 500,
                message: "Failed to invoke Put action on UserSettings Controller"
            };

            return updateResult;
        }
    }

    public static postUpdateUser = async (user: IUser, userSettings: IUserSettings): Promise<IObjectUpdateResult> => {
        let updateResult: IObjectUpdateResult = {};
        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User`;
            return await axios.put(
                requestUrl,
                {
                    "Id": `${user.Id}`,
                    "UpdatedUser": {
                        "Id": ``,
                        "FirstName": `${user.FirstName}`,
                        "LastName": `${user.LastName}`,
                        "UserName": `${user.UserName}`,
                        "Email": `${user.Email}`,
                        "Password": ``,
                        "AssignedRoles": ``,
                        "RefreshToken": ``,
                        "RefreshTokenExpiryTime": null
                    },
                    "UpdatedUserSettings": {
                        "Id": "",
                        "UserId": "",
                        "CountryName": `${userSettings.CountryName}`,
                        "CurrencyUnit": userSettings.CurrencyUnit,
                        "CapacityUnit": userSettings.CapacityUnit,
                        "DistanceUnit": userSettings.DistanceUnit,
                        "BaseDiscount": userSettings.BaseDiscount,
                        "MinimumSpendForDiscount": userSettings.MinimumSpendForDiscount,
                        "LastPricePerCapacityUnit": userSettings.LastPricePerCapacityUnit,
                        "AccruedDiscount": userSettings.AccruedDiscount,
                        "RoundTo": userSettings.RoundTo
                    }
                },
                {
                    headers: {
                        "Accept": "application/json",
                    },
                    withCredentials: true
                },
            )
                .then((updateUserResult: AxiosResponse<any, any>) => {
                    if (updateUserResult !== null) {
                        const message: string = updateUserResult.status === 200 ? "User successfully updated" : updateUserResult.statusText;
                        updateResult = {
                            resposeCode: updateUserResult.status,
                            message: message,
                            objectType: "User",
                            data: updateUserResult.data
                        };

                        return updateResult;
                    }
                    else {
                        updateResult = {
                            resposeCode: 404,
                            message: `Failed to update User: ${user.Id}`,
                            objectType: "User"
                        };

                        return updateResult;
                    }
                })
                .catch((err: any) => {
                    console.warn(err);
                    updateResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return updateResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            updateResult = {
                resposeCode: 500,
                message: "Failed to invoke Put action on User Controller"
            };

            return updateResult;
        }
    }

    public static postDeleteUser = async (user: IUser): Promise<IObjectDeleteResult> => {
        let deleteResult: IObjectDeleteResult = {};
        if (user !== null && user !== undefined && user.Id !== null && user.Id !== undefined && user.Id !== "") {
            try {
                const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User`;
                return await axios.delete(
                    requestUrl,
                    {
                        data: {
                            "Id": `${user.Id}`
                        },
                        headers: {
                            "Accept": "application/json"
                        },
                        withCredentials: true
                    }
                )
                    .then((userRegistrationResult: AxiosResponse<any, any>) => {
                        if (userRegistrationResult !== null) {
                            deleteResult = {
                                resposeCode: 200,
                                message: "User successfully deleted",
                                objectType: "User"
                            };

                            return deleteResult;
                        }
                        else {
                            deleteResult = {
                                resposeCode: 404,
                                message: `Failed to delete new User; ${user.Email}`,
                                objectType: "User"
                            };

                            return deleteResult;
                        }
                    })
                    .catch((err: any) => {
                        console.warn(err);
                        deleteResult = {
                            resposeCode: err.response.request.status,
                            message: err.message
                        };
                        return deleteResult;
                    });
            }
            catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
                console.log(err);
                deleteResult = {
                    resposeCode: 500,
                    message: "Failed to invoke Delete action on User Controller"
                };

                return deleteResult;
            }
        }

        return deleteResult;
    }

    public static postRegisterUser = async (user: IUserForRegistration, settings: IUserSettingsForRegistration): Promise<IObjectAddResult> => {
        let registerResult: IObjectAddResult = {};

        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User/RegisterNewUser`;
            return await axios.post(
                requestUrl,
                {
                    "User": {
                        "FirstName": user.FirstName,
                        "LastName": user.LastName,
                        "UserName": user.UserName,
                        "Email": user.Email,
                        "Password": user.Password
                    },
                    "UserSettings": {
                        "CountryName": ``,
                        "CurrencyUnit": settings.CurrencyUnit,
                        "CapacityUnit": settings.CapacityUnit,
                        "DistanceUnit": settings.DistanceUnit,
                        "BaseDiscount": settings.BaseDiscount,
                        "MinimumSpendForDiscount": settings.MinimumSpendForDiscount,
                        "LastPricePerCapacityUnit": settings.LastPricePerCapacityUnit,
                        "AccruedDiscount": settings.AccruedDiscount,
                        "RoundTo": settings.RoundTo
                    }
                },
                {
                    headers: {
                        "Accept": "application/json",
                    },
                    withCredentials: true
                },
            )
                .then((userRegistrationResult: AxiosResponse<any, any>) => {
                    if (userRegistrationResult !== null) {
                        registerResult = {
                            resposeCode: 200,
                            message: "User successfully registered",
                            objectType: "User"
                        };

                        return registerResult;
                    }
                    else {
                        registerResult = {
                            resposeCode: 404,
                            message: `Failed to register new User; ${user.Email}`,
                            objectType: "User"
                        };

                        return registerResult;
                    }
                })
                .catch((err: any) => {
                    console.warn(err);
                    registerResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return registerResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            registerResult = {
                resposeCode: 500,
                message: "Failed to invoke RegisterNewUser action on User Controller"
            };

            return registerResult;
        }
    }

    public static postChangeUserPassword = async (userId: string, oldPassword: string, newPassword: string): Promise<IObjectUpdateResult> => {
        let updateResult: IObjectUpdateResult = {};
        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User/ChangePassword`;
            return await axios.post(
                requestUrl,
                {
                    "UserId": `${userId}`,
                    "OldPassword": `${oldPassword}`,
                    "NewPassword": `${newPassword}`
                },
                {
                    headers: {
                        "Accept": "application/json",
                    },
                    withCredentials: true
                },
            )
                .then((passwordChangeResult: AxiosResponse<any, any>) => {
                    const message: string = passwordChangeResult.status === 200 ? "Password successfully changed" : passwordChangeResult.statusText;
                    if (passwordChangeResult !== null) {
                        updateResult = {
                            resposeCode: passwordChangeResult.status,
                            message: message,
                            objectType: "User",
                            data: passwordChangeResult.data
                        };

                        return updateResult;
                    }
                    else {
                        updateResult = {
                            resposeCode: 404,
                            message: `Failed to change Password for User: ${userId}`,
                            objectType: "User"
                        };

                        return updateResult;
                    }
                })
                .catch((err: any) => {
                    console.warn(err);
                    updateResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return updateResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            updateResult = {
                resposeCode: 500,
                message: "Failed to invoke ChangePassword action on User Controller"
            };

            return updateResult;
        }
    };
}
