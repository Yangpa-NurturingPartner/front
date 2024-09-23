import React, { useState, useEffect } from "react";
import "../css/profileCss.scss";
import "../css/profileadd.scss";
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

const Profile: React.FC = () => {
    const [regis, setRegis] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        const email = localStorage.getItem('email');  // 이메일을 가져옴

        if (jwtToken && email) {
            fetch(`http://localhost:8080/api/user-info?email=${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then(data => setUserData(data))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>

                {
                    !regis ? <ProfileChoose setRegis={setRegis} /> : <ProfileAddOrRegist setRegis={setRegis} />
                }

            </div>
        </div>
    );
};

export default Profile;
