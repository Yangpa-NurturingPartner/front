import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CommDate from "./CommDate";

export interface commheaderprops {
    write: boolean;
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommHeader: React.FC<commheaderprops> = ({write, setWrite}) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const choiseSx = {fontSize: "1rem", fontWeight: "bold"};
    const buttonSx = {
        width: "10rem",
        fontSize: "1rem",
        backgroundColor: "#E3F0FE",
        color: "#000",
        borderRadius: "5px",
        padding: "5px 15px",
        marginRight: "8px",
        "&:hover": {
            backgroundColor: "#208DF9",
            color: "#fff"
        },
    };

    return (
        <div className={"pc-comm-header"}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                TabIndicatorProps={{
                    style: {
                        display: "none",
                    },
                }}
                sx={{borderBottom: "1px solid black"}}
            >
                <Tab label="전체" sx={choiseSx}/>
                <Tab label="인기" sx={choiseSx}/>
                <Tab label="공지사항" sx={choiseSx}/>
                <Tab label="이벤트" sx={choiseSx}/>
                <Tab label="0~2세(영아기)" sx={choiseSx}/>
                <Tab label="3~6세(유아기)" sx={choiseSx}/>
                <Tab label="7~12세(아동기)" sx={choiseSx}/>
                <Tab label="13~18세(청소년기)" sx={choiseSx}/>
            </Tabs>


            <div style={{marginTop: "1.5rem"}}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" sx={{...buttonSx, backgroundColor: "#1976D2", color: "#FFF"}}>
                        전체 게시판
                    </Button>
                    <Button variant="contained" sx={buttonSx}>
                        고민 나누기
                    </Button>
                    <Button variant="contained" sx={buttonSx}>
                        육아 꿀팁
                    </Button>
                    <Button variant="contained" sx={buttonSx}>
                        일상공유
                    </Button>
                </Stack>
            </div>

            {write ? <></> : <CommDate setWrite={setWrite}/>}

        </div>
    );
};

export default CommHeader;