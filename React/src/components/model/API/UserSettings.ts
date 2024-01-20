import IUserSettings from "../interfaces/API/IUserSettings";
import { UserSettingsForRegistration } from "./UserSettingsForRegistration";


export class UserSettings extends UserSettingsForRegistration implements IUserSettings {
    Id?: string;
    UserId?: string;

    constructor(id: string, userId: string, countryName: string, currencyUnit: number, capacityUnit: number, distanceUnit: number, baseDiscount: number, minimumSpendForDiscount: number, lastPricePerCapacityUnit: number, accruedDiscount: number = 0, roundTo: number = 0) {
        super(countryName, currencyUnit, capacityUnit, distanceUnit, baseDiscount, minimumSpendForDiscount, lastPricePerCapacityUnit, accruedDiscount, roundTo);
        
        this.Id = id;
        this.UserId = userId;
    }
}