import React from "react";

interface profileProps {
    setRegis: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileChoose: React.FC<profileProps> = ({setRegis}) => {

    return (
        <>
            <div className={"pc-profile-title"}>
                <span>프로필을 선택 하세요.</span>
            </div>

            <div className={"pc-profile-choose"}>
                {Array.from({length: 2}).map((_, index: number) => {
                    return (
                        <div className={"pc-profile-child-box"} key={index}>
                            <div className={"pc-profile-child"}>
                                <div className={"pc-profile-setup-box"}>
                                    <img src={"/img/setup.png"} alt={""}/>
                                </div>
                                <img src={"/img/child1.png"} alt={""}/>
                                <span>첫째 김하율</span>
                            </div>
                        </div>
                    );
                })}

                <div className={"pc-profile-child-box"}
                     onClick={() => setRegis(true)}
                >
                    <div className={"pc-profile-child"}>
                        <div className={"pc-profile-add-box"}>
                            <img src={"/img/addChild.png"} alt={""}/>
                        </div>
                        <span>아이 등록</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileChoose;