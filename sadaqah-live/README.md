# Sadaqah Live

Real-time Islamic fundraising platform — Kahoot-style donation drives for masjids, with anonymity built in to protect donors from riya (showing off).

## Setup

### 1. Install

```bash
cd sadaqah-live
npm install
```

### 2. Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore** (start in test mode for hackathon)
3. Enable **Authentication → Anonymous**
4. Copy your Firebase config values

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Firestore rules (dev)

In the Firebase console, set rules to allow all reads/writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Run

```bash
npm run dev
```

## Routes

| Path | Screen |
|------|--------|
| `/` | Host: Create Campaign |
| `/host/:roomId` | Host: Live Dashboard (projector screen) |
| `/join` | Donor: Join Room |
| `/room/:roomId/give` | Donor: Choose Amount |
| `/room/:roomId/niyyah` | Donor: Intention Confirmation |
| `/room/:roomId/success` | Donation Thank You |

## Notes

- Payment is mocked with a 2-second delay — Stripe wiring comes next
- All Firebase calls live in `src/firebase/firestore.js`
- Anonymous auth means donors need no account
