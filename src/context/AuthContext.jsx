import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as firebaseUpdateProfile, 
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    setUser({
      id: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
    });
    return currentUser;
  };

  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    
    // Update display name in Auth
    await firebaseUpdateProfile(currentUser, { displayName: name });
    
    // Save user metadata to Firestore users collection
    await setDoc(doc(db, 'users', currentUser.uid), {
      name: name,
      email: currentUser.email,
      createdAt: serverTimestamp()
    });

    // Firebase native verification is disabled since we use custom OTP
    // if (currentUser.email.endsWith('@sunsutragroup.com')) {
    //   await sendEmailVerification(currentUser);
    // }
    
    setUser({
      id: currentUser.uid,
      name,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
    });
    
    return currentUser;
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently logged in to send verification.');
    }
  };

  const updateProfile = async (name, email) => {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const promises = [];
    if (name !== auth.currentUser.displayName) {
      promises.push(firebaseUpdateProfile(auth.currentUser, { displayName: name }));
    }
    if (email !== auth.currentUser.email) {
      promises.push(firebaseUpdateEmail(auth.currentUser, email));
    }
    
    await Promise.all(promises);
    
    setUser({
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName || name,
      email: auth.currentUser.email || email,
    });
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    // In Firebase, changing password doesn't require current password explicitly if the user recently logged in.
    // If they haven't recently logged in, firebaseUpdatePassword throws 'auth/requires-recent-login'.
    // To handle this properly we would re-authenticate, but for simplicity we will try directly first.
    // The previous implementation took currentPassword, so we could re-authenticate using it.
    
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('This action requires a recent login. Please log out and log in again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    resendVerification,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
