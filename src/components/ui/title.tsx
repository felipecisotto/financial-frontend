import { ReactNode } from "react"
import { Button } from "./button"

interface Props {
    value: string,
    primaryAction?: ReactNode,
}

export default function Title({ value, primaryAction }: Props) {

    return (
        <div className="flex flex-row">
            <p className="pb-6 font-bold text-4xl text-left content-start basis-11/12">{value}</p>
            {primaryAction ? <Button className="justify-self-end basis-1/12">{primaryAction}</Button> : ""}
        </div>
    )
}