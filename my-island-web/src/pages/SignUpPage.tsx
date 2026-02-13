import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImage, validateFile } from '../services/imageService';

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setProfilePhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signup(name, email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
            setIsLoading(false);
            return;
        }

        // Upload profile photo after signup (non-blocking — don't fail signup if upload fails)
        if (profilePhoto) {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (storedUser.id) {
                    await uploadImage('USER', storedUser.id, profilePhoto, { primary: true });
                }
            } catch (err) {
                console.error('Profile photo upload failed:', err);
            }
        }

        setIsLoading(false);
        navigate('/personalize');
    };

    return (
        <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <header className="flex items-center justify-between px-4 py-3 shrink-0">
                <Link to="/signin" className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Sign Up</h2>
                <div className="size-10"></div>
            </header>

            <div className="px-6 py-2 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#111418] dark:text-gray-200 text-sm font-medium">Step 1 of 2</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">Account Details</p>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2 rounded-full"></div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-24">
                <div className="mb-6">
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-2">
                        Create your account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                        Book the best camping spots across Ireland and start your adventure.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center gap-2 mb-2">
                        <div className="relative group cursor-pointer">
                            <input accept="image/*" className="hidden" id="profile-upload" type="file" onChange={handlePhotoChange} />
                            <label className="flex h-24 w-24 items-center justify-center rounded-full bg-background-light dark:bg-background-dark border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all cursor-pointer overflow-hidden" htmlFor="profile-upload">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-[32px]">photo_camera</span>
                                )}
                            </label>
                            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-white dark:ring-[#1a2632] hover:scale-105 transition-transform cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">{photoPreview ? 'edit' : 'add'}</span>
                            </label>
                        </div>
                        <label htmlFor="profile-upload" className="text-sm font-bold text-primary hover:text-[#20d85f] transition-colors cursor-pointer">
                            {photoPreview ? 'Change Photo' : 'Add Photo'}
                        </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="fullname">Full Name</label>
                        <div className="relative group">
                            <input
                                className="peer block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                id="fullname"
                                placeholder="e.g. Ciara O'Connor"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">mail</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6 pr-12"
                                id="password"
                                placeholder="Min. 8 characters"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-500 hover:text-[#111418] dark:hover:text-white transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 pl-1">Must contain at least 8 characters</p>
                    </div>
                </form>

                <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500 leading-relaxed px-4">
                    By creating an account, you agree to our <Link to="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                </p>
            </main>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating account...' : 'Continue'}
                </button>
                <div className="mt-4 text-center">
                    <span className="text-[#111418] dark:text-gray-300 text-sm font-medium">Already have an account? </span>
                    <Link to="/signin" className="text-primary hover:text-[#20d85f] text-sm font-bold transition-colors">Log in</Link>
                </div>
            </div>
        </div>
    );
};
