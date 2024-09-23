import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CommunityBoard {
  board_no: number;
  title: string;
  board_contents: string;
  reg_date: Date;
}

const CommContent: React.FC = () => {
  const [commProps, setCommProps] = useState<CommunityBoard[]>([]);
  const navigate = useNavigate();

  const handleClick = (board_no: number) => {
    navigate(`/community/${board_no}`);
  };

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/community/boards');
        setCommProps(response.data.list);
      } catch (error) {
        console.error('게시글 리스트 불러오기 오류:', error);
      }
    };

    fetchBoardList();
  }, []);

  return (
    <div className={"pc-comm-result-box"}>
      {commProps.map((board) => (
        <div 
          key={board.board_no} 
          className={"pc-comm-result"} 
          onClick={() => handleClick(board.board_no)}
        >
          <div className={"pc-comm-result-text"}>
            <p className={"pc-comm-result-title"}>{board.title}</p>
            <span className={"pc-comm-result-content"}>{board.board_contents}</span>
          </div>
          <img className={"pc-comm-result-img"} src={"/img/mainPaint.png"} alt={"게시글 이미지"} />
        </div>
      ))}
    </div>
  );
};

export default CommContent;
