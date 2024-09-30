import React from 'react';
import {useMediaQuery} from "react-responsive";
import "../commonCss.scss"
import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import HeaderMenu from "./HeaderMenu";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const onClickHandler = () => navigate("/");

    const isPortrait = useMediaQuery({query: '(orientation: portrait)'});

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    return (
        <div>
            <div className={isPortrait ? "ph-header" : "pc-header"} >
            
                <div className={isPortrait ? "" : "pc-img-div"}>
                    <img className={isPortrait ? "ph-logo-img" : "pc-logo-img"} src="/img/logo.png" 
                    alt={""} onClick={onClickHandler}
                    style = {{cursor: "pointer"}}/>
                </div>

                <div className={isPortrait ? "ph-choose-child" : "pc-choose-child"}>
                    <FormControl sx={{m: 1, minWidth: 100}}>
                        <Select
                            value={age}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{'aria-label': 'Without label'}}
                            style={{height: "100%"}}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>

                    {isPortrait ? <></>
                        : <HeaderMenu/>
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;