namespace Petroliq_API.Model
{
#pragma warning disable CS1591
    public class Enums
    {
        public enum CurrencyUnit
        {
            AUD = '$',
            GBP = '£', // 0163
            EUR = '€', // 0128
            JPY = '¥',
            PHP = '₱',
            NZD = '$',
            USD = '$',
        }

        public enum CapacityUnit
        {
            Litre = 'ℓ',
            Gallon = '㏿'
        }

        public enum DistanceUnit
        {
            Kilometers = '㎞',
            Miles = 'm'
        }
    }
#pragma warning restore CS1591
}
