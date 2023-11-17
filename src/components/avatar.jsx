export default function Avatar({ userId }) {
    return (
        <div
            style={{
                backgroundColor: "white",
                width: "48px",
                height: "48px",
            }}
            title={userId ?? 'disappointing.'} // show userid on hover
        >

        </div>
    );
}