export default interface IDecodedJwt {
    Id: string;
    aud: string;
    email: string;
    exp: number;
    role: string;
    iss: string;
    jti: string;
    sub: string;
}
