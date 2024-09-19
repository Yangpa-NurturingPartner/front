import React from "react";
import {TextField} from "@mui/material";
import ChatPartDefault from "./ChatPartDefault";
import ChatCloud from "./ChatCloud";

const ChatContent: React.FC = () => {
    const makeSx = {
        width: "70%",
        backgroundColor: "#F4F4F4",
        borderRadius: "15px",
        border: "none",
        boxShadow: "2px 2px 5px #DADADA",
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
            "&:hover fieldset": {
                border: "none",
            },
            "&.Mui-focused fieldset": {
                border: "none",
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgb(AAAAAA)",
            "&.Mui-focused": {
                display: "none",
                color: "black",
            },
        },
    };

    return (
        <div className={"pc-show-chat"}>
            <div className={"pc-chat-part"}>
                <ChatPartDefault/>
                {/*<ChatCloud/>*/}
            </div>

            <div className={"pc-chat-input"}>
                <TextField
                    id="outlined-basic"
                    placeholder="육아 고민을 적어주세요"
                    variant="outlined"
                    sx={makeSx}
                    InputProps={{
                        endAdornment: (
                            <img className={"pc-chat-icon"} src={"/img/search.png"} alt={""}/>
                        ),
                    }}
                />
            </div>
        </div>
    );
}

export default ChatContent;