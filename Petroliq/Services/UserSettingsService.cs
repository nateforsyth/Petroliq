using Petroliq_API.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace Petroliq_API.Services
{
#pragma warning disable CS1591
    public class UserSettingsService : ServiceHelper
    {
        private readonly IMongoCollection<UserSettings> _userSettingsCollection;

        public UserSettingsService(IOptions<PetroliqDatabaseSettings> petroliqDatabaseSettings, IConfiguration configuration) : base(configuration, petroliqDatabaseSettings)
        {
            IMongoDatabase mongoDatabase;

            try
            {
                mongoDatabase = _mongoClient.GetDatabase(petroliqDatabaseSettings.Value.DatabaseName);
            }
            catch (Exception ex)
            {
                throw new Exception("MongoDB initialisation error, UserSettingsService", ex);
            }

            try
            {
                _userSettingsCollection = mongoDatabase.GetCollection<UserSettings>(petroliqDatabaseSettings.Value.UserSettingsCollectionName);
            }
            catch (Exception ex)
            {
                throw new Exception("UserSettings Collection instantiation error", ex);
            }
        }

        /// <summary>
        /// Get all User Settings objects
        /// </summary>
        /// <returns></returns>
        public async Task<List<UserSettings>> GetAsync() =>
            await _userSettingsCollection.Find(_ => true).ToListAsync();

        /// <summary>
        /// Get a User Settings object for a specific User
        /// </summary>
        /// <param name="id"></param>
        /// <param name="useUserId"></param>
        /// <returns></returns>
        public async Task<UserSettings?> GetForUserAsync(string id, bool useUserId)
        {
            if (useUserId)
            {
                return await _userSettingsCollection.Find(x => x.UserId == id).FirstOrDefaultAsync();
            }
            else
            {
                return await _userSettingsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            }            
        }

        /// <summary>
        /// Create a User Settings object for a specific User
        /// </summary>
        /// <param name="newUserSettings"></param>
        /// <returns></returns>
        public async Task CreateForUserAsync(UserSettings newUserSettings) =>
            await _userSettingsCollection.InsertOneAsync(newUserSettings);

        /// <summary>
        /// Update a User Settings object for a specific User
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="updatedUserSettings"></param>
        /// <returns></returns>
        public async Task UpdateForUserAsync(string userId, UserSettings updatedUserSettings) =>
            await _userSettingsCollection.ReplaceOneAsync(x => x.UserId == userId, updatedUserSettings);

        /// <summary>
        /// Remove a User Settings object for a specific User
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task RemoveForUserAsync(string userId) =>
            await _userSettingsCollection.DeleteOneAsync(x => x.UserId == userId);
    }
#pragma warning restore CS1591
}
