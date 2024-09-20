import React, {useState} from "react";
import "../css/profileCss.scss";
import "../css/profileadd.scss"
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

const Profile: React.FC = () => {

    const [regis, setRegis] = useState(false);

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>

                {
                    !regis ? <ProfileChoose setRegis={setRegis}/> : <ProfileAddOrRegist setRegis={setRegis}/>
                }

            </div>
        </div>
    );
};

export default Profile;