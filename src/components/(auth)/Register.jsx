'use client';

import Image from "next/image";
import {Alert, AlertTitle} from "@/components/Alert";
import {AtSign, CheckCircle2Icon, Eye, EyeOff, Key, UserRound, XCircle} from "lucide-react";
import { useState} from "react";
import {HashLoader} from "react-spinners";
import {useAuth} from "@/context/AuthContext";
import {signIn} from "next-auth/react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/Tooltip";
import { validateEmail, validatePassword, validateUsername, debounce } from "@/lib/utils";

const Register = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [fieldsError, setFieldsError] = useState({});
    const [globalError, setGlobalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const [isCreationSuccess, setIsCreationSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { isLoading, isAuthenticated, user, refetchData } = useAuth();


    const validateErrors = () => {
        const errors = {};
        if (!formData.username.trim()) {
            errors.username = "Please enter a username.";
        } else if (!validateUsername(formData.username)) {
            errors.username = "Username must be at least 3 characters, only letters, numbers, and underscores.";
        }
        if (!formData.email.trim()) {
            errors.email = "Please enter your email address.";
        } else if (!validateEmail(formData.email)) {
            errors.email = "That doesn't look like a valid email.";
        }
        if (!formData.password.trim()) {
            errors.password = "Please enter a password.";
        } else if (!validatePassword(formData.password)) {
            errors.password = "Password must be at least 8 characters, include a letter, a number, and a special character.";
        }
        setFieldsError(errors);
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateErrors();
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        await fetch("/api/register", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(formData),
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    setGlobalError(data.error);
                    setIsCreationSuccess(false);
                } else {
                    setIsSuccess(data.message);
                    setIsCreationSuccess(true);
                    setGlobalError("");
                    setFieldsError("none");
                    refetchData();
                }
            }).catch(err => {
                console.log(err);
                setGlobalError("Something went wrong");
                setIsCreationSuccess(false);
                setIsSuccess("");
            }).finally(()=> {
                setIsSubmitting(false);
            });
    }

    // Wrap handleSubmit with debounce
    const debouncedHandleSubmit = debounce(handleSubmit, 350);

    const handleGoogleAuth = async () => {
        if(user?.authProvider?.includes('google')) {
            return;
        }
        setIsSubmitting(true);
        try {
            await signIn('google', {
                callbackUrl: '/'
            });
            setIsSuccess("Successfully logged in");
            setIsCreationSuccess(true);
        }catch (e) {
            console.log(e);
            setGlobalError("Something went wrong");
            setIsCreationSuccess(false);
            setIsSuccess(false)
        }finally {
            setIsSubmitting(false);
        }
    }

    const handleGithubAuth = async () => {
        if(user?.authProvider?.includes('github')) {
            return;
        }
        setIsSubmitting(true);
        try {
            await signIn('github', {
                callbackUrl: '/'
            });
            setIsSuccess("Successfully logged in");
            setIsCreationSuccess(true);
        }catch (e) {
            console.log(e);
            setGlobalError("Something went wrong");
            setIsCreationSuccess(false);
            setIsSuccess(false)
        }finally {
             setIsSubmitting(false);
        }
    }

    // Password strength calculation
    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
        return score;
    };

    return (
        <div className={"space-y-4"}>
            <div className={"flex items-center justify-center gap-5 flex-wrap"}>
                <Tooltip>
                    <TooltipTrigger>
                        <p  onClick={handleGoogleAuth}
                                className={`${isCreationSuccess || isLoading || user?.authProvider?.includes('google') && 'disable-custom-element'} flex items-center justify-center p-4 rounded-xl  bg-[#1a1a1c] w-24 h-12 hover:bg-[#1a1a1c]/70 hover:scale-105 transition-all duration-500 cursor-pointer`}>
                            <Image src={"/images/google.svg"} alt={"Google"} width={30} height={30}/>
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{user?.authProvider.includes('google') ? "Already Logged In with Google !" : "Log in with google"}</p>
                    </TooltipContent>
                </Tooltip>

               <Tooltip>
                   <TooltipTrigger>
                       <p onClick={handleGithubAuth}
                               className={`${isCreationSuccess || isLoading || user?.authProvider?.includes('github') && 'disable-custom-element'} flex items-center justify-center p-4 rounded-xl  bg-[#1a1a1c] w-24 h-12 hover:bg-[#1a1a1c]/70 hover:scale-105 transition-all duration-500 cursor-pointer`}>
                           <Image src={"/images/github.svg"} alt={"GitHub"} width={30} height={30}/>
                       </p>
                   </TooltipTrigger>
                   <TooltipContent>
                       <p>{user?.authProvider.includes('github') ? "Already Logged In with GitHub !" : "Log in with GitHub"}</p>
                   </TooltipContent>
               </Tooltip>
            </div>

            <div className={"flex items-center justify-between gap-1"}>
                <div className={"flex-1 w-full h-1 bg-white rounded"}></div>
                <p>OR</p>
                <div className={"flex-1 w-full h-1 bg-white rounded"}></div>
            </div>

            {globalError && (
                <Alert variant={"destructive"}>
                    <XCircle/>
                    <AlertTitle>{globalError}</AlertTitle>
                </Alert>
            )}

            {isSuccess && (
                <Alert variant={"success"}>
                    <CheckCircle2Icon/>
                    <AlertTitle>{isSuccess}</AlertTitle>
                </Alert>
            )}

            <form className={"space-y-4"} onSubmit={debouncedHandleSubmit}>
                <div className={"flex flex-col gap-1"}>
                    <div className={`flex items-center justify-between gap-2 border-2 bg-[whitesmoke] p-2 rounded-2xl ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}>
                        <UserRound className={"w-6 h-6 text-black opacity-80"}/>
                        <p className={"text-black/80"}> |</p>
                        <input
                            type={"text"}
                            placeholder={"Enter Your Name..."}
                            className={`flex-1 w-full p-2 text-black border-none outline-none focus:bg-none ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}
                            disabled={isCreationSuccess || isLoading || isAuthenticated}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} // ✅ changed
                            value={formData.username}
                        />
                    </div>
                    {fieldsError.username && (
                        <p className="text-red-600 text-sm ml-2">{fieldsError.username}</p>
                    )}
                </div>

                <div className={"flex flex-col gap-1"}>
                    <div className={`flex items-center justify-between gap-2 border-2 bg-[whitesmoke] p-2 rounded-2xl ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}>
                        <AtSign className={"w-6 h-6 text-black opacity-80"}/>
                        <p className={"text-black/80"}> |</p>
                        <input
                            type={"email"}
                            placeholder={"Enter Your Email..."}
                            className={`flex-1 w-full p-2 text-black border-none outline-none focus:bg-none ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}
                            disabled={isCreationSuccess || isLoading || isAuthenticated}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            value={formData.email}
                        />
                    </div>
                    {fieldsError.email && (
                        <p className="text-red-600 text-sm ml-2">{fieldsError.email}</p>
                    )}
                </div>

                <div className={"flex flex-col gap-1"}>
                    <div className={`flex items-center justify-between gap-2 bg-[whitesmoke] border-2 p-2 rounded-2xl ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}>
                        <Key className={"w-6 h-6 text-black opacity-80"}/>
                        <p className={"text-black/80"}> |</p>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder={"••••••••"}
                            disabled={isCreationSuccess || isLoading || isAuthenticated}
                            className={`flex-1 w-full p-2 text-black border-none outline-none focus:bg-none ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}
                            onChange={(e) => {
                                setFormData({...formData, password: e.target.value});
                                setPasswordStrength(getPasswordStrength(e.target.value));
                            }}
                            value={formData.password}
                        />
                        <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? <EyeOff
                                    className={"w-6 h-6 text-black opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-300"}/> :
                                <Eye
                                    className={"w-6 h-6 text-black opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-300"}
                                />}
                        </div>
                    </div>
                    {fieldsError.password && (
                        <p className="text-red-500 text-sm">{fieldsError.password}</p>
                    )}
                </div>

                {/* Password strength meter */}
                {formData.password && (
                    <div className="w-full mt-1">
                        <div className="h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                                className={`h-2 rounded transition-all duration-300 ${
                                    passwordStrength <= 2 ? 'bg-red-500 w-1/3' : passwordStrength === 3 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                                }`}
                            />
                        </div>
                        <p className={`text-xs mt-1 ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {passwordStrength <= 2 ? 'Weak password' : passwordStrength === 3 ? 'Medium strength' : 'Strong password!'}
                        </p>
                    </div>
                )}

                <button type={"submit"} disabled={isSubmitting || isCreationSuccess || isLoading || isAuthenticated}
                        className={"w-full h-auto px-4 py-3 rounded-2xl shadow-2xl bg-green-300 dark:bg-white text-black cursor-pointer hover:bg-gray-200 transition-all duration-500"}>
                    {isSubmitting ? <p className={"flex items-center justify-center gap-3"}><HashLoader size={15} color={"#000"}/> Creating Account...</p> : "Register Account"}
                </button>
            </form>

            <div className={"flex items-center justify-between gap-2 mb-3"}>
                {
                    !isAuthenticated &&
                        <p>Already have an account?  <button className={"link-animated cursor-pointer"}>Login Now</button></p>
                }

            </div>
        </div>
    )
}

export default Register;