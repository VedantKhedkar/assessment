// src/components/LandingPage.jsx

export default function LandingPage({ onNavigateToAuth }) {
    return (
        // Use the --bg-color variable for the main background
        <div 
            className="flex flex-col items-center justify-center min-h-screen text-center p-8"
            style={{ backgroundColor: 'var(--bg-color)' }}
        >
            <div className="max-w-2xl">
                {/* Use the --text-color variable for the main heading */}
                <h1 
                    className="text-4xl font-bold mb-4"
                    style={{ color: 'var(--text-color)' }}
                >
                    Secure Password Vault (MVP)
                </h1>
                {/* Use a slightly transparent version of the main text color for the subtitle */}
                <p 
                    className="text-lg mb-8"
                    style={{ color: 'var(--text-color)', opacity: 0.8 }}
                >
                    A full-stack web application designed to securely generate, store, and manage user passwords.
                </p>

                {/* Use --card-bg-color for this container */}
                <div 
                    className="p-6 rounded-lg shadow-md mb-8 text-left"
                    style={{ backgroundColor: 'var(--card-bg-color)' }}
                >
                    <h2 
                        className="text-2xl font-semibold mb-4"
                        style={{ color: 'var(--text-color)' }}
                    >
                        Key Features
                    </h2>
                    {/* The list items will inherit the text color */}
                    <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-color)' }}>
                        <li>**Secure Authentication:** User registration and login with hashed passwords and JWT sessions.</li>
                        <li>**Password Generator:** Create strong, customizable passwords on demand.</li>
                        <li>**Encrypted Vault:** Full CRUD (Create, Read, Update, Delete) functionality.</li>
                        <li>**Client-Side Encryption:** Vault passwords are encrypted in the browser before ever being sent to the server, ensuring zero-knowledge storage.</li>
                    </ul>
                </div>

                {/* This button's solid color works well on both themes, so it remains unchanged */}
                <button
                    onClick={onNavigateToAuth}
                    className="px-8 py-3 font-semibold text-white bg-indigo-700 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    Login / Register to Get Started
                </button>
            </div>
        </div>
    );
}