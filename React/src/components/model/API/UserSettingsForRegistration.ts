import IUserSettingsForRegistration from "../interfaces/API/IUserSettingsForRegistration";

export class UserSettingsForRegistration implements IUserSettingsForRegistration {
    CountryName?: string;
    CurrencyUnit?: number; // CurrencyUnit enum
    CapacityUnit?: number; // CapacityUnit enum
    DistanceUnit?: number; // DistanceUnit enum
    BaseDiscount?: number;
    MinimumSpendForDiscount?: number;
    LastPricePerCapacityUnit?: number;
    AccruedDiscount?: number;
    RoundTo?: number;

    constructor(countryName: string, currencyUnit: number, capacityUnit: number, distanceUnit: number, baseDiscount: number, minimumSpendForDiscount: number, lastPricePerCapacityUnit: number, accruedDiscount: number = 0, roundTo: number = 0) {
        this.CountryName = countryName;
        this.CurrencyUnit = currencyUnit;
        this.CapacityUnit = capacityUnit;
        this.DistanceUnit = distanceUnit;
        this.BaseDiscount = baseDiscount;
        this.MinimumSpendForDiscount = minimumSpendForDiscount;
        this.LastPricePerCapacityUnit = lastPricePerCapacityUnit;
        this.AccruedDiscount = accruedDiscount;
        this.RoundTo = roundTo;
    }
}
