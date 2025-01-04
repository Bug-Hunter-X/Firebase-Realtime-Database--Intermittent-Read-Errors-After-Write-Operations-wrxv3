// bugSolution.js
const database = firebase.database();

function readDataWithRetry(path, retries = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    database.ref(path).once('value').then(snapshot => {
      resolve(snapshot.val());
    }).catch(error => {
      if (retries > 0) {
        setTimeout(() => {
          console.log(`Retrying ${path}... ${retries} retries remaining`);
          readDataWithRetry(path, retries - 1, delay * 2).then(resolve).catch(reject);
        }, delay);
      } else {
        reject(error);
      }
    });
  });
}

// Example usage:
async function updateAndRead() {
  await database.ref('myData').set({ value: 'newData' });

  try {
    const data = await readDataWithRetry('myData');
    console.log('Data read successfully:', data);
  } catch (error) {
    console.error('Failed to read data after multiple retries:', error);
  }
}
updateAndRead();