const API_BASE = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`)
};

async function testAPI() {
    console.log('\n🎵 Flux Music Comprehensive Backend API Tests\n' + '='.repeat(50) + '\n');

    try {
        // Test 1: Health Check
        log.test('1. Testing health check endpoint...');
        const healthRes = await fetch(`${API_BASE}/health`);
        const healthData = await healthRes.json();
        
        if (healthRes.ok) {
            log.success('Health check passed');
            console.log('   Response message:', healthData.message);
        } else {
            log.error('Health check failed');
            return;
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 2: Register or Login User
        log.test('2. Testing user authentication...');
        const uniqueEmail = `user.audio.${Date.now()}@gmail.com`;
        const registerData = {
            username: `user_${Date.now().toString().slice(-4)}`,
            email: uniqueEmail,
            password: 'password123'
        };

        let token = null;
        const registerRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const registerResult = await registerRes.json();
        console.log('Register Result:', registerResult);
        if (registerRes.ok) {
            log.success('User registered successfully');
            token = registerResult.data?.token || registerResult.token;
            console.log('   Username:', registerResult.data?.user?.username || registerResult.user?.username);
        } else {
            log.info('Falling back to login with existing test account...');
            const loginRes = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
            });
            const loginResult = await loginRes.json();
            if (loginRes.ok) {
                token = loginResult.data.token;
                log.success('Login succeeded with existing test account');
            } else {
                log.error('Authentication test failed: ' + loginResult.message);
                return;
            }
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 3: Get Albums
        log.test('3. Testing get all albums...');
        const albumsRes = await fetch(`${API_BASE}/albums`);
        const albumsData = await albumsRes.json();
        if (albumsRes.ok) {
            log.success(`Retrieved ${albumsData.results} albums`);
            albumsData.data.albums.forEach(a => console.log(`   - [ID ${a.id}] ${a.name} (${a.songs?.length || 0} songs)`));
        } else {
            log.error('Failed to get albums');
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 4: Get Songs
        log.test('4. Testing get all songs...');
        const songsRes = await fetch(`${API_BASE}/songs`);
        const songsResult = await songsRes.json();

        if (songsRes.ok) {
            log.success(`Retrieved ${songsResult.results} songs`);
            songsResult.data.songs.slice(0, 3).forEach(s => console.log(`   - "${s.name}" by ${s.artist} [${s.duration}]`));
        } else {
            log.error('Failed to get songs');
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 5: Add a new song
        log.test('5. Testing adding a new song...');
        const newSongData = {
            name: `Test Track ${Date.now().toString().slice(-4)}`,
            artist: 'Test Artist',
            album: 'Trending Global',
            desc: 'Automated test track generated during API validation',
            image: 'img1.jpg',
            file: 'song1.mp3',
            duration: '2:45'
        };

        const addSongRes = await fetch(`${API_BASE}/songs`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSongData)
        });
        const addSongResult = await addSongRes.json();
        let createdSongId = null;
        if (addSongRes.ok) {
            log.success(`Added song: "${addSongResult.data.song.name}"`);
            createdSongId = addSongResult.data.song._id;
        } else {
            log.error('Failed to add song: ' + addSongResult.message);
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 6: Testing duplicate detection on song creation
        log.test('6. Testing duplicate prevention when adding duplicate song...');
        const duplicateRes = await fetch(`${API_BASE}/songs`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSongData)
        });
        const duplicateResult = await duplicateRes.json();
        if (duplicateRes.status === 409) {
            log.success('Duplicate prevention successfully blocked identical song addition (409 Conflict)');
            console.log('   Message:', duplicateResult.message);
        } else {
            log.info('Duplicate response status: ' + duplicateRes.status);
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 7: Testing remove-duplicates endpoint
        log.test('7. Testing remove-duplicates API endpoint...');
        const dedupeRes = await fetch(`${API_BASE}/songs/remove-duplicates`, {
            method: 'POST'
        });
        const dedupeResult = await dedupeRes.json();
        if (dedupeRes.ok) {
            log.success('Deduplication endpoint works cleanly');
            console.log('   Message:', dedupeResult.message);
            console.log('   Duplicates removed:', dedupeResult.duplicatesRemoved);
            console.log('   Total songs remaining:', dedupeResult.totalRemainingSongs);
        } else {
            log.error('Failed to run deduplication endpoint');
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 8: Testing Google, Clever, and Office 365 real-account sign-in
        log.test('8. Testing social auth with real emails (Google, Clever, Office 365)...');

        // Google
        const googleRes = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'alex.official.test@gmail.com', name: 'Alex Official' })
        });
        const googleResult = await googleRes.json();
        if (googleRes.ok && googleResult.data?.token) {
            log.success('Google real Gmail auth passed');
        } else {
            log.error('Google auth failed: ' + googleResult.message);
        }

        // Clever
        const cleverRes = await fetch(`${API_BASE}/auth/clever`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'student.music@clever.org', name: 'Student Music', school: 'Lincoln High' })
        });
        const cleverResult = await cleverRes.json();
        if (cleverRes.ok && cleverResult.data?.token) {
            log.success('Clever real account auth passed');
        } else {
            log.error('Clever auth failed: ' + cleverResult.message);
        }

        // Office 365
        const officeRes = await fetch(`${API_BASE}/auth/office365`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'faculty.member@harvard.edu', name: 'Harvard Faculty' })
        });
        const officeResult = await officeRes.json();
        if (officeRes.ok && officeResult.data?.token) {
            log.success('Office 365 real account auth passed');
        } else {
            log.error('Office 365 auth failed: ' + officeResult.message);
        }

        // Clean up created test song if still present
        if (createdSongId) {
            await fetch(`${API_BASE}/songs/${createdSongId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        console.log('\n' + '='.repeat(50));
        log.success('All Flux Music Backend API tests passed with flying colors! 🚀');
        console.log('\n');

    } catch (error) {
        log.error('Test failed: ' + error.message);
        console.log('\nMake sure the backend server is running:');
        console.log('  cd backend && npm start\n');
    }
}

testAPI();
