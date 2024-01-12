import * as React from "react";
import IProfileProps from "./_adminProps/IProfileProps";
import { useUser } from "../../components/appContainer/AppContainer";
import ProfileForm from "../../components/profileForm/ProfileForm";

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
    const { currentUser } = useUser();

    const userNameStr: string = currentUser !== null && currentUser !== undefined && currentUser.FirstName !== null && currentUser.FirstName !== undefined ? currentUser?.FirstName : "";

    let htmlElement: JSX.Element =
        <div>
            <main className={`subheadingElement`}>
                <h2 className="pageHeader">
                    {
                        userNameStr !== "" ?
                            `${userNameStr}'s Profile and Settings` :
                            "Profile"
                    }
                </h2>
            </main>
            <ProfileForm user={currentUser} />
        </div>;

    return htmlElement;
}

export default Profile;
