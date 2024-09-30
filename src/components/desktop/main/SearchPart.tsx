import React from "react";
import {useMediaQuery} from "react-responsive";
import {TextField} from "@mui/material";
import {Simulate} from "react-dom/test-utils";
import focus = Simulate.focus;

const SearchPart: React.FC = () => {
    const isPortrait = useMediaQuery({query: '(orientation: portrait)'});

    const makeSx = {
        backgroundColor: "white",
        borderRadius: "15px",
        border: "none",
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
        <>
            <div className={isPortrait ? "ph-hands-img-div" : "pc-hands-img-div"}>
                <img className={isPortrait ? "ph-hands-img" : "pc-hands-img"} src="/img/hands.png" alt={""}/>
            </div>

            {
                isPortrait
                    ? <></>
                    : <>
                        <div className={"pc-search-input-box"}>
                            <span className={"pc-search-input-title"}>내 손안의 양육 파트너 : 양파</span>
                            <TextField
                                id="outlined-basic"
                                placeholder="육아 고민을 양파에게 물어보세요!"
                                variant="outlined"
                                sx={makeSx}
                                InputProps={{
                                    endAdornment: (
                                        <img className={"pc-search-icon"} src={"/img/search.png"} alt={""}/>
                                    ),
                                }}
                            />
                        </div>
                    </>
            }
        </>
    )
}

export default SearchPart;