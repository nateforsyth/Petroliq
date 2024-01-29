import IDecodedJwt from "./IDecodedJwt";

export default interface IAuthResult {
    userId?: string;
    jwtExpiry?: string;
    resposeCode?: number;
    message?: string;
}
