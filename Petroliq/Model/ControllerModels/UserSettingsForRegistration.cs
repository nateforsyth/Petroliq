using static Shared.Enums;

namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Intermediary User Settings object specifically for Registration, doesn't include Id fields
    /// </summary>
    public class UserSettingsForRegistration
    {
        /// <summary>
        /// Country name
        /// </summary>
        public string? CountryName { get; set; }

        /// <summary>
        /// CurrencyUnit enumeration, use the int representation of the character: Dollar|'$'|36, Pound|'£'|163, Yen|'¥'|165, Euro|'€'|8364, Peso|'₱'|8369
        /// </summary>
        public CurrencyUnit CurrencyUnit { get; set; }

        /// <summary>
        /// CapacityUnit enumeration, use the int representation of the character: Gallon|'g'|103, Litre|'ℓ'|8467
        /// </summary>
        public CapacityUnit CapacityUnit { get; set; }

        /// <summary>
        /// DistanceUnit enumeration, use the int representation of the character; Kilometers|'k'|107, Miles|'m'|109
        /// </summary>
        public DistanceUnit DistanceUnit { get; set; }

        /// <summary>
        /// Base discount
        /// </summary>
        public decimal BaseDiscount { get; set; }

        /// <summary>
        /// Minimum spend for discount
        /// </summary>
        public decimal MinimumSpendForDiscount { get; set; }

        /// <summary>
        /// Last price per capacity unit
        /// </summary>
        public decimal LastPricePerCapacityUnit { get; set; }

        /// <summary>
        /// Accrued Discount
        /// </summary>
        public decimal AccruedDiscount { get; set; }

        /// <summary>
        /// Number of digits to round calculations to
        /// </summary>
        public int RoundTo { get; set; }

        /// <summary>
        /// Number of digits to round fuel unit cost to
        /// </summary>
        public int RoundUnitCostTo { get; set; }

        /// <summary>
        /// Ideal discount value; this indicates the maximum that the fuel company regularly offers, or the one that the user regularly tries to target for redemption
        /// </summary>
        public decimal IdealDiscount { get; set; }

        /// <summary>
        /// Current Batch Id; identifies the Key for batches of Fills for aggregation
        ///     e.g. 3|4 = 3rd batch, 4th fill; CurrentBatchId = 3
        /// </summary>
        public int CurrentBatchId { get; set; }

        /// <summary>
        /// Next Fill Id; identifies the Value for batches of Fills for aggregation
        ///     e.g. 3|4 = 3rd batch, 4th fill; NextFillId = 4
        /// </summary>
        public int NextFillId { get; set; }

        /// <summary>
        /// Average driving Capacity Unit per Distance Unit
        ///     e.g. 15.1 kilometers per litre
        ///     e.g. 29.2 miles per gallon
        /// </summary>
        public decimal AvgCapacityUnitPerDistanceUnit { get; set; }

        /// <summary>
        /// Maximum volume of fuel that qualifies for spending of an accumulated discount
        ///     Most schemes specify a maximum amount of fuel that can be purchased when using your accumulated discount
        ///     e.g. 50 litres
        /// </summary>
        public decimal MaxVolumeQualifyingForDiscount { get; set; }
    }
}
