import axios, { AxiosResponse } from "axios";
import IUser from "../../interfaces/API/IUser";

// Config imports
import settingsJson from "./../../settings.json";
import IObjectUpdateResult from "../../interfaces/API/IObjectUpdateResult";
import IUserForRegistration from "../../interfaces/API/IUserForRegistration";
import IUserSettingsForRegistration from "../../interfaces/API/IUserSettingsForRegistration";
import IObjectAddResult from "../../interfaces/API/IObjectAddResult";

export class UserService {

    public static fetchUserById = async (userId: string): Promise<IUser> => {
        axios.defaults.withCredentials = true;
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

    public static postRegisterUser = async (user: IUserForRegistration, settings: IUserSettingsForRegistration): Promise<IObjectAddResult> => {
        let registerResult: IObjectAddResult = {};

        console.log(user);
        console.log(settings);

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
                    if (passwordChangeResult !== null) {
                        updateResult = {
                            resposeCode: 200,
                            message: "Password successfully changed",
                            objectType: "User",
                            updatedFields: ["password"]
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
