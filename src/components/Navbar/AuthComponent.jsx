'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_URL } from '@/app/utils/apiUrl'
import { closeModal } from '@/app/Store/ReduxSlice/modalSlice'
import { fetchUserData } from '@/app/Store/Actions/userAction'
// import { fetchUserData } from '@/Store/Actions/userActions'
const MODE = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    RESET_PASSWORD: "RESET_PASSWORD",
    EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
    VERIFY_OTP: "VERIFY_OTP"
}
const AuthComponent = () => {
    const router = useRouter();
    const [mode, setMode] = useState(MODE.LOGIN);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        confirmPassword: "",
       
        newPassword: "",
        otp: "",
        token: ""
    });

    const formTitle =
        mode === MODE.LOGIN
            ? "Log in"
            : mode === MODE.REGISTER
                ? "Register"
                : mode === MODE.RESET_PASSWORD
                    ? "Reset Your Password"
                    : mode === MODE.FORGOT_PASSWORD
                        ? "Forgot Password"
                        : mode === MODE.VERIFY_OTP
                            ? "Verify OTP"
                            : "Verify Your Email";


    const buttonTitle =
        mode === MODE.LOGIN
            ? "Login"
            : mode === MODE.REGISTER
                ? "Register"
                : mode === MODE.RESET_PASSWORD
                    ? "Reset"
                    : mode === MODE.FORGOT_PASSWORD
                        ? "Send OTP"
                        : mode === MODE.VERIFY_OTP
                            ? "Verify"
                            : "Verify";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError("")
        console.log(formData)
        try {
            let response;
            switch (mode) {
                case MODE.REGISTER:
                    response = await axios.post(`${API_URL}/user/register`, {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    });
                    console.log(response)
                    if (response.status === 201) {
                        toast.success("Registered Successfully")
                        setMode(MODE.LOGIN)
                        console.log("FormData Data:", formData);
                    } else {
                        toast.error("Something went wrong")
                    }
                    break;
                case MODE.LOGIN:
                    response = await axios.post(`${API_URL}/user/login`, { email: formData.email, password: formData.password });

                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.token)
                        console.log(response.data)
                        toast.success("Login Successfully")
                        dispatch(closeModal());
                        dispatch(fetchUserData())
                        if (response.data.userType === "admin") {
                            router.push('/dashboard')
                        } else {
                            router.push('/')
                        }
                        // router.push('/')
                    } else {
                        toast.error("Something went wrong")
                    }

                    break;
                case MODE.FORGOT_PASSWORD:
                    response = await axios.post(`${API_URL}/user/forgot-password`, {
                        email: formData.email
                    });
                    toast.success(response.data.message);
                    setMode(MODE.VERIFY_OTP);
                    break;
                case MODE.VERIFY_OTP:
                    response = await axios.post(`${API_URL}/user/verify-otp`, {
                        email: formData.email,
                        otp: formData.otp
                    });
                    toast.success(response.data.message);
                    setFormData(prev => ({ ...prev, token: response.data.token }));
                    setMode(MODE.RESET_PASSWORD);
                    break;
                case MODE.RESET_PASSWORD:
                    response = await axios.post(`${API_URL}/user/reset-password`, {
                        token: formData.token,
                        newPassword: formData.newPassword
                    });
                    toast.success(response.data.message);
                    setMode(MODE.LOGIN);
                    break;
                case MODE.EMAIL_VERIFICATION:
                    //   response = await axios.post(`${BASE_URL}/user/verify-email`, { email, emailCode });
                    break;
                default:
                    throw new Error('Invalid mode');
            }

            //   setMessage(response.data.message);
            // router.push('/'); // Redirect on success (example)
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };
    return (


        <form className="flex flex-col gap-8 overflow-y-auto h-full  rounded-2xl  w-full max-w-2xl p-6"
            onSubmit={handleSubmit}
        >
            <h1 className="text-3xl font-semibold text-redish2">{formTitle}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>

                {mode === MODE.REGISTER ? (
                    <>
                        <div className="col-span-2 flex flex-col gap-2">
                            <label className="text-18 text-redish ">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="john"
                                value={formData?.name}
                                className="ring-2 ring-redish rounded-md p-4"
                                onChange={handleChange}
                            />
                        </div>
                     
                    </>
                ) : null}

                {(mode === MODE.LOGIN || mode === MODE.FORGOT_PASSWORD || mode === MODE.REGISTER) ? (
                    <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-18 text-redish ">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@gmail.com"
                            value={formData?.email}
                            className="ring-2 ring-redish rounded-md p-4"
                            onChange={handleChange}
                            required
                        />
                    </div>
                ) : null}
                {mode === MODE.VERIFY_OTP && (
                    <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-18 text-redish ">OTP</label>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP sent to your email"
                            value={formData?.otp}
                            className="ring-2 ring-redish rounded-md p-4"
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {mode === MODE.RESET_PASSWORD && (
                    <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-18 text-redish ">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter your new password"
                            value={formData?.newPassword}
                            className="ring-2 ring-redish rounded-md p-4"
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
                    <>
                        <div className={`${mode === MODE.LOGIN ? 'col-span-2' : ''} flex flex-col gap-2`}>
                            <label className="text-18 text-redish ">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="ring-2 ring-redish rounded-md p-4"
                                onChange={handleChange}
                            />
                        </div>

                    </>
                ) : null}
                {mode === MODE.REGISTER &&
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-18 text-redish ">Confirm Passowrd</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="john"
                                value={formData?.confirmPassword}
                                className="ring-2 ring-redish rounded-md p-4"
                                onChange={handleChange}
                            />
                        </div>
                       
                       
                      
                        

                    </>}
            </div>
            {mode === MODE.LOGIN && (
                <div
                    className="text-18 underline cursor-pointer"
                    onClick={() => setMode(MODE.FORGOT_PASSWORD)}
                >
                    Forgot Password?
                </div>
            )}

            {mode === MODE.VERIFY_OTP && (
                <div
                    className="text-18 underline cursor-pointer"
                    onClick={() => setMode(MODE.FORGOT_PASSWORD)}
                >
                    Resend OTP
                </div>
            )}
            <button
                className=" text-white bg-redish p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : buttonTitle}
            </button>
            {error && <div className="text-red-600">{error}</div>}
            {mode === MODE.LOGIN && (
                <div
                    className="text-18 underline cursor-pointer"
                    onClick={() => setMode(MODE.REGISTER)}
                >
                    {"Don't"} have an account?
                </div>
            )}
            {mode === MODE.REGISTER && (
                <div
                    className="text-18 underline cursor-pointer"
                    onClick={() => setMode(MODE.LOGIN)}
                >
                    Have and account?
                </div>
            )}
            {mode === MODE.RESET_PASSWORD && (
                <div
                    className="text-18 underline cursor-pointer"
                    onClick={() => setMode(MODE.LOGIN)}
                >
                    Go back to Login
                </div>
            )}
            {message && <div className="text-redish2-600 text-18">{message}</div>}


        </form>


    )
}

export default AuthComponent