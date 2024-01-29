import axios, { AxiosResponse } from "axios";

// Config imports
import settingsJson from "./../../settings.json";
import IDecodedJwt from "../../components/model/interfaces/API/IDecodedJwt";
import IAuthResult from "../../components/model/interfaces/API/IAuthResult";

export class AuthService {

    public static getBrowserUserId = (): string => {
        const currentUserId: string | null = localStorage.getItem("userId");
        if (currentUserId !== null) {
            return currentUserId;
        }
        else {
            return "";
        }
    }

    public static getBrowserAuthTokenExpiry = (): string => {
        const currentBearerTokenExpiry: string | null = localStorage.getItem("tokenExpiry");
        if (currentBearerTokenExpiry !== null) {
            return currentBearerTokenExpiry;
        }
        else {
            return "";
        }
    }

    public static refreshToken = async (principalId: string): Promise<IAuthResult> => {

        console.log(`refreshToken, principalId: ${principalId}`);

        // let jwt: string = "";
        let userId: string = "";
        let refreshTokenExpiry: string = "";
        let decodedJwt: IDecodedJwt;
        let authResult: IAuthResult = {};
        const requestUrl: string = `${settingsJson.apiBaseUrl}/api/Auth/Refresh`;

        try {
            return await axios.post(
                requestUrl,
                {
                    "PrincipalId": `${principalId}`
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
                .then((jwtResult: AxiosResponse<any, any>) => {
                    if (jwtResult !== null && jwtResult.data !== null) {
                        userId = jwtResult.data.UserId;
                        refreshTokenExpiry = jwtResult.data.Expiration;

                        authResult = {
                            userId: userId,
                            jwtExpiry: refreshTokenExpiry,
                            resposeCode: 200
                        };

                        return authResult;
                    }
                    else {
                        authResult = {
                            resposeCode: 500,
                            message: "Login action failed"
                        };
                        return authResult;
                    }
                })
                .catch((err: any) => {
                    authResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return authResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            authResult = {
                resposeCode: 500,
                message: "Login action failed"
            };
            return authResult;
        }
    }

    public static login = async (email: string, password: string): Promise<IAuthResult> => {
        let userId: string = "";
        let tokenExpiry: string = "";
        let authResult: IAuthResult = {};
        const requestUrl: string = `${settingsJson.apiBaseUrl}/api/Auth/Login`;

        try {
            return await axios.post(
                requestUrl,
                {
                    "Email": `${email}`,
                    "Password": `${password}`
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
                .then((jwtResult: AxiosResponse<any, any>) => {
                    if (jwtResult !== null && jwtResult.data !== null) {
                        userId = jwtResult.data.UserId;
                        tokenExpiry = jwtResult.data.Expiration;

                        authResult = {
                            userId: userId,
                            jwtExpiry: tokenExpiry,
                            resposeCode: 200
                        };

                        return authResult;
                    }
                    else {
                        authResult = {
                            resposeCode: 500,
                            message: "Login action failed"
                        };
                        return authResult;
                    }
                })
                .catch((err: any) => {
                    authResult = {
                        resposeCode: err.response.request.status,
                        message: err.message
                    };
                    return authResult;
                });
        }
        catch (err: any) { // TODO front-end auth errors are displayed in the login form, log them in the back end
            console.log(err);
            authResult = {
                resposeCode: 500,
                message: "Login action failed"
            };
            return authResult;
        }
    }
}
