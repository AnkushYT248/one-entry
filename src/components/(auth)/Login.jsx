'use client';

import Image from "next/image";
import {AtSign, CheckCircle2Icon, Eye, EyeOff, Key, PopcornIcon, XCircle} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/Alert";
import {useAuth} from "@/context/AuthContext";
import {HashLoader} from "react-spinners";
import {signIn} from "next-auth/react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/Tooltip";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [fieldsError, setFieldsError] = useState({});
    const [globalError, setGlobalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const [isCreationSuccess, setIsCreationSuccess] = useState(false);
    const { isLoading, isAuthenticated, user, refetchData } = useAuth();


    const validateErrors = () => {
        const errors = {};
        const emailRegex = /^[a-z0-9._-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,63}$/;
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }
        setFieldsError(errors);
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateErrors();
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if(!res.ok) {
                setGlobalError(data.error);
                setIsSuccess(null);
            }
            if(res.ok) {
                setIsSuccess(data.message);
                setIsCreationSuccess(true);
                refetchData();
                setGlobalError("");
                setFieldsError("");
            }
        }catch (e) {
            setGlobalError("Something went wrong");
            console.error(e);
            setIsSuccess("");
        }finally {
            setIsSubmitting(false);
        }
    };

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
            setGlobalError("Something went wrong");
            console.error(e);
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
            setGlobalError("Something went wrong");
            console.error(e);
            setIsSuccess(false)
        }finally {
            setIsSubmitting(false);
        }
    }

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
                <div className={"flex-1 w-full h-1 bg-black/70 dark:bg-white rounded"}></div>
                <p>OR</p>
                <div className={"flex-1 w-full h-1 bg-black/70 dark:bg-white rounded"}></div>
            </div>

            {globalError && (
                <Alert variant={"destructive"}>
                    <XCircle />
                    <AlertTitle>{globalError}</AlertTitle>
                </Alert>
            )}

            {isSuccess && (
                <Alert variant={"success"}>
                    <CheckCircle2Icon  />
                    <AlertTitle>{isSuccess}</AlertTitle>
                </Alert>
            )}

            <form className={"space-y-4"} onSubmit={handleSubmit}>
                <div className={"flex flex-col gap-1"}>
                    <div className={`flex items-center justify-between gap-2 border-2 bg-[whitesmoke] p-2 rounded-2xl ${fieldsError.email && "border-red-600 outline-red-600"}  ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}>
                        <AtSign className={"w-6 h-6 text-black opacity-80"}/>
                        <p className={"text-black/80"}> |</p>
                        <input
                            type={"email"}
                            placeholder={"Enter Your Email..."}
                            className={`flex-1 w-full p-2 text-black border-none outline-none focus:bg-none ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}
                            disabled={isCreationSuccess || isLoading || isAuthenticated}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            value={formData.email}
                        />
                    </div>
                    {fieldsError.email && (
                        <p className="text-red-600 text-sm ml-2">{fieldsError.email}</p>
                    )}
                </div>

                <div className={"flex flex-col gap-1"}>
                    <div className={`flex items-center justify-between gap-2 bg-[whitesmoke] border-2 p-2 rounded-2xl ${fieldsError.password && "border-red-500 outline-red-500"} ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}>
                        <Key className={"w-6 h-6 text-black opacity-80"}/>
                        <p className={"text-black/80"}> |</p>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder={"••••••••"}
                            className={`flex-1 w-full p-2 text-black border-none outline-none focus:bg-none ${isCreationSuccess || isLoading || isAuthenticated && "opacity-85 cursor-not-allowed"}`}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            value={formData.password}
                        />
                      <div onClick={()=> setIsPasswordVisible(!isPasswordVisible)}>
                          {isPasswordVisible ? <EyeOff className={"w-6 h-6 text-black opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-300"}/> : <Eye
                              className={"w-6 h-6 text-black opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-300"}
                          />}
                      </div>
                    </div>
                    {fieldsError.password && (
                        <p className="text-red-500 text-sm">{fieldsError.password}</p>
                    )}
                </div>

                <button type={"submit"} disabled={isSubmitting || isLoading || isAuthenticated} className={"w-full h-auto px-4 py-3 rounded-2xl shadow-2xl bg-green-300 dark:bg-white text-black cursor-pointer hover:bg-gray-200 transition-all duration-500"}>
                    {isSubmitting ? (
                        <div className={"flex items-center justify-center gap-2"}>
                            <HashLoader size={20} color={"#1a1a1c"}/>
                            <p>Logging in...</p>
                        </div>
                    ) :
                    "Sign In"}
                </button>
            </form>

            {!isCreationSuccess || !isLoading || !isAuthenticated && (
                <div className={"flex items-center justify-between gap-2"}>
                    <Link href={"/public"} className={"link-animated cursor-pointer"}>Forgot Password?</Link>
                    <button className={"link-animated cursor-pointer"}>Create New Account</button>
                </div>
            )}
        </div>
    );
};
export default Login;