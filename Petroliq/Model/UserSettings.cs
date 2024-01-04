using static Petroliq_API.Model.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Petroliq_API.Model
{
    /// <summary>
    /// User Settings model
    /// </summary>
    public class UserSettings
    {
#pragma warning disable CS1591
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserId")]
        public string? UserId { get; set; }

        public CurrencyUnit CurrencyUnit { get; set; }
        public CapacityUnit CapacityUnit { get; set; }
        public DistanceUnit DistanceUnit { get; set; }
    }
#pragma warning restore CS1591
}
