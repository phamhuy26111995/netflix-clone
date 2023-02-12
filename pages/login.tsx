import React , { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, SubmitHandler  } from "react-hook-form";
import useAuth from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

interface Inputs {
  email: string;
  password: string;
}

const notify = () => toast.success('Sign up successfully !');

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [login , setLogin] = useState(false);
  const { signIn, signUp } = useAuth();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if(login) {
      signIn(data.email, data.password)
    } else {
      let result = await signUp(data.email, data.password);

      if(result) {
        notify();
      }
    }
  };

  

  return (
    <div className="relative flex h-screen w-screen bg-black 
    md:items-center md:justify-center md:bg-transparent">
        <Head>
            <title>Netflix - Login Page</title>
            <link rel="icon" href="/netflix.png"/>
        </Head>
        <Image
            src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
            fill={true}
            alt="Login Background"
            className="-z-10 !hidden opacity-60 sm:!inline"
        />
        <Link href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            width={150}
            height={150}
            className="absolute top-4 left-4 cursor-pointer object-contain md:left-10 md:top-6"
          />
        </Link>
        <form className="relative mt-24 space-y-8 rounded bg-black/75 py-10 
        px-6 md:mt-0 md:max-w-md md:px-14" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-4xl font-semibold">Sign In</h1>
            <div className="space-y-4">
              <label className="inline-block w-full">
                <input {...register("email", {required : true})}  className="w-full rounded bg-[#333] px-5 py-3.5 placeholder-[gray] outline-none 
                focus:bg-[#454545]" type="email" placeholder="Email" />
              </label>
              {errors.email && <span style={{color : 'red'}}>Please enter your email address</span>}
              <label className="inline-block w-full">
              <input {...register("password", {required: true})} className="w-full rounded bg-[#333] px-5 py-3.5 placeholder-[gray] outline-none 
                focus:bg-[#454545]" type="password" placeholder="Password" />
              </label>
              {errors.password &&  <span style={{color : 'red'}}>Please enter your password</span>}
            </div>
        <button type='submit' onClick={() => setLogin(true)} className="w-full rounded bg-[#e50914] py-3 font-semibold">Sign In</button>    
        
        <div className="">
          <span style={{marginRight: '10px', color:'gray'}}>New to Netflix?</span>
          <button type='submit' className="text-white hover:underline" onClick={() => {
            setLogin(false);
              
          }}>Sign up now</button>
          <Toaster />
        </div>
        </form>
    </div>
  )
}

export default Login;