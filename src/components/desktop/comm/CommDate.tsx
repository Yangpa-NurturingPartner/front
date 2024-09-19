import React from "react";
import {Box, FormControl, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";

export interface commDateprops {
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommDate: React.FC<commDateprops> = ({setWrite}) => {

    const [period, setPeriod] = React.useState('전체기간');
    const [filter, setFilter] = React.useState('제목만');

    const handlePeriodChange = (event: any) => {
        setPeriod(event.target.value);
    };

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    const makeSx = {
        width: "40vw",
    };

    return (
        <div className={"pc-comm-header-date"}>
            <Box display="flex" alignItems="center" gap={1}>
                <FormControl
                    variant="outlined"
                    size="small"
                >
                    <Select
                        value={period}
                        onChange={handlePeriodChange}
                        sx={{width: "7rem"}}
                    >
                        <MenuItem value="전체기간">전체기간</MenuItem>
                        <MenuItem value="최근1주">최근1주</MenuItem>
                        <MenuItem value="최근1개월">최근1개월</MenuItem>
                    </Select>
                </FormControl>


                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{width: "6rem"}}
                >
                    <Select value={filter} onChange={handleFilterChange}>
                        <MenuItem value="제목만">제목만</MenuItem>
                        <MenuItem value="내용만">내용만</MenuItem>
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