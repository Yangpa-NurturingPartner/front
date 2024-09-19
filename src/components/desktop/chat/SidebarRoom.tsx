import React from "react";
import {TextField} from "@mui/material";
import SearchHistory from "./SearchHistory";

const SidebarRoom: React.FC = () => {

    const makeSx = {
        width: "100%",
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
        <div className={"pc-chat-body"}>
            <div className={"pc-chat-body-searchInput"}>
                <TextField
                    id="outlined-basic"
                    label="히스토리 검색"
                    variant="outlined"
                    sx={makeSx}
                    InputProps={{
                        endAdornment: (
                            <img className={"pc-chat-icon"} src={"/img/search.png"} alt={""} style={{width:"1.5rem"}}/>
                        ),
                    }}
                />
            </div>

            <SearchHistory/>
        </div>
    );
}

export default SidebarRoom;