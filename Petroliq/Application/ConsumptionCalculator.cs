using Petroliq_API.Model;
using static Petroliq_API.Application.Delegates;
using static Petroliq_API.Application.Enums;

namespace Petroliq_API.Application
{
#pragma warning disable CS1591
    public class ConsumptionCalculator(UserSettings settings, double kmMiFactor, double miKmFactor, double ltrGalFactor, int roundTo)
    {
        readonly CalcTwo DistancePerUnit = (a, b) => a / b;

        public CapacityUnit CapacityUnit { get; set; } = settings.CapacityUnit;
        public CapacityUnit AltCapacityUnit { get; set; } = settings.CapacityUnit == CapacityUnit.Litre ? CapacityUnit.Gallon : CapacityUnit.Litre;

        public DistanceUnit DistanceUnit { get; set; } = settings.DistanceUnit;
        public DistanceUnit AltDistanceUnit { get; set; } = settings.DistanceUnit == DistanceUnit.Kilometers ? DistanceUnit.Miles : DistanceUnit.Kilometers;

        public double CalculatedCost { get; set; }

        public double DistanceTravelled { get; set; }
        public double AltDistanceTravelled { get; set; }
        public double StartOdoReading { get; set; }
        public double EndOdoReading { get; set; }
        public double CapacityConsumed { get; set; }
        public double AltCapacityConsumed { get; set; }
        public double Consumption { get; set; }
        public double AlternativeConsumption { get; set; }

        public void SetFillProperties(double startOdo, double endOdo, double volume, double capacityUnitPrice = 0)
        {
            StartOdoReading = startOdo;
            EndOdoReading = endOdo;
            CapacityConsumed = volume;
            DistanceTravelled = endOdo - startOdo;

            if (capacityUnitPrice > 0)
            {
                CalculatedCost = volume * capacityUnitPrice;
                settings.LastPricePerCapacityUnit = capacityUnitPrice;
            }
            else
            {
                CalculatedCost = volume * settings.LastPricePerCapacityUnit;
            }            
        }

        public double CalcAltDistanceMeasure(DistanceUnit unit, double distance)
        {
            if (unit == DistanceUnit.Kilometers)
            {
                return Math.Round(distance / kmMiFactor, roundTo);
            }
            else
            {
                return Math.Round(distance / miKmFactor, roundTo);
            }
        }

        public void KmPerLtr()
        {
            AltDistanceTravelled = Math.Round(DistanceTravelled / kmMiFactor, roundTo);
            AltCapacityConsumed = Math.Round(CapacityConsumed / ltrGalFactor, roundTo);

            CalculateConsumption();
        }

        public void MiPerGal()
        {
            AltDistanceTravelled = Math.Round(DistanceTravelled / miKmFactor, roundTo);
            AltCapacityConsumed = Math.Round(CapacityConsumed * ltrGalFactor, roundTo);

            CalculateConsumption();
        }

        private void CalculateConsumption()
        {
            Consumption = Math.Round(DistancePerUnit(DistanceTravelled, CapacityConsumed), roundTo);
            AlternativeConsumption = Math.Round(DistancePerUnit(AltDistanceTravelled, AltCapacityConsumed), roundTo);
        }

        public string StartOdoStr()
        {
            return $"{StartOdoReading} {DistanceUnit}";
        }

        public string AltStartOdoStr(DistanceUnit originalUnit)
        {
            return $"{CalcAltDistanceMeasure(originalUnit, StartOdoReading)} {AltDistanceUnit}";
        }

        public string EndOdoStr()
        {
            return $"{EndOdoReading} {DistanceUnit}";
        }

        public string AltEndOdoStr(DistanceUnit originalUnit)
        {
            return $"{CalcAltDistanceMeasure(originalUnit, EndOdoReading)} {AltDistanceUnit}";
        }

        public string DistanceTravelledStr()
        {
            return $"{DistanceTravelled} {DistanceUnit}";
        }

        public string AltDistanceTravelledStr()
        {
            return $"{AltDistanceTravelled} {AltDistanceUnit}";
        }

        public string CapacityConsumedStr()
        {
            return $"{CapacityConsumed} {CapacityUnit}";
        }

        public string AltCapacityConsumedStr()
        {
            return $"{AltCapacityConsumed} {AltCapacityUnit}";
        }

        public string ConsumptionStr()
        {
            return $"{Consumption} {DistanceUnit}/{CapacityUnit}";
        }

        public string AltConsumptionStr()
        {
            return $"{AlternativeConsumption} {AltDistanceUnit}/{AltCapacityUnit}";
        }

        public override string ToString()
        {
            return $"You've travelled {DistanceTravelled} {DistanceUnit} ({AltDistanceTravelled} {AltDistanceUnit}) and consumed {CapacityConsumed} {CapacityUnit} ({AltCapacityConsumed} {AltCapacityUnit}) in doing so, which is {Consumption} {DistanceUnit}/{CapacityUnit} ({AlternativeConsumption} {AltDistanceUnit}/{AltCapacityUnit}). This cost you {Convert.ToChar((int)settings.CurrencyUnit)}{Math.Round(CalculatedCost, settings.RoundTo)} ({CapacityConsumed}{Convert.ToChar(CapacityUnit)} x {Convert.ToChar((int)settings.CurrencyUnit)}{Math.Round(settings.LastPricePerCapacityUnit, settings.RoundTo)}). Your new accrued discount is {Convert.ToChar((int)settings.CurrencyUnit)}{settings.AccruedDiscount}";
        }
    }
#pragma warning restore CS1591
}
