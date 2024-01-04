using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Petroliq_API.Model;

namespace Petroliq_API.Services
{
#pragma warning disable CS1591
    public class UserService : ServiceHelper
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<PetroliqDatabaseSettings> petroliqDatabaseSettings, IConfiguration configuration) : base(configuration)
        {
            var mongoDatabase = _mongoClient.GetDatabase(petroliqDatabaseSettings.Value.DatabaseName);
            _usersCollection = mongoDatabase.GetCollection<User>(petroliqDatabaseSettings.Value.UsersCollectionName);
        }

        /// <summary>
        /// Get all User objects
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        /// <summary>
        /// Get a User object by their db Id value (User Id)
        /// </summary>
        /// <param name="dbId"></param>
        /// <returns></returns>
        public async Task<User?> GetAsync(string dbId) =>
            await _usersCollection.Find(x => x.Id == dbId).FirstOrDefaultAsync();

        /// <summary>
        /// Create a new User object
        /// </summary>
        /// <param name="newUserSettings"></param>
        /// <returns></returns>
        public async Task CreateAsync(User newUserSettings) =>
            await _usersCollection.InsertOneAsync(newUserSettings);

        /// <summary>
        /// Update an existing User object
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updatedUserSettings"></param>
        /// <returns></returns>
        public async Task UpdateAsync(string id, User updatedUserSettings) =>
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUserSettings);

        /// <summary>
        /// Remove an existing User object
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task RemoveAsync(string id)
        {
            await _usersCollection.DeleteOneAsync(x => x.Id == id);
        }
            
    }
#pragma warning restore CS1591
}
