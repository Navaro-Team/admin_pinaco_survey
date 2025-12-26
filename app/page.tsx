"use client"
import { useAppSelector } from "@/hooks/redux";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function Splash() {
    const isLogged = useAppSelector((state: any) => state.app.isLogged);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            if (isLogged) {
                router.push('/dashboard')
            } else {
                router.push('/login')
            }
        }, 1500)
    }, [isLogged, router])

    return <div className="flex flex-col gap-4 items-center justify-center h-screen bg">
        <Image src="/assets/logo.png" alt="Logo" width={350} height={300} />
        <Spinner className="size-12 text-main" />
    </div>
}