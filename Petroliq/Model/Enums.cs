namespace Petroliq_API.Model
{
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
}
