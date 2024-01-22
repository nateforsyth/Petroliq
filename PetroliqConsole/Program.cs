using Petroliq_API.Application;
using Petroliq_API.Model;
using static Petroliq_API.Application.Enums;

namespace PetroliqConsole
{
    internal class Program
    {
        static void Main(string[] args)
        {
            EnumTester();
            //PasswordHashTest();

            Console.Read();

        }

        static void EnumTester()
        {
            var currency = CapacityUnit.Gallon;
            var currencySymbol = Convert.ToChar(currency);
            var currencyCode = Convert.ToInt64(currency);

            Console.WriteLine($"currency: {currency}, currencySymbol: {currencySymbol}, currencyCode: {currencyCode}");
        }

        static void PasswordHashTest()
        {
            string password = string.Empty;
            string passwordHash = string.Empty;
            string passwordHash2 = string.Empty;
            bool passwordVerified = false;
            bool passwordVerified2 = false;

            Console.WriteLine("Enter your password:");

#pragma warning disable CS8600
            password = Console.ReadLine();
#pragma warning restore CS8600

            if (!string.IsNullOrEmpty(password))
            {
                passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
                passwordHash2 = BCrypt.Net.BCrypt.HashPassword(password);
                passwordVerified = BCrypt.Net.BCrypt.Verify($"{password}", passwordHash);
                passwordVerified2 = BCrypt.Net.BCrypt.Verify($"{password}", passwordHash2);
            }

            Console.Write($"password: {password}, passwordHash: {passwordHash}, passwordHash2: {passwordHash2}, passwordVerified: {passwordVerified}, passwordVerified2: {passwordVerified2}");

            Console.ReadLine();
        }
    }
}
