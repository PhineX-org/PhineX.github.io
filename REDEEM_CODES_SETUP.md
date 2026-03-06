# PhineX Redeem Code System Setup Guide

## Overview
The redeem code system allows users to upgrade their account to **Admin status** by entering an exclusive invite code in the bug report page.

## How It Works

1. **User enters a code** in the redeem modal (via "Redeem" button in bugreport.html)
2. **System validates** the code against Firebase Realtime Database
3. **If valid & unused**:
   - Mark code as `used: true` with user info
   - Update user document to `admin: true`
   - Show success modal
4. **User gains admin permissions** and can access admin features

## Creating Redeem Codes in Firebase

### Via Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your PhineX project: **phinex-b5823**
3. Navigate to **Realtime Database**
4. Expand to see the structure and create a new node called `redeemCodes`
5. Add individual codes as follows:

#### Code Structure:
```
redeemCodes/
├── CODE-001/
│   ├── code: "CODE-001"
│   ├── created: "2026-03-04T10:00:00Z"
│   ├── expiresAt: "2026-12-31T23:59:59Z"
│   ├── used: false
│   └── description: "Founder's Invite"
│
├── CODE-002/
│   ├── code: "CODE-002"
│   ├── created: "2026-03-04T10:00:00Z"
│   ├── expiresAt: "2027-12-31T23:59:59Z"
│   ├── used: false
│   └── description: "Partner Program"
│
└── ELITE-2026/
    ├── code: "ELITE-2026"
    ├── created: "2026-03-04T10:00:00Z"
    ├── expiresAt: "2026-06-30T23:59:59Z"
    ├── used: false
    └── description: "Early Adopter"
```

### Manual Steps:
1. In Realtime Database, click **+** next to a location
2. Enter `redeemCodes` as the new key
3. For each code, right-click on `redeemCodes` → **Add child**
4. Enter the code name (e.g., `CODE-001`)
5. Add these properties:
   - `code` (String): The actual code value
   - `created` (String): ISO timestamp
   - `expiresAt` (String): ISO timestamp when code expires
   - `used` (Boolean): `false` initially
   - `description` (String): What the code is for (optional)

### Quick Example - JSON Structure:
```json
"redeemCodes": {
  "CODE-001": {
    "code": "CODE-001",
    "created": "2026-03-04T10:00:00Z",
    "expiresAt": "2026-12-31T23:59:59Z",
    "used": false,
    "description": "Founder's Invite"
  },
  "PHINEX-VIP": {
    "code": "PHINEX-VIP",
    "created": "2026-03-04T10:00:00Z",
    "expiresAt": "2027-03-04T23:59:59Z",
    "used": false,
    "description": "VIP Partner"
  }
}
```

## Testing the System

### Test Code (You can create this):
- **Code**: `TEST-CODE-123`
- **Expires**: Far future date (e.g., 2030)
- **Used**: Set to `false`

### Steps:
1. Sign in to bugreport.html
2. Click the **"🎁 Redeem"** button (appears only if not admin)
3. Enter: `TEST-CODE-123`
4. Click **Redeem**
5. ✅ Should show success modal and upgrade account to admin

## Revoking or Managing Codes

### To disable a code:
1. In Firebase, find the code in `redeemCodes/{CODE}`
2. Set `used: true` and leave `usedBy` empty
3. The code will show as "already redeemed"

### To extend a code's expiry:
1. Update the `expiresAt` field with a new ISO timestamp
2. Changes take effect immediately

### To view who used a code:
Look at the code entry:
- `usedBy`: User UID
- `usedByEmail`: User email
- `redeemedAt`: When it was redeemed

## Admin User Status

When a user successfully redeems a code, their user document is updated:
```json
"users/{uid}": {
  "admin": true,
  "upgradedAt": "2026-03-04T10:30:00Z",
  "upgradedVia": "redeem_code"
}
```

Admin users:
- ❌ Will NOT see the "Redeem" button
- ✅ Can access `/admin.html`
- ✅ Can manage bug reports
- ✅ Have elevated permissions

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid or expired code" | Check code spelling, expires date, and `used` status |
| Code already redeemed | Set `used: false` and remove `usedBy` fields to reset |
| User still can't access admin panel | Verify `admin: true` is set in user document |
| Redeem button not showing | Ensure user is logged in and `admin !== true` |

## Notes
- Code matching is **case-insensitive** in validation
- Codes cannot be reused (once `used: true`, they're locked)
- 🔐 Keep your codes private to trusted users only
- Each code can only be used **once**
