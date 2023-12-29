import localFont from 'next/font/local'
import { Public_Sans } from 'next/font/google';

export const terminalGrotesque = localFont({
    src: './terminal-grotesque-webfont.woff2',
    display: 'swap',
    preload: true,
});

export const publicSans = Public_Sans({
    subsets: ['latin'],
    preload: true,
});