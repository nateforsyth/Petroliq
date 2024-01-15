import axios, { AxiosResponse } from "axios";

// Config imports
import settingsJson from "./../../settings.json";
import IDecodedJwt from "../../interfaces/API/IDecodedJwt";
import {jwtDecode} from "jwt-decode";
import IAuthResult from "../../interfaces/API/IAuthResult";
import { User } from "../../components/model/API/User";

export class AuthService {

    public static getBrowserAuthToken = (): string => {

        const currentBearerToken: string | null = localStorage.getItem("user");

        console.log(`getBrowserAuthToken: ${currentBearerToken}`);

        if (currentBearerToken !== null) {
            return currentBearerToken;
        }
        else {
            return "";
        }
    }

    public static login = async (email: string, password: string): Promise<IAuthResult> => {
        
        let jwt: string = "";
        let decodedJwt: IDecodedJwt;
        let authResult: IAuthResult = {};
        const requestUrl: string = `${settingsJson.apiBaseUrl}/api/Auth/Login?email=${email}&password=${password}`;

        try {
            return await axios.post(requestUrl)
            .then((jwtResult: AxiosResponse<any, any>) => {
                if (jwtResult !== null && jwtResult.data !== null) {
                    jwt = jwtResult.data;
                    decodedJwt = jwtDecode<IDecodedJwt>(jwt, { header: false });
        
                    authResult = {
                        jwt: jwt,
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
