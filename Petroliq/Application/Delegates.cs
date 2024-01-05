namespace Petroliq_API.Application
{
#pragma warning disable CS1591
    public class Delegates
    {
        public static class Calculations
        {
            public static readonly CalcThree LitresToBuy = (dollarsToBuy, pricePerLitre, discountPerLitre) => dollarsToBuy / (pricePerLitre - discountPerLitre);
        }

        public delegate double CalcTwo(double first, double second);
        public delegate double CalcThree(double first, double second, double third);
    }
#pragma warning restore CS1591
}
