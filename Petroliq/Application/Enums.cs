namespace Petroliq_API.Application
{
#pragma warning disable CS1591
    public class Enums
    {
        public enum CurrencyUnit
        {
            Dollar = '$',
            Pount = '£', // 0163
            Euro = '€', // 0128
            Yen = '¥',
            Peso = '₱'
        }

        public enum CapacityUnit
        {
            Litre = 'ℓ',
            Gallon = '㏿'
        }

        public enum DistanceUnit
        {
            Kilometers = '㎞', // TODO find a better character for km as this one is rendering as ? in the console
            Miles = 'm'
        }
    }
#pragma warning restore CS1591
}
