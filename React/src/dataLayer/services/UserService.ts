import axios, { AxiosResponse } from "axios";
import IUser from "../../interfaces/API/IUser";

// Config imports
import settingsJson from "./../../settings.json";
import IObjectUpdateResult from "../../interfaces/API/IObjectUpdateResult";

export class UserService {
    public static getUserById = async (bearerToken: string, userId: string): Promise<IUser> => {
        let user: IUser = {};

        const userResult: AxiosResponse<any, any> = await axios.get(
            `${settingsJson.apiBaseUrl}/api/User/GetById/${userId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${bearerToken}`
                }
            }
        );

        if (userResult !== null && userResult.data !== null) {
            user = JSON.parse(JSON.stringify(userResult.data));
        }

        return user;
    }

    public static postChangeUserPassword = async (bearerToken: string, userId: string, oldPassword: string, newPassword: string): Promise<IObjectUpdateResult> => {
        console.log(`postChangeUserPassword invoked`);
        let updateResult: IObjectUpdateResult = {};
        try {
            const requestUrl: string = `${settingsJson.apiBaseUrl}/api/User/ChangePassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
            console.log(requestUrl);
            return await axios.post(
                requestUrl,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer: ${bearerToken}`
                    }
                }
            )
                .then((passwordChangeResult: AxiosResponse<any, any>) => {
                    console.log(passwordChangeResult);

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
