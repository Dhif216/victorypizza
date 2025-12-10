import { useState } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { authAPI } from '../services/api';

interface UserSettingsProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onClose: () => void;
  currentUser: {
    username: string;
    email: string;
    name?: string;
    role: string;
  };
}

export function UserSettings({ language, theme, onClose, currentUser }: UserSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState(currentUser.email);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(language === 'fi' ? 'Salasanat eivät täsmää' : 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError(language === 'fi' ? 'Salasanan on oltava vähintään 6 merkkiä' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword(currentPassword, newPassword);
      setSuccess(language === 'fi' ? 'Salasana vaihdettu onnistuneesti!' : 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.response?.data?.message || (language === 'fi' ? 'Salasanan vaihto epäonnistui' : 'Failed to update password'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setError(language === 'fi' ? 'Virheellinen sähköpostiosoite' : 'Invalid email address');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updateEmail(newEmail);
      setSuccess(language === 'fi' ? 'Sähköposti päivitetty onnistuneesti!' : 'Email updated successfully!');
    } catch (error: any) {
      setError(error.response?.data?.message || (language === 'fi' ? 'Sähköpostin päivitys epäonnistui' : 'Failed to update email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900 border border-gray-800'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b flex justify-between items-center ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
        }`}>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {language === 'fi' ? 'Asetukset' : 'Settings'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
            <div className="flex items-center gap-3 mb-3">
              <UserIcon className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
              <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Käyttäjätiedot' : 'User Information'}
              </span>
            </div>
            <div className={`text-sm space-y-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <p><strong>{language === 'fi' ? 'Käyttäjätunnus:' : 'Username:'}</strong> {currentUser.username}</p>
              <p><strong>{language === 'fi' ? 'Rooli:' : 'Role:'}</strong> {currentUser.role}</p>
              {currentUser.name && <p><strong>{language === 'fi' ? 'Nimi:' : 'Name:'}</strong> {currentUser.name}</p>}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Update Email */}
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className={`p-4 rounded-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Mail className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {language === 'fi' ? 'Vaihda sähköposti' : 'Change Email'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'fi' ? 'Uusi sähköposti' : 'New Email'}
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-gray-800 border-gray-600 text-white'
                    } focus:ring-2 focus:ring-amber-500 outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || newEmail === currentUser.email}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? (language === 'fi' ? 'Päivitetään...' : 'Updating...') : (language === 'fi' ? 'Päivitä sähköposti' : 'Update Email')}
                </button>
              </div>
            </div>
          </form>

          {/* Update Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className={`p-4 rounded-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Lock className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {language === 'fi' ? 'Vaihda salasana' : 'Change Password'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'fi' ? 'Nykyinen salasana' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-gray-800 border-gray-600 text-white'
                    } focus:ring-2 focus:ring-amber-500 outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'fi' ? 'Uusi salasana' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-gray-800 border-gray-600 text-white'
                    } focus:ring-2 focus:ring-amber-500 outline-none`}
                    required
                    minLength={6}
                  />
                  <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'fi' ? 'Vähintään 6 merkkiä' : 'At least 6 characters'}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'fi' ? 'Vahvista salasana' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-gray-800 border-gray-600 text-white'
                    } focus:ring-2 focus:ring-amber-500 outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? (language === 'fi' ? 'Päivitetään...' : 'Updating...') : (language === 'fi' ? 'Vaihda salasana' : 'Change Password')}
                </button>
              </div>
            </div>
          </form>

          {/* Security Note */}
          <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-amber-50 border border-amber-200' : 'bg-amber-900/20 border border-amber-800'}`}>
            <p className={`text-sm ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>
              {language === 'fi' 
                ? '💡 Suojaa tilisi käyttämällä vahvaa salasanaa ja vaihtamalla se säännöllisesti.'
                : '💡 Protect your account by using a strong password and changing it regularly.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
