import { ref, watchEffect } from "vue";
import { projectFirestore } from '../firebase/config';

const useCollection = (collection) => {
  const documents = ref(null);
  const error = ref(null);

  const collectionRef = projectFirestore.collection(collection)
    .orderBy('createdAt', 'desc');

  const unsub = collectionRef.onSnapshot((snap) => {
    let results = [];
    snap.docs.forEach(doc => {
      results.push({ ...doc.data(), id: doc.id })
    })

    // update values
    documents.value = results;
    error.value = null;
    console.log(documents.value)
  }, (err) => {
    console.log(err.message)
    documents.value = null;
    error.value = 'could not fetch data'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { documents, error }
}

export default useCollection;