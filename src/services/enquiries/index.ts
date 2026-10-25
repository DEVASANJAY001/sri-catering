import { EnquiryService } from './EnquiryService';
import { firebaseEnquiryService } from './FirebaseEnquiryService';

// Connected 100% to live Firebase Cloud Firestore
export const enquiryService: EnquiryService = firebaseEnquiryService;

export * from './EnquiryService';
export * from './FirebaseEnquiryService';
