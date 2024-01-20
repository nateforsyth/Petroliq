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

        public static List<string> ValidateFieldUpdates(UserSettings original, UserSettings updated)
        {
            List<string> updatedFields = [];

            if (original != null && updated != null)
            {
                if (!string.IsNullOrEmpty(original.CountryName) && !original.CountryName.Equals(updated.CountryName))
                {
                    updatedFields.Add("CountryName");
                }

                if (!original.CurrencyUnit.Equals(updated.CurrencyUnit))
                {
                    updatedFields.Add("CurrencyUnit");
                }

                if (!original.CapacityUnit.Equals(updated.CapacityUnit))
                {
                    updatedFields.Add("CapacityUnit");
                }

                if (!original.DistanceUnit.Equals(updated.DistanceUnit))
                {
                    updatedFields.Add("DistanceUnit");
                }

                if (!original.BaseDiscount.Equals(updated.BaseDiscount))
                {
                    updatedFields.Add("BaseDiscount");
                }

                if (!original.MinimumSpendForDiscount.Equals(updated.MinimumSpendForDiscount))
                {
                    updatedFields.Add("MinimumSpendForDiscount");
                }

                if (!original.LastPricePerCapacityUnit.Equals(updated.LastPricePerCapacityUnit))
                {
                    updatedFields.Add("LastPricePerCapacityUnit");
                }

                if (!original.AccruedDiscount.Equals(updated.AccruedDiscount))
                {
                    updatedFields.Add("AccruedDiscount");
                }

                if (!original.RoundTo.Equals(updated.RoundTo))
                {
                    updatedFields.Add("RoundTo");
                }
            }

            return updatedFields;
        }
    }
#pragma warning restore CS1591
}
