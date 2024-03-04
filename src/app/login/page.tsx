"use client"

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session', session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ul className="w-full p-4 gap-4 relative">
        <li className="w-full relative">
          <button 
            className="inline-flex px-2 py-0.5 text-xs text-slate-600 border border-slate-500 cursor-pointer hover:bg-slate-100 relative"
            onClick={() => {
              signIn("kakao", { 
                redirect: true, 
                callbackUrl: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI, 
              });
            }}
            >
            카카오로 로그인
          </button>
        </li>
      </ul>
    </>
  )
}