import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/loginCss.scss';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = (credentialResponse: any) => {
        const idToken = credentialResponse.credential;

        // 백엔드로 POST 요청 보내기
        fetch(`${process.env.REACT_APP_API_URL}/api/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ token: idToken }),
        })
            .then(response => {
                // console.log('Full response object:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const jwtToken = data.data.token;
                const email = data.data.email;

                // JWT 토큰과 이메일을 로컬 스토리지에 저장
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('email', email);

                // 프로필 페이지로 이동
                navigate('/profile');
            })
            .catch(error => console.error('Error during Google login:', error));
    };

    const handleGoogleLoginFailure = () => {
        console.error('Google Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <div className="login-page">
                <div className="login-container">
                    <div className="image-container">
                        <img
                            src="/img/mainPaint.png"
                            alt="Mother and child with onion character"
                            className="login-image"
                        />
                        <p className="image-caption">
                            "이번 생에 부모는 처음이니까"
                            <br />
                            저희가 함께 도와드리겠습니다.
                        </p>
                    </div>
                    <div className="form-container">
                        <img src="/img/logo.png" alt="YANGPA Logo" className="logo" />
                        <div className="findIDFW">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginFailure}
                                text="signin_with"
                                shape="pill"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;
