import { useState } from 'react';

export default function FileItem ({ file, onDelete, handleToggleNSFW }: { file: any, onDelete: (uid: string) => void, handleToggleNSFW: (e: any) => void}){
    const [isNSFW, setIsNSFW] = useState(false);

    const handleInsideToggleNSFW = (e: any) => {
        setIsNSFW(!isNSFW);
        handleToggleNSFW(file.uid);
    };


    return (
        <div className="flex flex-col items-center">
            <img
                src={file.preview}
                alt={file.name}
                className="rounded-md border border-gray-300 mb-2 mr-2 w-24 h-24 p-1"
            />
            <div className="flex items-center">
                <label htmlFor={`toggle-nsfw-${file.uid}`} className="mr-2">NSFW:</label>
                <input
                    id={`toggle-nsfw-${file.uid}`}
                    type="checkbox"
                    checked={isNSFW}
                    onChange={handleInsideToggleNSFW}
                    className="form-checkbox h-5 w-5 text-gray-600"
                />
            </div>
            <button
                onClick={() => onDelete(file.uid)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
            >
                Delete
            </button>
        </div>
    );
};