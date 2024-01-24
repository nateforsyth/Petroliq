using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Petroliq_API.Model;
using Shared.Model;

namespace Petroliq_API.Services
{
#pragma warning disable CS1591
    public class UserService : ServiceHelper
    {
        private readonly IMongoCollection<User>? _usersCollection;

        public UserService(IOptions<PetroliqDatabaseSettings> petroliqDatabaseSettings, IConfiguration configuration) : base(configuration, petroliqDatabaseSettings)
        {
            IMongoDatabase mongoDatabase;

            try
            {
                mongoDatabase = _mongoClient.GetDatabase(petroliqDatabaseSettings.Value.DatabaseName);
            }
            catch (Exception ex)
            {
                throw new Exception("MongoDB initialisation error, UserService", ex);
            }

            try
            {
                _usersCollection = mongoDatabase.GetCollection<User>(petroliqDatabaseSettings.Value.UsersCollectionName);
            }
            catch (Exception ex)
            {
                throw new Exception("Users Collection instantiation error", ex);
            }
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
        /// Get a User object by their db Email value
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<User?> GetByEmailAsync(string email) => 
            await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        /// <summary>
        /// Create a new User object
        /// </summary>
        /// <param name="newUser"></param>
        /// <returns></returns>
        public async Task CreateAsync(User newUser)
        {
            if (newUser != null)
            {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                await _usersCollection.InsertOneAsync(newUser);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            }
        }
            

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
