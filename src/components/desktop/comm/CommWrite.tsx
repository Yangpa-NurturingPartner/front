import React from "react";
import CommWriteBox from "./CommWriteBox";
import {CommWriteBtn} from "./CommWriteBtn";

export interface commWriteprops {
    setWrite: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBoardCode: any;
    setSelectedBoardCode: any;
    title: any;
    setTitle: any;
    content: any;
    setContent: any;
    file: any;
    setFile: any;
    writeBoard: any;
    resetWrite: any;
}

const CommWrite: React.FC<commWriteprops> = ({
                                                 setWrite, selectedBoardCode, setSelectedBoardCode,
                                                 title, setTitle,
                                                 content, setContent,
                                                 file, setFile, writeBoard, resetWrite
                                             }) => {

    return (
        <>
            <CommWriteBtn setWrite={setWrite}
                          file={file} setFile={setFile}
                          writeBoard={writeBoard} resetWrite={resetWrite}
            />
            <CommWriteBox selectedBoardCode={selectedBoardCode}
                          setSelectedBoardCode={setSelectedBoardCode}
                          title={title} setTitle={setTitle}
                          content={content} setContent={setContent}/>
        </>
    )
}

export default CommWrite;