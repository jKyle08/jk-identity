/**
 * Extension point for device trust / "remember this device" flows.
 * Not implemented in v0.2.0.
 */
export interface DeviceTrustAdapter {
  registerTrustedDevice(identityId: string, deviceFingerprint: string, metadata?: Record<string, unknown>): Promise<string>;
  isTrustedDevice(identityId: string, deviceFingerprint: string): Promise<boolean>;
  revokeTrustedDevice(identityId: string, deviceId: string): Promise<void>;
  listTrustedDevices(identityId: string): Promise<Array<{ id: string; deviceName?: string; lastUsedAt?: Date }>>;
}

export const DEVICE_TRUST_ADAPTER = Symbol('DEVICE_TRUST_ADAPTER');
