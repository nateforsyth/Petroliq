using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Petroliq_API.Model
{
#pragma warning disable CS1591
    /// <summary>
    /// UserForRegistration model
    /// </summary>
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? AssignedRoles { get; set; }
    }
#pragma warning restore CS1591
}
