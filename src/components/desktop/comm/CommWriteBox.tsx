import React from "react";
import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";

const CommWriteBox:React.FC = () => {
    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
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
        <>
            <Textarea
                minRows={1}
                maxRows={1}
                placeholder="제목을 적어주세요"
                sx={{width: "100%", marginBottom:"1vh"}}
            />
            <Textarea
                multiline
                minRows={25}
                maxRows={25}
                placeholder="내용을 적어주세요"
                sx={{width: "100%"}}
            />
        </>
    );
}

export default CommWriteBox;