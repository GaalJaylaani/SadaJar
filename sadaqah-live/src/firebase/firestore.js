import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where,
  increment,
} from 'firebase/firestore';
import { db, ensureAnonymousAuth } from './config';

export async function createRoom({ campaignName, goalAmount, description }) {
  const user = await ensureAnonymousAuth();
  const roomRef = await addDoc(collection(db, 'rooms'), {
    hostId: user.uid,
    campaignName,
    goalAmount: Number(goalAmount),
    description: description || '',
    totalRaised: 0,
    isActive: true,
    createdAt: serverTimestamp(),
  });
  // Store the 6-char code derived from the doc id so we can query it
  const roomCode = roomRef.id.slice(0, 6).toUpperCase();
  await updateDoc(roomRef, { roomCode });
  return { roomId: roomRef.id, roomCode };
}

export async function findRoomByCode(code) {
  const q = query(
    collection(db, 'rooms'),
    where('roomCode', '==', code.toUpperCase()),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export function subscribeToRoom(roomId, callback) {
  return onSnapshot(doc(db, 'rooms', roomId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

export function subscribeToDonations(roomId, callback) {
  const q = query(
    collection(db, 'rooms', roomId, 'donations'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const donations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(donations);
  });
}

export async function submitDonation(roomId, { amount, displayName, isAnonymous, pledgeOnly }) {
  await ensureAnonymousAuth();
  const donationRef = await addDoc(collection(db, 'rooms', roomId, 'donations'), {
    displayName: isAnonymous ? 'Anonymous' : displayName || 'Anonymous',
    amount: Number(amount),
    isAnonymous,
    pledgeOnly: pledgeOnly || false,
    createdAt: serverTimestamp(),
  });

  if (!pledgeOnly) {
    await updateDoc(doc(db, 'rooms', roomId), {
      totalRaised: increment(Number(amount)),
    });
  }

  return donationRef.id;
}
