export default interface IUserSettingsForRegistration {
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
}
