import styles from '../../styles/Textpage.module.scss';

export const metadata = {
    title: 'Rules',
};

const RULES = [{
    id: 0,
    desc: 'Do not upload copyrighted content.',
}, {
    id: 1,
    desc: 'Do not share content that violates local or United States law.',
}, {
    id: 2,
    desc: 'Do not spam or attempt to evade spam filters.',
}, {
    id: 3,
    desc: 'Do not post low-quality content. Examples of this are empty recordings and irrelevant comments.',
}, {
    id: 4,
    desc: 'Do not post or request personal information. Examples of this are doxxing and recording of private conversation.',
}, {
    id: 5,
    desc: "Do not post or share material that interferes with users' security and privacy.",
}, {
    id: 6,
    desc: 'Do not harass others via racism or threats.'
}, {
    id: 7,
    desc: 'Do not impersonate admins and/or moderators.'
}];

export default function RulesPage() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Rules</h2>
            <ol className={styles["ol"]}>
                {
                    RULES.map(r =>
                        <li className={styles["li"]} key={r.id}>{r.desc}</li>
                    )
                }
            </ol>
        </div>
    );
}