using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Petroliq_API.Model;

namespace Petroliq_API.Services
{
#pragma warning disable CS1591
    public class ServiceHelper
    {
        private readonly IConfiguration _configuration;
        public readonly string? _connectionString;
        public MongoClient _mongoClient;

        public ServiceHelper(IConfiguration configuration, IOptions<PetroliqDatabaseSettings> petroliqDatabaseSettings)
        {
            _configuration = configuration;
#if DEBUG
            _connectionString = _configuration["ConnectionString"];
#else
            _connectionString = petroliqDatabaseSettings.Value.ConnectionString;
#endif
            _mongoClient = new MongoClient(_connectionString);
        }
    }
#pragma warning restore CS1591
}
