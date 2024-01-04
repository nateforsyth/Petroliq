using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Petroliq_API.Services
{
    public class ServiceHelper
    {
        private readonly IConfiguration _configuration;
        public readonly string? _connectionString;
        public MongoClient _mongoClient;

        public ServiceHelper(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration["ConnectionString"];
            _mongoClient = new MongoClient(_connectionString);
        }
    }
}
