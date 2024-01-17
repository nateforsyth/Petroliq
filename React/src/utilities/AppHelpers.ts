export class AppHelpers {
    // Helper function to force a log out from the app, clearing localStorage values and navigating to the root of the app
    public static forceLogout = (): void => {
        console.log(`AppHelpers.handleLogout invoked`);

        localStorage.setItem("userId", "");
        localStorage.setItem("refresh", "");
        localStorage.setItem("tokenExpiry", "");
    };
}
