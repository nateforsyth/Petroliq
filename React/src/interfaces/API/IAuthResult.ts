import IDecodedJwt from "./IDecodedJwt";

export default interface IAuthResult {
    jwt?: string;
    decodedJwt?: IDecodedJwt;
    resposeCode?: number;
    message?: string;
}
