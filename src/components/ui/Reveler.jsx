'use client'
import {useReveler} from "@/components/ui/transitions/useReveler";

const Reveler = () => {
    useReveler();
    return (
        <div className={"reveler flex items-center justify-center flex-col gap-2"}>
            <h2 className={'text-7xl font-bold -tracking-wider'}>One Entry</h2>
        </div>
    )
}

export default  Reveler