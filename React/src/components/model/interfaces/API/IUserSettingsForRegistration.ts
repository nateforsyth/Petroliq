export default interface IUserSettingsForRegistration {
    CountryName?: string;
    CurrencyUnit?: number; // CurrencyUnit enum
    CapacityUnit?: number; // CapacityUnit enum
    DistanceUnit?: number; // DistanceUnit enum
    BaseDiscount?: number;
    MinimumSpendForDiscount?: number;
    LastPricePerCapacityUnit?: number;
    AccruedDiscount?: number;
    RoundTo?: number;
}
