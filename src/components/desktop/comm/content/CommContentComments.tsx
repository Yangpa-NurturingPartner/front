import React, {useState} from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";
import {blue, grey} from "../../../../pages/CommContent";
import axios from "axios";

interface CommentProps {
    comments: {
        comment_no: number;
        comments_name: string;
        comments_contents: string;
        comments_date: string;
    }[];
    boardId: number;
    fetchComments: () => void;
}


const CommContentComments: React.FC<CommentProps> = ({comments, boardId, fetchComments}) => {
    const [commentText, setCommentText] = useState<string>("");


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

    const addComment = async () => {
        try {
            const serverIp: string | undefined = process.env.REACT_APP_HOST;
            const port: string | undefined = process.env.REACT_APP_BACK_PORT;

            await axios.post(`http://${serverIp}:${port}/community/boards/addComment`, {
                token: "Bearer " + localStorage.getItem("jwtToken"),
                board_no: boardId,
                comments_contents: commentText
            });

            setCommentText("");
            fetchComments();
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("댓글을 추가하는 데 실패했습니다.");
        }
    };

    return (
        <div className={"pc-comm-content-comments"}>
            <span style={{fontSize: "2rem", fontWeight: "bold"}}>댓글</span>
            <div className={"pc-comm-content-comments-write"}>
                <TextField
                    multiline
                    minRows={3}
                    placeholder="내용을 적어주세요"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    fullWidth
                    sx={{
                        width: "93%",
                        fontFamily: 'IBM Plex Sans, sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: 'black',
                        backgroundColor: 'white',
                        '&:hover': {
                            borderColor: blue[400],
                        },
                        '&:focus': {
                            borderColor: blue[400],
                            boxShadow: `0 0 0 3px ${blue[200]}`,
                        }
                    }}
                />
                <Button
                    sx={{
                        backgroundColor: "#007FFF",
                        color: "white"
                    }}
                    onClick={addComment}
                >확인</Button>
            </div>

            <div className={"pc-comm-content-comments-part"}>
                {comments.map((comment) => {
                    return (
                        <div className={"pc-comm-content-comments-charm"} key={comment.comment_no}>
                            <div className={"pc-comm-content-comments-first"}>
                                <p>
                                    {comment.comments_name} <span>{comment.comments_date}</span>
                                </p>
                                <span>
                                    {comment.comments_contents}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CommContentComments;