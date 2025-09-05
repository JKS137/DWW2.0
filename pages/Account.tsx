
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getProfile, Profile } from '../services/profileService';
import { Spinner } from '../components/icons/Spinner';
import ComingSoonModal from '../components/ComingSoonModal';

const Account: React.FC = () => {
    const { user, resendVerificationEmail } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const profileData = await getProfile(user);
                setProfile(profileData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleResendVerification = async () => {
        if (!user?.email) return;
        
        setNotification(null);
        const { error } = await resendVerificationEmail(user.email);
        if (error) {
            setNotification({ message: error.message, type: 'error' });
        } else {
            setNotification({ message: 'Verification email sent successfully!', type: 'success' });
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center py-16"><Spinner className="w-8 h-8" /></div>;
        }
        if (error) {
            return <div className="text-center py-16 px-6 bg-red-900/50 text-red-300 rounded-lg"><p>{error}</p></div>;
        }
        if (!profile || !user) {
            return <div className="text-center py-16 text-content-secondary">Could not load profile information.</div>;
        }

        const isVerified = user.email_confirmed_at;

        return (
            <div className="bg-base-200/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-base-300/50">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-content-primary">Email Address</h2>
                        <p className="text-content-secondary">{profile.email}</p>
                        <div className={`mt-2 text-sm px-2 py-1 inline-block rounded-full ${isVerified ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {isVerified ? 'Verified' : 'Not Verified'}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-content-primary">Subscription Plan</h2>
                        <p className="text-brand-secondary capitalize font-medium">{profile.plan}</p>
                    </div>

                    {!isVerified && (
                        <div className="pt-6 border-t border-base-300/50">
                             <h2 className="text-lg font-semibold text-content-primary">Actions</h2>
                             <p className="text-sm text-content-secondary mt-1 mb-4">Your account is not verified. Please check your inbox for a verification link.</p>
                             <button 
                                onClick={handleResendVerification}
                                className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-105 hover:shadow-glow-blue"
                            >
                                Resend Verification Email
                            </button>
                        </div>
                    )}

                    {notification && (
                        <div className={`mt-4 text-sm p-3 rounded-md ${notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {notification.message}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout onOpenComingSoonModal={() => setIsComingSoonModalOpen(true)}>
            <section className="animate-fade-in max-w-2xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-content-primary">Account Settings</h1>
                    <p className="text-content-secondary mt-1">Manage your account details and subscription.</p>
                </header>
                {renderContent()}
            </section>
            <ComingSoonModal isOpen={isComingSoonModalOpen} onClose={() => setIsComingSoonModalOpen(false)} featureName="This feature" />
        </Layout>
    );
};

export default Account;
