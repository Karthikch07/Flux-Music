import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Colors for console output
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
    console.log('\n🎵 Flux Music API Tests\n' + '='.repeat(50) + '\n');

    try {
        // Test 1: Health Check
        log.test('Testing health check endpoint...');
        const healthRes = await fetch(`${API_BASE}/health`);
        const healthData = await healthRes.json();
        
        if (healthRes.ok) {
            log.success('Health check passed');
            console.log('   Response:', JSON.stringify(healthData, null, 2));
        } else {
            log.error('Health check failed');
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 2: Register User
        log.test('Testing user registration...');
        const registerData = {
            username: 'testuser',
            email: 'test@fluxmusic.com',
            password: 'password123'
        };

        const registerRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const registerResult = await registerRes.json();

        if (registerRes.ok) {
            log.success('User registered successfully');
            console.log('   Username:', registerResult.data.user.username);
            console.log('   Email:', registerResult.data.user.email);
            console.log('   Token:', registerResult.data.token.substring(0, 20) + '...');
        } else {
            log.info('Registration response: ' + registerResult.message);
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 3: Login
        log.test('Testing user login...');
        const loginData = {
            email: 'test@fluxmusic.com',
            password: 'password123'
        };

        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const loginResult = await loginRes.json();
        let token = null;

        if (loginRes.ok) {
            log.success('Login successful');
            token = loginResult.data.token;
            console.log('   Token received');
        } else {
            log.error('Login failed: ' + loginResult.message);
            return;
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 4: Get Profile (Protected Route)
        log.test('Testing protected route (get profile)...');
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const profileResult = await profileRes.json();

        if (profileRes.ok) {
            log.success('Profile retrieved successfully');
            console.log('   Username:', profileResult.data.user.username);
            console.log('   Playlists:', profileResult.data.user.playlists.length);
            console.log('   Liked Songs:', profileResult.data.user.likedSongs.length);
        } else {
            log.error('Failed to get profile: ' + profileResult.message);
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 5: Create Playlist
        log.test('Testing playlist creation...');
        const playlistData = {
            name: 'My Test Playlist',
            description: 'Created via API test',
            isPublic: true
        };

        const playlistRes = await fetch(`${API_BASE}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(playlistData)
        });

        const playlistResult = await playlistRes.json();

        if (playlistRes.ok) {
            log.success('Playlist created successfully');
            console.log('   Name:', playlistResult.data.playlist.name);
            console.log('   ID:', playlistResult.data.playlist._id);
        } else {
            log.error('Failed to create playlist: ' + playlistResult.message);
        }

        console.log('\n' + '-'.repeat(50) + '\n');

        // Test 6: Get Songs
        log.test('Testing get all songs...');
        const songsRes = await fetch(`${API_BASE}/songs`);
        const songsResult = await songsRes.json();

        if (songsRes.ok) {
            log.success(`Found ${songsResult.results} songs`);
            if (songsResult.results > 0) {
                console.log('   First song:', songsResult.data.songs[0].name);
            } else {
                log.info('   No songs in database. Run: npm run seed');
            }
        } else {
            log.error('Failed to get songs');
        }

        console.log('\n' + '='.repeat(50));
        log.success('All tests completed!');
        console.log('\n');

    } catch (error) {
        log.error('Test failed: ' + error.message);
        console.log('\nMake sure the backend server is running:');
        console.log('  cd backend && npm run dev\n');
    }
}

// Run tests
testAPI();
