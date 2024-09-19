import React from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";
import {blue, grey} from "../../../../pages/CommContent";

const CommContentComments: React.FC = () => {

    const Textarea = styled(TextField)(({theme}) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    line-height: 1.5;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    &:hover {
      border-color: ${blue[400]};
    }
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  `);

    return (
        <div className={"pc-comm-content-comments"}>
            <span style={{fontSize: "2rem", fontWeight: "bold"}}>댓글</span>
            <div className={"pc-comm-content-comments-write"}>
                <Textarea
                    multiline
                    minRows={3}
                    placeholder="내용을 적어주세요"
                    sx={{width: "93%"}}
                />
                <Button
                    sx={{
                        backgroundColor: "#007FFF",
                        color: "white"
                    }}>확인</Button>
            </div>

            <div className={"pc-comm-content-comments-part"}>
                {Array.from({length: 4}).map((_, index: number) => {
                    return (
                        <div className={"pc-comm-content-comments-charm"}>
                            <div className={"pc-comm-content-comments-first"}>
                                <p>
                                    댓글 부모 닉네임 <span>시간</span>
                                </p>
                                <span>
                                    댓글 부모 내용
                                </span>
                            </div>
                            <div className={"pc-comm-content-comments-second"}>
                                <p>
                                    댓글 자식 닉네임 <span>시간</span>
                                </p>
                                <span>
                                    댓글 자식 내용
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CommContentComments;