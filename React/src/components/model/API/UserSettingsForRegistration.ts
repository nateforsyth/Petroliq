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

    CurrentBatchId?: number;
    NextFillId?: number;
    
    IdealDiscount?: number;
    AvgCapacityUnitPerDistanceUnit?: number;
    MaxVolumeQualifyingForDiscount?: number;

    RoundTo?: number;
    RoundUnitCostTo?: number;

    constructor(countryName: string, currencyUnit: number, capacityUnit: number, distanceUnit: number, baseDiscount: number, minimumSpendForDiscount: number, lastPricePerCapacityUnit: number, currentBatchId: number, nextFillId: number, idealDiscount: number, avgCapacityUnitPerDistanceUnit: number, maxVolumeQualifyingForDiscount: number, accruedDiscount: number = 0, roundTo: number = 0, roundUnitCostTo: number = 3) {
        this.CountryName = countryName;
        this.CurrencyUnit = currencyUnit;
        this.CapacityUnit = capacityUnit;
        this.DistanceUnit = distanceUnit;
        this.BaseDiscount = baseDiscount;
        this.MinimumSpendForDiscount = minimumSpendForDiscount;
        this.LastPricePerCapacityUnit = lastPricePerCapacityUnit;
        this.AccruedDiscount = accruedDiscount;

        this.CurrentBatchId = currentBatchId;
        this.NextFillId = nextFillId;

        this.IdealDiscount = idealDiscount;
        this.AvgCapacityUnitPerDistanceUnit = avgCapacityUnitPerDistanceUnit;
        this.MaxVolumeQualifyingForDiscount = maxVolumeQualifyingForDiscount;

        this.RoundTo = roundTo;
        this.RoundUnitCostTo = roundUnitCostTo;
    }
}
