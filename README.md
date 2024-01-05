# Petroliq

Petroliq is an app that allows users to track their fuel usage, as well as accumulated discounts, providing them with insights into the best time to use their discounts for the best return.


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


## Reference


### Typescript

[Const objects instead of enums (to support multiple values)](https://stackoverflow.com/questions/52200963/typescript-enum-with-multiple-string-values)


### ASP.NET Core Web API

[ASP.NET Core Web API tutorial](https://www.pragimtech.com/blog/mongodb-tutorial/asp-net-6-rest-api-tutorial/)

[ASP.NET Core data annotations](https://levelup.gitconnected.com/20-important-data-annotations-in-asp-net-core-mvc-f0935dd91661)


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
