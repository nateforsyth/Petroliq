import IDecodedJwt from "./IDecodedJwt";

export default interface IAuthResult {
    jwt?: string;
    refreshToken?: string;
    jwtExpiry?: string;
    decodedJwt?: IDecodedJwt;
    resposeCode?: number;
    message?: string;
}
