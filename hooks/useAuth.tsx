import { async } from '@firebase/util'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
  } from 'firebase/auth'

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import toast, { Toaster } from 'react-hot-toast';

interface AuthProviderProps {
  children: React.ReactNode
}

interface IAuth  {
  user : User | null;
  signUp : (email : string , password : string) => Promise<boolean | undefined>;
  signIn : (email : string , password : string) => Promise<void>;
  logout : () => Promise<void>;
  error : string | null;
  loading : boolean;
}

const AuthContext = createContext<IAuth>(
  {
    user: null,
    signUp : async () => false,
    signIn : async () => {},
    logout : async () => {},
    error : null,
    loading : false
  }
);



export function AuthProvider(props : AuthProviderProps) {
    const [loading , setLoading] = useState(false);
    const [user , setUser] = useState<User | null>(null);
    const [error, setError] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const router = useRouter();

    useEffect(
      () =>
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // Logged in...
            setUser(user)
            setLoading(false)
          } else {
            // Not logged in...
            setUser(null)
            setLoading(true)
            router.push('/login')
          }
  
          setInitialLoading(false)
        }),
      [auth]
    )

    const signUp = async (email : string , password : string) => {
        // await createUserWithEmailAndPassword(auth,email, password).then(
        //     userCredential => {
        //         setUser(userCredential.user);
        //         return true;
        //     }
        // ).catch((err) => {
        //   alert(err.message);
        //   return false;
        // }).finally(() => setLoading(false))
        let userCredential = undefined;
        try {
          userCredential = await createUserWithEmailAndPassword(auth,email, password);
          if(userCredential) {
            setUser(userCredential.user);
            return true;
          }
        
        } catch (err) {
          return false;
        } finally {
          setLoading(false);
        }
    }

    const signIn = async (email : string , password : string) => {
      await signInWithEmailAndPassword(auth,email, password).then(
          userCredential => {
              setUser(userCredential.user);
              router.push("/");
          }
      ).catch((err) => {
        alert(err.message);
      }).finally(() => setLoading(false))
  }

  const logout = async () => {
    setLoading(true);

    signOut(auth).then(() => {
        setUser(null);
    }).catch((err) => {
        alert(err.message);
    }).finally(() => setLoading(false))
  }




  return (
    <AuthContext.Provider value={{user, signUp, signIn, error, loading, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}