using static Petroliq_API.Application.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Petroliq_API.Model
{
    /// <summary>
    /// UserForRegistration Settings model
    /// </summary>
    public class UserSettings
    {
#pragma warning disable CS1591
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserId")]
        public string? UserId { get; set; }

        public string? CountryName { get; set; }

        public CurrencyUnit CurrencyUnit { get; set; }
        public CapacityUnit CapacityUnit { get; set; }
        public DistanceUnit DistanceUnit { get; set; }

        // TODO implement update of LastPricePerCapacityUnit when a new Fill has been added for this UserForRegistration
        public double BaseDiscount { get; set; }
        public double MinimumSpendForDiscount { get; set; }
        public double LastPricePerCapacityUnit { get; set; }
        public double AccruedDiscount { get; set; }

        public int RoundTo { get; set; }

        public override string ToString()
        {
            return $"{CapacityUnit}/{Convert.ToChar((int)CapacityUnit)}, {DistanceUnit}/{Convert.ToChar((int)DistanceUnit)}";
        }
    }
#pragma warning restore CS1591
}
