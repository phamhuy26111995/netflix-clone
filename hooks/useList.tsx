import { collection, DocumentData, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { database } from '../firebase'
import { Movie } from '../typings'

function useList(uid: string | undefined) {
  const [list, setList] = useState<DocumentData[] | Movie[]>([])

  useEffect(() => {
    if (!uid) return

    return onSnapshot(
      collection(database, 'customers', uid, 'myList'),
      (snapshot) => {
        setList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      }
    )
  }, [database, uid])

  return list;
}

export default useList