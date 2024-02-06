function FormField({ attr, text }) {
    return (
        <>
            <label>
                <input {...attr} autoComplete="on" required />
                {text ?? ''}
            </label>
            <br />
        </>
    );
}

export function EmailField() {
    return (
        <FormField
            attr={{
                type: 'email',
                name: 'email',
                placeholder: 'E-mail',
            }}
        />
    );
}

export function PasswordField({ name, placeholder }) {

    return (
        <FormField
            attr={{
                type: 'password',
                name: name ?? 'password',
                placeholder: placeholder ?? 'Password',
            }}
        />
    );
}

function CheckboxField({ name, text }) {
    return (
        <FormField
            attr={{
                type: 'checkbox',
                name: name,
            }}
            text={text}
        />
    );
}

export function TCPPField() {
    return (
        <CheckboxField
            name="tcpp-agree"
            text=""
        />
    );
}