import * as React from "react";
import IProfileProps from "./_adminProps/IProfileProps";
import { useUser } from "../../components/appContainer/AppContainer";
import ProfileForm from "../../components/profileForm/ProfileForm";

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
    const { currentUser, resetUser } = useUser();

    const [resetForm, setResetForm] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(currentUser);
        if (currentUser === null) {
            console.log(`user logged out or cleared, resetting profile form`);
            setResetForm(true);
        }
    }, [currentUser]);

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
                resetForm={resetForm}
            />
        </div>;

    return htmlElement;
}

export default Profile;
