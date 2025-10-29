/**
 * Type definitions for Google Identity Services (GIS)
 * https://developers.google.com/identity/gsi/web/reference/js-reference
 */

interface Window {
    google?: {
        accounts: {
            id: {
                initialize: (config: GoogleInitializeConfig) => void;
                prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void;
                renderButton: (parent: HTMLElement, options: GoogleButtonConfig) => void;
                disableAutoSelect: () => void;
                cancel: () => void;
                revoke: (hint: string, callback: (response: RevokeResponse) => void) => void;
            };
        };
    };
}

interface GoogleInitializeConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    ux_mode?: 'popup' | 'redirect';
    login_uri?: string;
    native_callback?: (response: GoogleCredentialResponse) => void;
    intermediate_iframe_close_callback?: () => void;
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean; // Disable FedCM (Chrome's Federated Credential Management)
}

interface GoogleCredentialResponse {
    credential: string; // JWT token
    select_by:
        | 'auto'
        | 'user'
        | 'user_1tap'
        | 'user_2tap'
        | 'btn'
        | 'btn_confirm'
        | 'brn_add_session'
        | 'btn_confirm_add_session';
    clientId?: string;
}

interface GoogleButtonConfig {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
    locale?: string;
}

interface PromptMomentNotification {
    isDisplayMoment: () => boolean;
    isDisplayed: () => boolean;
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () =>
        | 'browser_not_supported'
        | 'invalid_client'
        | 'missing_client_id'
        | 'opt_out_or_no_session'
        | 'secure_http_required'
        | 'suppressed_by_user'
        | 'unregistered_origin'
        | 'unknown_reason';
    isSkippedMoment: () => boolean;
    getSkippedReason: () => 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed';
    isDismissedMoment: () => boolean;
    getDismissedReason: () => 'credential_returned' | 'cancel_called' | 'flow_restarted';
    getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface RevokeResponse {
    successful: boolean;
    error?: string;
}

/**
 * Decoded JWT payload from Google credential
 * https://developers.google.com/identity/gsi/web/reference/js-reference#credential
 */
interface GoogleJWTPayload {
    iss: string; // Issuer (accounts.google.com)
    azp: string; // Authorized party
    aud: string; // Audience (your client ID)
    sub: string; // Subject (Google user ID)
    email: string;
    email_verified: boolean;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    iat: number; // Issued at (Unix timestamp)
    exp: number; // Expiration (Unix timestamp)
}
