import React from "react";
import {Box, FormControl, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";

export interface commDateprops {
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPeriod: "all" | "month" | "week";
    setSelectedPeriod: React.Dispatch<React.SetStateAction<"all" | "month" | "week">>;
    searchUserQuery: (query: string) => Promise<void>;
}

const CommDate: React.FC<commDateprops> = ({
                                               setWrite,
                                               selectedPeriod, setSelectedPeriod,
                                               searchUserQuery
                                           }) => {

    const handlePeriodChange = (event: any) => {
        setSelectedPeriod(event.target.value);
    };

    const makeSx = {
        width: "45vw",
    };

    return (
        <div className={"pc-comm-header-date"}>
            <Box display="flex" alignItems="center" gap={1}>
                <FormControl
                    variant="outlined"
                    size="small"
                >
                    <Select
                        value={selectedPeriod}
                        onChange={handlePeriodChange}
                        sx={{width: "7rem"}}
                    >
                        <MenuItem value="all">전체기간</MenuItem>
                        <MenuItem value="week">최근1주</MenuItem>
                        <MenuItem value="month">최근1개월</MenuItem>
                    </Select>
                </FormControl>

                <FormControl>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        sx={makeSx}
                        InputProps={{
                            endAdornment: (
                                <img src={"/img/search.png"} alt={""} style={{width: "1.5rem"}}/>
                            ),
                        }}
                        onKeyUp={(e: any) => {
                            if (e.key === "Enter") searchUserQuery(e.target.value);
                        }}
                    />
                </FormControl>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setWrite(true)}
            >
                글쓰기
            </Button>
        </div>
    );
}

export default CommDate;