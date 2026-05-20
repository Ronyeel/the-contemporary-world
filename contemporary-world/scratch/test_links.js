// scratch/test_links.js
const candidates = {
  washington: [
    'https://images.unsplash.com/photo-1555529771-735e0904a4ec?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524222717473-7392c620946c?auto=format&fit=crop&w=600&q=80'
  ],
  nigeria: [
    'https://images.unsplash.com/photo-1618828665011-0abd973f7b8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80'
  ]
};

async function test() {
  for (const [key, list] of Object.entries(candidates)) {
    console.log(`Testing candidates for ${key}:`);
    for (const url of list) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`  -> ${res.status} ${res.statusText} (${url.split('?')[0]})`);
      } catch (err) {
        console.log(`  -> FAILED: ${err.message}`);
      }
    }
  }
}

test();
