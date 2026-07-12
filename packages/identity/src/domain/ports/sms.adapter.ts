export interface SmsAdapter {
  sendOtp(phoneNumber: string, otp: string): Promise<void>;
  verifyOtp(phoneNumber: string, otp: string): Promise<boolean>;
}

export const SMS_ADAPTER = Symbol('SMS_ADAPTER');
