import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/loginCss.scss';
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // 수동 로그인 처리
        if (id === "admin" && password === "admin") {
            navigate("/profile");
        }
    };

    const handleGoogleLoginSuccess = (credentialResponse: any) => {
        const idToken = credentialResponse.credential;
        // console.log("idToken : " + idToken);

        // 백엔드로 POST 요청 보내기
        fetch('http://localhost:8000/api/google-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ token: idToken }),
        })
            .then(response =>{
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json()
            })
            .then(data => {
                const jwtToken = data.token;
                const email = data.email;

                // JWT 토큰과 이메일을 로컬 스토리지에 저장
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('email', email);
                // console.log("jwtToken : " + jwtToken);
                // console.log("email : " + email);

                // 프로필 페이지로 이동
                navigate("/profile");
            })
            .catch(error => console.error('Error during Google login:', error));
    };

    const handleGoogleLoginFailure = () => {
        console.log('Google Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId="597389730622-1qsc90pogdcg8crjid8qsd0d20t2f1vi.apps.googleusercontent.com">
            <div className="login-page">
                <div className="login-container">
                    <div className="image-container">
                        <img src="/img/mainPaint.png" alt="Mother and child with onion character" className="login-image" />
                        <p className="image-caption">"이번 생에 부모는 처음이니까"<br />저희가 함께 도와드리겠습니다.</p>
                    </div>
                    <div className="form-container">
                        <img src="/img/logo.png" alt="YANGPA Logo" className="logo" />
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="remember-me">
                                <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                <label htmlFor="rememberMe">자동 로그인</label>
                            </div>
                            <div className="findIDFW">
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginFailure}
                                    text="signin_with"
                                    shape="pill"
                                />
                            </div>
                            <div className="btnArea">
                                <button type="button" className="register-button">회원가입</button>
                                <button type="submit" className="login-button">로그인</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;
