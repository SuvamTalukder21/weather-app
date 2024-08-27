import { cn } from "@/utils/cn";
import React from "react"
import { IoSearch } from "react-icons/io5";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox (props: Props) {
    return (
        <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10", props.className)}>
            <input onChange={props.onChange} type="text" placeholder="Search location..." className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full" />
            <button type="submit" className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 h-full">
                <IoSearch />
            </button>
        </form>
    )
}

// /* The properties for the {@link SearchBox} component. */
// interface Props {
//     /* An optional CSS class name for the search box. */
//     className?: string;

//     /* The current value of the search input. */
//     value: string;

//     /* An event handler for the change event of the search input. */
//     onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;

//     /* An event handler for the submit event of the form. */
//     onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
// }


