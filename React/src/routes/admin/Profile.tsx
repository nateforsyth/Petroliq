import * as React from "react";
import IProfileProps from "./_adminProps/IProfileProps";
import { useUser } from "../../components/appContainer/AppContainer";
import ProfileForm from "../../components/formComponents/profileForm/ProfileForm";

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
    const { currentUser, currentUserSettings, userRetrievedCallback } = useUser();

    const [resetForm, setResetForm] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(`currentUser or currentUserSettings has changed; ${currentUser?.UserName}`);
        if (currentUser === null && currentUserSettings === null) {
            setResetForm(true);
        }
    }, [currentUser, currentUserSettings]);

    const userNameStr: string = currentUser !== null && currentUser !== undefined && currentUser.FirstName !== null && currentUser.FirstName !== undefined ? currentUser?.FirstName : "";

    let htmlElement: JSX.Element =
        <div>
            <main className={`subheadingElement`}>
                <h2 className="pageHeader">
                    {
                        userNameStr !== "" ?
                            `${userNameStr}'s Profile and App Settings` :
                            "Log in again to be able to edit your Profile and App Settings"
                    }
                </h2>
            </main>
            <ProfileForm
                user={currentUser}
                userSettings={currentUserSettings}
                resetForm={resetForm}
                userUpdatedOrDeletedCallback={userRetrievedCallback}
            />
        </div>;

    return htmlElement;
}

export default Profile;
