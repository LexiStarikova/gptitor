import { createContext } from 'react';

export const SendContext = createContext<{
    isSended: boolean;
    setIsSended: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    isSended: true,
    setIsSended: () => {}
});