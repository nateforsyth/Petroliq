# Petroliq

Petroliq is an app that allows users to track their fuel usage, as well as accumulated discounts, providing them with insights into the best time to use their discounts for the best return.


## Known issues

### IIS Deployment

As IIS and ASP.NET Core do not play overly well together, User Secrets (secrets.json) does not map as expected. To get around this, upon publishing, XML properties must be updated in the `appsettings.json` file prior to use: `PetroliqDatabase.ConnectionString` and `Auth.Key` respectively. This is the MongoDB Connection String.

```
// ./appsettings.json
{
  "PetroliqDatabase": {
    "ConnectionString": "REPLACE_ME_REFER_README",
    "DatabaseName": "Petroliq",
    "UserSettingsCollectionName": "UserSettings",
    "UsersCollectionName": "Users"
  },
  "Auth": {
    "Audience": "https://petroliq.dreamsof.dev/api",
    "Key": "REPLACE_ME_REFER_README",
    "Issuer": "https://petroliq.dreamsof.dev"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Petroliq": {
    "KM_MI_FACTOR": 1.60934,
    "MI_KM_FACTOR": 0.62,
    "LTR_GAL_FACTOR": 4.54609,
    "DEFAULT_ROUND_TO": 2
  },
  "AllowedHosts": "*"
}
```


## Requirements

1) app will allow users to calculate how much fuel they should pump to their vehicle, using a specified discount, and a maximum spend.
    - e.g. petrol price is $1.899/ltr, have $0.36 discount voucher for maximum 50ltr, want to spend a maximum of $40,. litres to pump = 25.99 = $40
2) app will allow users to track their fuel usage and mileage values.
3) app will store user data in the users Google Drive app data repository.
4) app data will be stored as JSON data.
5) app will allow for conversion between different units of measure.
    - e.g. Miles/Gal to Ltr/100KM
6) app will allow for users from any country to use the app, and selecting a default country will populate default units of measure.
    - defaults will be New Zealand, Australia, United States, Great Britain
    - users from outside the supported default countries will be able to add their own Country, Currency Code, Units of Measure, etc
7) app will allow the user to view graphs and reports of the usage and pricing trends.
    - reports will be printable
    - reports will be able to be exported to Google Drive Spreadsheet format
	

## Known TODO

- [Implement error handling](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors?view=aspnetcore-8.0)
- Add Consumption Calculator
    - Add Controller action for Consumption Calculator
- Implement Fuel Discount Calculator
	- Add Controller action for Fuel Discount Calculator
- Implement Petroliq Algorithm for discount breakeven analysis
    - Add Controller Actions for Petroliq Algorithm (TBC)
- Add Vehicle class (base)
	- Add derived vehicle classes; e.g. Motorcycle, Car, Truck, Van
- Enumerations.
	- Add Fuel type enumeration; Diesel, Petrol/Gasolene.
	- Add Controller for retrieval and validation of all enums.
- Add localisation support.
- Allow for a User to be able to change their Capacity, Currency and Distance Unit settings on the fly and auto-recalc all values.
  - Likely need to persist previous settings so that a conversion can be done.


## Reference


### Typescript

[Auth0 React (Typescript) and ASP.NET Core Web API starter](https://developer.auth0.com/resources/code-samples/full-stack/hello-world/basic-role-based-access-control/spa/react-typescript/aspnet-core-csharp)

[Const objects instead of enums (to support multiple values)](https://stackoverflow.com/questions/52200963/typescript-enum-with-multiple-string-values)


### ASP.NET Core Web API

[ASP.NET Core Web API tutorial](https://www.pragimtech.com/blog/mongodb-tutorial/asp-net-6-rest-api-tutorial/)

[ASP.NET Core data annotations](https://levelup.gitconnected.com/20-important-data-annotations-in-asp-net-core-mvc-f0935dd91661)

[Routing in Web API](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-8.0)


### MongoDB

[Download MongoDB Community](https://www.mongodb.com/try/download/community)

[ASP.NET Core 8.0 MongoDB app](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-8.0&tabs=visual-studio)

- [Access Control disabled](https://stackoverflow.com/questions/41615574/mongodb-server-has-startup-warnings-access-control-is-not-enabled-for-the-dat)
- [Securing MongoDB](https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password)

[Connection Refused for MongoDB remote access](https://www.mongodb.com/community/forums/t/connection-refused-for-remote-access-of-mongodb-server/235790)

[MongoDB remote access and firewall settings](https://stackoverflow.com/questions/33632409/allow-mongodb-remote-access-for-specific-ip)


### Character encoding

[Unicode converter](https://www.branah.com/unicode-converter)


### Swagger/Open API

[Learn more about Swagger/OpenAPI](https://aka.ms/aspnetcore/swashbuckle)


## Support and help

This is not intended to be run by anyone other than me - I do not offer help or support if you were attempting to fork this repository.

This repository has been made public in support of my in-flight job-search.

This repository will be made private without warning.
