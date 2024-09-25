import React, { useState } from "react";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

interface ProfileAddOrRegistProps {
    setRegis: React.Dispatch<React.SetStateAction<boolean>>;
    onProfileAdded: () => void;
}

const ProfileAddOrRegist: React.FC<ProfileAddOrRegistProps> = ({ setRegis, onProfileAdded }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className={"pc-profile-ar-title"}>
                <span>아이 등록</span>
            </div>

            <div className={"pc-profile-ar-close"} onClick={() => setRegis(false)}>
                <img src={"/img/close.png"} alt={""} />
            </div>

            <div className={"pc-profile-ar-body"}>
                <div
                    className={"pc-profile-ar-register-img-box"}
                    onClick={() => document.getElementById("image-upload")?.click()}
                >
                    <div className={"pc-profile-ar-register-img"}>
                        <img src={selectedImage || "/img/addChild.png"} alt={""} />
                    </div>

                    <span>아이 등록</span>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>

                <div className={"pc-profile-ar-input-list"}>
                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>이름/ 애칭</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>
                        <TextField id="outlined-basic" />
                    </div>

                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>생년 월일</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker />
                        </LocalizationProvider>
                    </div>

                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>성별</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>

                        <div className={"pc-profile-ar-choose-sex"}>
                            <Button className="MuiButton-contained" variant="contained">
                                남자
                            </Button>
                            <Button className="MuiButton-outlined" variant="outlined">
                                여자
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Button
                    id="register-button"
                    variant="contained"
                    size={"large"}
                    onClick={onProfileAdded}  // 등록 완료 버튼 클릭 시 onProfileAdded 함수 호출
                >
                    등록 완료
                </Button>
            </div>
        </>
    );
};

export default ProfileAddOrRegist;
