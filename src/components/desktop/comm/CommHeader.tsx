import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CommDate from "./CommDate";
import {useLocation, useNavigate} from "react-router-dom";

export interface commheaderprops {
    write: boolean;
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
    selectedList: number;
    setSelectedList: React.Dispatch<React.SetStateAction<number>>;
    setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
    selectedPeriod: "all" | "month" | "week";
    setSelectedPeriod: React.Dispatch<React.SetStateAction<"all" | "month" | "week">>;
    searchUserQuery: (query: string) => Promise<void>;
    resetWrite: (back?: (number | undefined)) => void
}

const CommHeader: React.FC<commheaderprops> = ({
                                                   write, setWrite,
                                                   selectedList, setSelectedList,
                                                   setSelectedPage,
                                                   selectedPeriod, setSelectedPeriod,
                                                   searchUserQuery, resetWrite
                                               }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedPage(1);
        setSelectedList(newValue);
        resetWrite(0);
    };

    const choiseSx = {fontSize: "1rem", fontWeight: "bold"};

    return (
        <div className={"pc-comm-header"}>
            <Tabs
                value={selectedList}
                onChange={handleTabChange}
                onClick={()=> {if(location.pathname !== "/community") navigate("/community");}}
                variant="fullWidth"
                textColor="primary"
                TabIndicatorProps={{
                    style: {
                        display: "none",
                    },
                }}
                sx={{borderBottom: "1px solid black"}}
            >
                <Tab label="전체" sx={choiseSx} value={0}/>
                <Tab label="공지사항" sx={choiseSx} value={50}/>
                {/*<Tab label="인기" sx={choiseSx}/>*/}
                {/*<Tab label="이벤트" sx={choiseSx} />*/}
                <Tab label="0~2세(영아기)" sx={choiseSx} value={100}/>
                <Tab label="3~6세(유아기)" sx={choiseSx} value={200}/>
                <Tab label="7~12세(아동기)" sx={choiseSx} value={300}/>
                <Tab label="13~18세(청소년기)" sx={choiseSx} value={400}/>
            </Tabs>

            {write ? <></> : <CommDate
                setWrite={setWrite}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                searchUserQuery={searchUserQuery}
            />}

        </div>
    );
};

export default CommHeader;