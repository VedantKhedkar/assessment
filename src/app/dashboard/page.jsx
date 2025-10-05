// src/app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { encryptPassword } from "@/lib/crypto";

// PasswordTools component remains the same as before
const PasswordTools = ({ onAddItem }) => {
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const generatePassword = () => {
        const charSets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
        };
        let availableChars = charSets.lowercase;
        if (includeUppercase) availableChars += charSets.uppercase;
        if (includeNumbers) availableChars += charSets.numbers;
        if (includeSymbols) availableChars += charSets.symbols;
        let generated = '';
        for (let i = 0; i < length; i++) {
            generated += availableChars[Math.floor(Math.random() * availableChars.length)];
        }
        setPassword(generated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !username || !password) return alert('Title, Username, and Password are required.');
        onAddItem({ title, username, password, url });
        setTitle(''); setUsername(''); setPassword(''); setUrl('');
    };

    return (
        <div className="mb-8 p-6 bg-gray-600 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Password Generator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Length: {length}</label>
                        <input type="range" min="8" max="64" value={length} onChange={e => setLength(e.target.value)} className="w-full" />
                    </div>
                    <div className="flex items-center"><input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="mr-2" /> Uppercase</div>
                    <div className="flex items-center"><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="mr-2" /> Numbers</div>
                    <div className="flex items-center"><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="mr-2" /> Symbols</div>
                    <button onClick={generatePassword} className="w-full px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">Generate</button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Title (e.g., Google)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                    <input type="text" placeholder="Username or Email" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                    <input type="text" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                    <input type="text" placeholder="URL (optional)" value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save to Vault</button>
                </div>
            </form>
        </div>
    );
};


export default function DashboardPage() {
    const [vaultItems, setVaultItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVaultItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setError("Authentication token not found."); return; }
        try {
            const response = await fetch('/api/vault', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch vault items.');
            const data = await response.json();
            setVaultItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVaultItems();
    }, []);

    const handleAddItem = async (newItem) => {
        const token = localStorage.getItem('token');
        try {
            const encryptedPassword = encryptPassword(newItem.password);
            const response = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newItem, encryptedPassword }),
            });
            if (!response.ok) throw new Error('Failed to add item.');
            fetchVaultItems(); // Refresh the list
        } catch (err) {
            alert(err.message);
        }
    };

    // --- NEW FUNCTION TO HANDLE DELETION ---
    const handleDeleteItem = async (id) => {
        // Ask for confirmation before deleting
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/vault', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id }), // Send the ID of the item to delete
            });

            if (!response.ok) {
                throw new Error('Failed to delete item.');
            }
            
            // Update the UI instantly by removing the item from the state
            setVaultItems(vaultItems.filter(item => item._id !== id));

        } catch (err) {
            alert(err.message); // Show error to the user
        }
    };
    // --- END OF NEW FUNCTION ---

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Vault Dashboard</h1>
                
                <PasswordTools onAddItem={handleAddItem} />

                <div className="bg-gray-600 rounded-lg shadow">
                    <h2 className="text-xl font-semibold p-6">Saved Items</h2>
                    {isLoading && <p className="p-6">Loading your vault...</p>}
                    {error && <p className="p-6 text-red-600">Error: {error}</p>}
                    
                    {!isLoading && !error && (
                         <ul className="divide-y divide-gray-200">
                            {vaultItems.length > 0 ? (
                                vaultItems.map(item => (
                                    <li key={item._id} className="p-6 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-lg">{item.title}</p>
                                            <p className="text-gray-600">{item.username}</p>
                                        </div>
                                        <div>
                                            <button className="text-indigo-600 hover:text-indigo-800 mr-4">View/Edit</button>
                                            {/* --- UPDATED DELETE BUTTON --- */}
                                            <button 
                                                onClick={() => handleDeleteItem(item._id)} 
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="p-6 text-gray-500">Your vault is empty.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
