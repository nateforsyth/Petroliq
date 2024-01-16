import axios, { AxiosResponse } from "axios";

// Config imports
import settingsJson from "./../../settings.json";
import IDecodedJwt from "../../interfaces/API/IDecodedJwt";
import { jwtDecode } from "jwt-decode";
import IAuthResult from "../../interfaces/API/IAuthResult";
import { User } from "../../components/model/API/User";

export class AuthService {

    public static getBrowserAuthToken = (): string => { // TODO replace getBrowserAuthToken with HttpOnly cookie

        const currentBearerToken: string | null = localStorage.getItem("token");

        console.log(`getBrowserAuthToken: ${currentBearerToken}`);

        if (currentBearerToken !== null) {
            return currentBearerToken;
        }
        else {
            return "";
        }
    }

    public static getBrowserAuthTokenExpiry = (): string => { // TODO replace getBrowserAuthTokenExpiry with HttpOnly cookie

        const currentBearerTokenExpiry: string | null = localStorage.getItem("tokenExpiry");

        console.log(`getBrowserAuthTokenExpiry: ${currentBearerTokenExpiry}`);

        if (currentBearerTokenExpiry !== null) {
            return currentBearerTokenExpiry;
        }
        else {
            return "";
        }
    }

    public static getBrowserRefreshToken = (): string => { // TODO replace getBrowserRefreshToken with HttpOnly cookie

        const currentRefreshToken: string | null = localStorage.getItem("refresh");

        console.log(`getBrowserRefreshToken: ${currentRefreshToken}`);

        if (currentRefreshToken !== null) {
            return currentRefreshToken;
        }
        else {
            return "";
        }
    }

    public static refreshToken = async (currentAccessToken: string, currentRefreshToken: string): Promise<IAuthResult> => {

        let jwt: string = "";
        let refreshToken: string = "";
        let refreshTokenExpiry: string = "";
        let decodedJwt: IDecodedJwt;
        let authResult: IAuthResult = {};
        const requestUrl: string = `${settingsJson.apiBaseUrl}/api/Auth/Refresh`;

        try {
            return await axios.post(
                requestUrl, 
                {
                    "AccessToken": `${currentAccessToken}`,
                    "RefreshToken": `${currentRefreshToken}`
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
                .then((jwtResult: AxiosResponse<any, any>) => {
                    if (jwtResult !== null && jwtResult.data !== null) {
                        console.log(jwtResult.data);
                        jwt = jwtResult.data.Token;
                        refreshToken = jwtResult.data.RefreshToken;
                        refreshTokenExpiry = jwtResult.data.Expiration;
                        decodedJwt = jwtDecode<IDecodedJwt>(jwt, { header: false });

                        authResult = {
                            jwt: jwt,
                            refreshToken: refreshToken,
                            jwtExpiry: refreshTokenExpiry,
                            decodedJwt: decodedJwt,
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

        let jwt: string = "";
        let refreshToken: string = "";
        let refreshTokenExpiry: string = "";
        let decodedJwt: IDecodedJwt;
        let authResult: IAuthResult = {};
        const requestUrl: string = `${settingsJson.apiBaseUrl}/api/Auth/Login`; // ?email=${email}&password=${password}

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
                    }
                }
            )
                .then((jwtResult: AxiosResponse<any, any>) => {
                    if (jwtResult !== null && jwtResult.data !== null) {
                        console.log(jwtResult.data);
                        jwt = jwtResult.data.Token;
                        refreshToken = jwtResult.data.RefreshToken;
                        refreshTokenExpiry = jwtResult.data.Expiration;
                        decodedJwt = jwtDecode<IDecodedJwt>(jwt, { header: false });

                        authResult = {
                            jwt: jwt,
                            refreshToken: refreshToken,
                            jwtExpiry: refreshTokenExpiry,
                            decodedJwt: decodedJwt,
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
