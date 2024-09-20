import React from 'react';
import {useMediaQuery} from "react-responsive";

const Testpage: React.FC = () => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

    return (
        <div style={{border:"1px solid black"}}>
            {
                isPortrait ? (
                    <h1>세로 페이지</h1>
                ): (
                    <h1>가로 페이지</h1>
                )
            }
        </div>
    );
};

export default Testpage;