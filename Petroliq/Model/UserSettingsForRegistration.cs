using static Petroliq_API.Application.Enums;

namespace Petroliq_API.Model
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
        public double BaseDiscount { get; set; }

        /// <summary>
        /// Minimum spend for discount
        /// </summary>
        public double MinimumSpendForDiscount { get; set; }

        /// <summary>
        /// Last price per capacity unit
        /// </summary>
        public double LastPricePerCapacityUnit { get; set; }

        /// <summary>
        /// Accrued Discount
        /// </summary>
        public double AccruedDiscount { get; set; }

        /// <summary>
        /// Number of digits to round calculations to
        /// </summary>
        public int RoundTo { get; set; }
    }
}
