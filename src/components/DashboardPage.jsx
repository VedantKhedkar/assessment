// src/components/DashboardPage.jsx
"use client";

import { useEffect, useState } from "react";
import { encryptPassword, decryptPassword } from "@/lib/crypto";

// --- Edit Modal Component ---
const EditModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...item });
    const [decryptedPass, setDecryptedPass] = useState('');
    const [isPassVisible, setIsPassVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleShowPassword = () => {
        if (!isPassVisible) {
            setDecryptedPass(decryptPassword(item.encryptedPassword));
        }
        setIsPassVisible(!isPassVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const passwordToSend = isPassVisible ? decryptedPass : item.encryptedPassword;
        onSave({ ...formData, password: passwordToSend, isPasswordModified: isPassVisible });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="p-8 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Edit Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <input name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <div className="relative">
                        <input name="password" type={isPassVisible ? 'text' : 'password'} value={isPassVisible ? decryptedPass : '••••••••'} onChange={(e) => setDecryptedPass(e.target.value)} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                        <button type="button" onClick={handleShowPassword} className="absolute inset-y-0 right-0 px-3 text-sm" style={{ color: 'var(--text-color)' }}>{isPassVisible ? 'Hide' : 'Show'}</button>
                    </div>
                    <input name="url" value={formData.url} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Password Tools Component ---
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
        if (!availableChars) return;
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
        <div className="mb-8 p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--card-bg-color)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Password Generator</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>Length: {length}</label>
                            <input type="range" min="8" max="64" value={length} onChange={e => setLength(e.target.value)} className="w-full" />
                        </div>
                        <div className="flex items-center"><input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="mr-2" /> <span style={{ color: 'var(--text-color)' }}>Uppercase</span></div>
                        <div className="flex items-center"><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="mr-2" /> <span style={{ color: 'var(--text-color)' }}>Numbers</span></div>
                        <div className="flex items-center"><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="mr-2" /> <span style={{ color: 'var(--text-color)' }}>Symbols</span></div>
                        <button onClick={generatePassword} className="w-full px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">Generate</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Add New Item</h2>
                    <input type="text" placeholder="Title (e.g., Google)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <input type="text" placeholder="Username or Email" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <input type="text" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <input type="text" placeholder="URL (optional)" value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save to Vault</button>
                </form>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
export default function DashboardPage({ onLogout }) {
    const [vaultItems, setVaultItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const fetchVaultItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setError("Authentication token not found."); setIsLoading(false); return; }
        try {
            const response = await fetch('/api/vault', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch vault items.');
            const data = await response.json();
            setVaultItems(data);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchVaultItems(); }, []);

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
            fetchVaultItems();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/vault', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!response.ok) throw new Error('Failed to delete item.');
            setVaultItems(vaultItems.filter(item => item._id !== id));
        } catch (err) { alert(err.message); }
    };

    const handleOpenModal = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleUpdateItem = async (updatedItemData) => {
        const token = localStorage.getItem('token');
        try {
            const encryptedPassword = updatedItemData.isPasswordModified ? encryptPassword(updatedItemData.password) : updatedItemData.encryptedPassword;
            const response = await fetch('/api/vault', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...updatedItemData, encryptedPassword }),
            });
            if (!response.ok) throw new Error('Failed to update item.');
            const updatedData = await response.json();
            setVaultItems(vaultItems.map(item => item._id === updatedData._id ? { ...item, ...updatedData } : item));
            handleCloseModal();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>My Vault Dashboard</h1>
                    <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Logout</button>
                </div>
                
                <PasswordTools onAddItem={handleAddItem} />

                <div className="rounded-lg shadow" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                    <h2 className="text-xl font-semibold p-6" style={{ color: 'var(--text-color)' }}>Saved Items</h2>
                    {isLoading && <p className="p-6" style={{ color: 'var(--text-color)' }}>Loading your vault...</p>}
                    {error && <p className="p-6 text-red-600">Error: {error}</p>}
                    
                    {!isLoading && !error && (
                         <ul className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                            {vaultItems.length > 0 ? (
                                vaultItems.map(item => (
                                    <li key={item._id} className="p-6 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-lg" style={{ color: 'var(--text-color)' }}>{item.title}</p>
                                            <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>{item.username}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-800 mr-4">View/Edit</button>
                                            <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                        </div>
                                    </li>
                                ))
                            ) : ( <p className="p-6" style={{ opacity: 0.7, color: 'var(--text-color)' }}>Your vault is empty.</p> )}
                        </ul>
                    )}
                </div>
            </div>
            
            {isModalOpen && <EditModal item={currentItem} onClose={handleCloseModal} onSave={handleUpdateItem} />}
        </div>
    );
}