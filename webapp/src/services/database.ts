import {
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserDocument, SimulationDocument } from '../types/Database';
import type { User } from 'firebase/auth';

const USERS_COLLECTION = 'users';
const SIMULATIONS_COLLECTION = 'simulations';

export const UserService = {
    async createOrUpdateUser(user: User, additionalData?: Partial<UserDocument>) {
        if (!user) return;

        const userRef = doc(db, USERS_COLLECTION, user.uid);
        const userSnap = await getDoc(userRef);

        const userData: Partial<UserDocument> = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: serverTimestamp() as Timestamp,
            ...additionalData
        };

        if (!userSnap.exists()) {
            userData.createdAt = serverTimestamp() as Timestamp;
        }

        // Merge true to avoid overwriting existing fields not present in auth
        await setDoc(userRef, userData, { merge: true });
    },

    async getUserProfile(uid: string): Promise<UserDocument | null> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? (snap.data() as UserDocument) : null;
    }
};

export const SimulationService = {
    async saveSimulation(userId: string, data: Omit<SimulationDocument, 'id' | 'userId' | 'createdAt'>) {
        const simulationData = {
            userId,
            ...data,
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, SIMULATIONS_COLLECTION), simulationData);
        return docRef.id;
    },

    async getUserSimulations(userId: string): Promise<SimulationDocument[]> {
        const q = query(
            collection(db, SIMULATIONS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SimulationDocument));
    }
};
