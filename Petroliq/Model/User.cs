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

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public static List<string> ValidateFieldUpdates(User original, User updated)
        {
            List<string> updatedFields = [];

            if (original != null && updated != null)
            {
                if (!string.IsNullOrEmpty(original.FirstName) && !original.FirstName.Equals(updated.FirstName))
                {
                    updatedFields.Add("FirstName");
                }

                if (!string.IsNullOrEmpty(original.LastName) && !original.LastName.Equals(updated.LastName))
                {
                    updatedFields.Add("LastName");
                }

                if (!string.IsNullOrEmpty(original.UserName) && !original.UserName.Equals(updated.UserName))
                {
                    updatedFields.Add("UserName");
                }

                if (!string.IsNullOrEmpty(original.Email) && !original.Email.Equals(updated.Email))
                {
                    updatedFields.Add("Email");
                }

                if (!string.IsNullOrEmpty(original.Password) && !original.Password.Equals(updated.Password))
                {
                    updatedFields.Add("Password");
                }

                if (!string.IsNullOrEmpty(original.AssignedRoles) && !original.AssignedRoles.Equals(updated.AssignedRoles))
                {
                    updatedFields.Add("AssignedRoles");
                }
            }

            return updatedFields;
        }
    }
#pragma warning restore CS1591
}
