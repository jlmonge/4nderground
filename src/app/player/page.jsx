import Player from '../../components/player.jsx';

export const metadata = {
    title: 'Player',
};

// function UserStatus({ user }) {
//     if (!user) {
//         return (
//             <p>Welcome to our Player. You are not logged in.</p>
//         );
//     }
//     return (
//         <p>Welcome to our Player. You are logged in. {user.email}</p>
//     );
// }

export default async function PlayerPage() {
    return (
        <>
            <Player />
        </>
    );
}