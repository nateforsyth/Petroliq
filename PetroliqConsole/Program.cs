using Petroliq_API.Application;
using Petroliq_API.Model;
using SharpCompress.Common;
using static Petroliq_API.Application.Enums;

namespace PetroliqConsole
{
    internal class Program
    {
        // from app settings
        static readonly double KM_MI_FACTOR = 1.60934;
        static readonly double MI_KM_FACTOR = 0.62;
        static readonly double LTR_GAL_FACTOR = 4.54609;

        static void Main(string[] args)
        {
            var settings = new UserSettings
            {
                CountryName = "New Zealand",
                CurrencyUnit = CurrencyUnit.Dollar,
                CapacityUnit = CapacityUnit.Litre,
                DistanceUnit = DistanceUnit.Kilometers,
                BaseDiscount = 0.06f,
                MinimumSpendForDiscount = 40f,
                LastPricePerCapacityUnit = 2.659f,
                AccruedDiscount = 0.36f,
                RoundTo = 2
            };

            // Fuel Discount Calculator
            Console.WriteLine("-Fuel Discount Calculator-");
            double ltrToBuy = Delegates.Calculations.LitresToBuy(settings.MinimumSpendForDiscount, settings.LastPricePerCapacityUnit, settings.AccruedDiscount);

            Console.WriteLine($"\r\nTo spend {Convert.ToChar((int)settings.CurrencyUnit)}{Math.Round(settings.MinimumSpendForDiscount, 2)}");
            Console.WriteLine($"Using your discount of {Convert.ToChar((int)settings.CurrencyUnit)}{Math.Round(settings.AccruedDiscount, settings.RoundTo)} per {Convert.ToChar((int)settings.CapacityUnit)}");
            Console.WriteLine($"You must pump {Convert.ToChar((int)settings.CurrencyUnit)}{Math.Round(ltrToBuy * settings.LastPricePerCapacityUnit, 2)} into your vehicle");
            Console.WriteLine($"Which will show up as {Math.Round(ltrToBuy, 2)}{Convert.ToChar((int)settings.CapacityUnit)} on the pump");

            Console.WriteLine($"\r\nCalculated using the following country specific units of measure:\r\n\t{settings.CountryName}\r\n\t{settings}\r\n\r\n");

            // Consumption Calculator

            Console.WriteLine("-Consumption Calculator-");
            ConsumptionCalculator c = new(settings, KM_MI_FACTOR, MI_KM_FACTOR, LTR_GAL_FACTOR, settings.RoundTo);

            //string unit = "km"; // km/mi
            double start = 78241, end = 78711, fuelUsed = 78; // 120100, 120306/120228, 27/6

            c.SetFillProperties(start, end, fuelUsed);

            if (settings.DistanceUnit == DistanceUnit.Kilometers)
            {
                c.KmPerLtr();
            }
            else
            {
                c.MiPerGal();
            }

            Console.WriteLine("\r\n" + c.ToString() + "\r\n");
            Console.WriteLine($"Start odo = {c.StartOdoStr()}");
            Console.WriteLine($"End odo = {c.EndOdoStr()}");
            Console.WriteLine($"Alt start odo = {c.AltStartOdoStr(settings.DistanceUnit)}");
            Console.WriteLine($"Alt end odo = {c.AltEndOdoStr(settings.DistanceUnit)}");
            Console.WriteLine($"Distance travelled = {c.DistanceTravelledStr()}");
            Console.WriteLine($"Alt distance travelled = {c.AltDistanceTravelledStr()}");
            Console.WriteLine($"Volume of fuel consumed = {c.CapacityConsumedStr()}");
            Console.WriteLine($"Alt volume of fuel consumed = {c.AltCapacityConsumedStr()}");
            Console.WriteLine($"{c.ConsumptionStr()}");
            Console.WriteLine($"{c.AltConsumptionStr()}");

            Console.Read();
        }
    }    
}
