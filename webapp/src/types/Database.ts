import { Timestamp } from 'firebase/firestore';
import type { QuitaSmartInput, InvestSmartInput } from './Financial';

export interface UserDocument {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Timestamp;
    lastLogin: Timestamp;
    platform?: string; // Information from analytics
}

export interface SimulationDocument {
    id?: string;
    userId: string;
    type: 'quita_smart' | 'invest_smart';
    createdAt: Timestamp;
    input: QuitaSmartInput | InvestSmartInput;
    results: any; // Flexible structure for calc results
    title?: string; // Optional user-defined title
}
