export interface MessagingService {
    sendSMS(telephone: string, sms: string): boolean;
}
