// import localFont from 'next/font/local'
import { Public_Sans, Nunito, Almarai } from 'next/font/google';

// export const terminalGrotesque = localFont({
//     src: './terminal-grotesque-webfont.woff2',
//     display: 'swap',
//     preload: true,
// });

export const publicSans = Public_Sans({
    subsets: ['latin'],
    preload: true,
});

export const nunito = Nunito({
    subsets: ['latin'],
    preload: true,
});

export const almarai = Almarai({
    subsets: ['arabic'],
    weight: '400',
    preload: true,
    display: 'swap'
});