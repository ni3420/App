import React, { useId, forwardRef } from 'react';

const Input = forwardRef(({ label, type = "text", error, ...props }, ref) => {
    const id = useId();
    return (
        <div className="w-full flex flex-col gap-1 mb-4">
            {label && <label htmlFor={id} className="text-sm font-semibold">{label}</label>}
            <input
                id={id}
                type={type}
                ref={ref}
                className={`p-2 border rounded-lg outline-none focus:ring-2 ${error ? "border-red-500" : "border-gray-300"}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error.message}</span>}
        </div>
    );
});

export default Input;