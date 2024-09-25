import React from "react";

interface ProfileChooseProps {
    setRegis: React.Dispatch<React.SetStateAction<boolean>>;
    profileData: any[];  // 구체적인 타입을 사용할 수 있습니다.
}

const ProfileChoose: React.FC<ProfileChooseProps> = ({ setRegis, profileData }) => {

    return (
        <>
            <div className={"pc-profile-title"}>
                <span>프로필을 선택 하세요.</span>
            </div>

            <div className={"pc-profile-choose"}>
                {profileData.map((profile, index: number) => (
                    <div className={"pc-profile-child-box"} key={index}>
                        <div className={"pc-profile-child"}>
                            <div className={"pc-profile-setup-box"}>
                                <img src={"/img/setup.png"} alt={""} />
                            </div>
                            <img src={profile.imageUrl || "/img/child1.png"} alt={profile.name || "child"} />
                            <span>{profile.name || `아이 ${index + 1}`}</span>
                        </div>
                    </div>
                ))}

                <div className={"pc-profile-child-box"} onClick={() => setRegis(true)}>
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
}

export default ProfileChoose;
