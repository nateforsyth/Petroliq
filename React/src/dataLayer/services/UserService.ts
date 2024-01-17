import axios, { AxiosResponse } from "axios";
import IUser from "../../interfaces/API/IUser";

// Config imports
import settingsJson from "./../../settings.json";
import IObjectUpdateResult from "../../interfaces/API/IObjectUpdateResult";

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
                message: "Failed to perform ChangePassword action on User Controller"
            };

            return updateResult;
        }
    };
}
