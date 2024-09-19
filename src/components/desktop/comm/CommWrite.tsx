import React from "react";
import CommWriteBox from "./CommWriteBox";
import {CommWriteBtn} from "./CommWriteBtn";

export interface commWriteprops {
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommWrite: React.FC<commWriteprops> = ({setWrite}) => {

    return (
        <>
            <CommWriteBtn setWrite={setWrite}/>
            <CommWriteBox/>
        </>
    )
}

export default CommWrite;