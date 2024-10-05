import React from "react";

interface ProfileChooseProps {
    setRegis: React.Dispatch<React.SetStateAction<boolean>>;
    profileData: any[];
    setSelectedProfile: React.Dispatch<React.SetStateAction<any>>;
    onAddNewProfile: () => void;
    onSelectProfile: (profile: any) => void;
}

const ProfileChoose: React.FC<ProfileChooseProps> = ({ setRegis, profileData, setSelectedProfile, onAddNewProfile, onSelectProfile }) => {
    const handleEditProfile = (profile: any) => {
        console.log("Editing profile:", profile);
        setSelectedProfile(profile);
        setRegis(true);
    };

    const handleProfileSelect = (profile: any) => {
        // 선택된 프로필을 Local Storage에 저장
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        onSelectProfile(profile);
    };

    return (
        <>
            <div className={"pc-profile-title"}>
                <span>프로필을 선택 하세요.</span>
            </div>

            <div className={"pc-profile-choose"}>
                {profileData.map((profile, index: number) => (
                    <div className={"pc-profile-child-box"} key={index} onClick={() => handleProfileSelect(profile)}>
                        <div className={"pc-profile-child"}>
                            <div className={"pc-profile-setup-box"} onClick={(e) => { e.stopPropagation(); handleEditProfile(profile); }}>
                                <img src={"/img/setup.png"} alt={""} />
                            </div>
                            <img
                                src={profile.imageProfile ? `data:image/png;base64,${profile.imageProfile}` : "/img/profile.png"}
                                alt={profile.name || "child"}
                            />
                            <span>{profile.name || `아이 ${index + 1}`}</span>
                        </div>
                    </div>
                ))}

                <div className={"pc-profile-child-box"} onClick={onAddNewProfile}>
                    <div className={"pc-profile-child"}>
                        <div className={"pc-profile-add-box"}>
                            <img src={"/img/addChild.png"} alt={""} />
                        </div>
                        <span>아이 등록</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileChoose;
