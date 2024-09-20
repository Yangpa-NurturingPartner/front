import React, {useState, useRef} from "react";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";
import CommContentComments from "../components/desktop/comm/content/CommContentComments";
import CommContentShow from "../components/desktop/comm/content/CommContentShow";

export const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

export const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const CommContent: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className={"pc-comm-content-body"}>
            <div className={"pc-comm-content-btn"}>
                <Button
                    sx={{
                        backgroundColor: "#dddddd",
                        color: "white",
                        marginBottom: "0.5rem"
                    }}
                    onClick={() => navigate("/community")}
                >뒤로 가기</Button>
            </div>

            <CommContentShow/>

            <CommContentComments/>
        </div>
    );
}

export default CommContent;