using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Petroliq_API.Model
{
    /// <summary>
    /// User model
    /// </summary>
    public class User
    {
#pragma warning disable CS1591
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
#pragma warning restore CS1591
}
