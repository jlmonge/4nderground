import { useEffect } from 'react';

export function useAutosizeTextArea(textAreaRef, value) {
    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.style.height = '0px';
            const scrollHeight = textAreaRef.scrollHeight;

            textAreaRef.style.height = scrollHeight + 'px';
        }
    }, [textAreaRef, value]);
}