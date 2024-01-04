namespace Petroliq_API.Model
{
    public class PetroliqDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string UserSettingsCollectionName { get; set; } = null!;
        public string UsersCollectionName { get; set; } = null!;
    }
}
