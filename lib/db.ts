import { db } from './firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  enableIndexedDbPersistence,
  limit
} from 'firebase/firestore'

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.')
    }
  });
}

export async function getUserTokens(userId: string): Promise<number> {
  if (!userId) return 0;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data().tokens || 0
    }
    await setDoc(doc(db, 'users', userId), { tokens: 100 })
    return 100
  } catch (error) {
    console.error('Error getting user tokens:', error)
    return 0
  }
}

export async function updateUserTokens(userId: string, newTokens: number): Promise<void> {
  if (!userId) return;

  try {
    await updateDoc(doc(db, 'users', userId), {
      tokens: newTokens
    })
  } catch (error) {
    console.error('Error updating user tokens:', error)
    throw error
  }
}

export async function saveStory(userId: string, story: {
  character: string
  setting: string
  plotTwist: string
  content: string
}): Promise<void> {
  if (!userId) return;

  try {
    const timestamp = new Date().toISOString()
    await addDoc(collection(db, 'stories'), {
      userId,
      ...story,
      createdAt: timestamp,
      timestamp: Date.now() // Adding a numeric timestamp for ordering
    })
  } catch (error) {
    console.error('Error saving story:', error)
    throw error
  }
}

export async function getUserStories(userId: string) {
  if (!userId) return [];

  try {
    const storiesRef = collection(db, 'stories')
    // Simplified query to avoid index requirements
    const q = query(
      storiesRef,
      where('userId', '==', userId),
      limit(50) // Limit to latest 50 stories
    )
    
    const querySnapshot = await getDocs(q)
    const stories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Sort stories by timestamp client-side
    return stories.sort((a: any, b: any) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Error getting user stories:', error)
    return []
  }
}