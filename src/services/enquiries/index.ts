import { EnquiryService } from './EnquiryService';
import { mockEnquiryService } from './MockEnquiryService';
import { firebaseEnquiryService } from './FirebaseEnquiryService';
import { isFirebaseConfigured } from '../../config/firebase';

const useFirebase = import.meta.env.VITE_USE_FIREBASE !== 'false' && isFirebaseConfigured;

export const enquiryService: EnquiryService = useFirebase
  ? firebaseEnquiryService
  : mockEnquiryService;

export * from './EnquiryService';
export * from './MockEnquiryService';
export * from './FirebaseEnquiryService';
