import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';

// User's provided Firebase configuration for KanjiViet
export const firebaseConfig = {
  apiKey: "AIzaSyCnlFe_ODQ4g9e2A5dA8LJ6gVdN-lwAOM4",
  authDomain: "kanjiviet.firebaseapp.com",
  projectId: "kanjiviet",
  storageBucket: "kanjiviet.firebasestorage.app",
  messagingSenderId: "301523531229",
  appId: "1:301523531229:web:55fc4ac72f4278f7ed7234",
  measurementId: "G-HDTN71J72N",
};

// Initialize or reuse Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Auth Modular instance
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Trigger genuine Google Sign-In popup with Firebase Auth.
 * Completely eliminates any mock / fake accounts by enforcing real Google credentials.
 */
export async function loginWithGooglePopup(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out from Firebase Authentication.
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to real-time auth changes.
 */
export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Convert Firebase Auth error into friendly Vietnamese guidance.
 */
export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Đăng nhập không thành công.';
  const authErr = error as AuthError;

  switch (authErr.code) {
    case 'auth/popup-closed-by-user':
      return 'Bạn đã đóng cửa sổ đăng nhập Google.';
    case 'auth/popup-blocked':
      return 'Trình duyệt đã chặn cửa sổ bật lên (popup). Vui lòng cho phép popup để tiếp tục đăng nhập.';
    case 'auth/cancelled-popup-request':
      return 'Yêu cầu mở popup trước đó đã bị hủy.';
    case 'auth/unauthorized-domain':
      return `Tên miền hiện tại (${window.location.hostname}) chưa được thêm vào mục Authorized Domains trên Firebase Console. Vui lòng thêm domain vào Firebase Console > Authentication > Settings > Authorized domains.`;
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng, vui lòng kiểm tra kết nối internet.';
    case 'auth/operation-not-allowed':
      return 'Phương thức đăng nhập Google chưa được kích hoạt trên Firebase Console. Hãy bật Google Sign-in tại Authentication > Sign-in method.';
    default:
      return authErr.message || 'Có lỗi xảy ra trong quá trình đăng nhập Google.';
  }
}
