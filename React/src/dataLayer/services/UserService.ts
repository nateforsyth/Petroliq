import axios, { AxiosResponse } from "axios";
import IUser from "../../interfaces/API/IUser";

// Config imports
import settingsJson from "./../../settings.json";

export class UserService {
    public static getUserById = async (bearerToken: string, userId: string) => {
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
}
