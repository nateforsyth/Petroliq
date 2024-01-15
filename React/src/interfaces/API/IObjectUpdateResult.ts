export default interface IObjectUpdateResult {
    resposeCode?: number;
    message?: string;

    objectType?: string;
    updatedFields?: string[];
}
