import axios, { AxiosResponse } from "axios";

// Config imports
import settingsJson from "./../../settings.json";
import IDecodedJwt from "../../interfaces/API/IDecodedJwt";
import { jwtDecode } from "jwt-decode";
import IAuthResult from "../../interfaces/API/IAuthResult";

export class AuthService {
    public static login = async (email: string, password: string): Promise<IAuthResult> => {
        let jwt: string = "";
        let decodedJwt: IDecodedJwt;
        let authResult: IAuthResult = {};

        const jwtResult: AxiosResponse<any, any> = await axios.post(`${settingsJson.apiBaseUrl}/api/Auth/Login?email=${email}&password=${password}`);

        if (jwtResult !== null && jwtResult.data !== null) {
            jwt = jwtResult.data;
            decodedJwt = jwtDecode<IDecodedJwt>(jwt, { header: false });

            authResult = {
                jwt: jwt,
                decodedJwt: decodedJwt
            };
        }

        return authResult;
    }
}
