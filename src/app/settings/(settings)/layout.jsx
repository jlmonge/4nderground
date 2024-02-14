import FancyLink from '../../../components/Shared/fancylink';

export default function SettingsLayout({ children }) {
    return (
        <>
            <FancyLink href="/settings" text="Return to settings" btnRight={false} />
            {children}
        </>
    );
}