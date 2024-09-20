import React, {useState} from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";

export interface commWriteBtnprops {
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileInputLabel = styled("label")(({theme}) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 16px",
    fontSize: "0.875rem",
    minWidth: "64px",
    boxSizing: "border-box",
    transition: "background-color 0.3s ease",
    lineHeight: "1.75",
    borderRadius: "4px",
    textTransform: "uppercase",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
    "&:focus": {
        outline: "none",
    },
}));

export const CommWriteBtn: React.FC<commWriteBtnprops> = ({setWrite}) => {
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFileName(file.name);
        }
    };

    return (
        <div className={"pc-comm-write-btn"}>
            <div className={"pc-comm-write-btn-box"}>
                <div>
                    {/*<LoadingButton loading variant="outlined">*/}
                    {/*    Submit*/}
                    {/*</LoadingButton>*/}
                    <Button variant="contained">확인</Button>

                    <FileInputLabel className="preview">
                        <span>첨부 파일 선택</span>
                        <input
                            type="file"
                            className="file"
                            style={{display: "none"}}
                            onChange={handleFileChange}
                        />
                    </FileInputLabel>
                </div>
                <Button
                    sx={{
                        backgroundColor: "#a19f9f",
                        color: "white"
                    }}
                    onClick={() => setWrite(false)}
                >돌아가기</Button>
            </div>

            {
                filePreview &&
                <div className={"pc-comm-previewIMG-box"}>
                    {fileName && <p>파일 이름: {fileName}</p>}
                    <img className={"pc-comm-previewIMG"} src={filePreview} alt="Preview"/>
                </div>
            }
        </div>
    );
};