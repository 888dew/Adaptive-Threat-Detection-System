import { DetectionSystem } from '../src/core/DetectionSystem.js';
import { ThreatEvent } from '../src/models/ThreatEvent.js';

const system = new DetectionSystem();

async function runDemo() {
  const userId = 'user_001';

  console.log('--- Step 1: Normal Behavior (Learning) ---');
  await system.processEvent({
    id: '1',
    userId,
    type: 'LOGIN',
    timestamp: Date.now(),
    metadata: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      location: { country: 'Brazil', city: 'São Paulo' }
    }
  });

  console.log('\n--- Step 2: Normal Access ---');
  await system.processEvent({
    id: '2',
    userId,
    type: 'FILE_ACCESS',
    timestamp: Date.now() + 5000, // 5 seconds later
    metadata: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      location: { country: 'Brazil', city: 'São Paulo' }
    }
  });

  console.log('\n--- Step 3: ANOMALY - Different Country ---');
  await system.processEvent({
    id: '3',
    userId,
    type: 'LOGIN',
    timestamp: Date.now() + 10000,
    metadata: {
      ip: '45.12.34.56',
      userAgent: 'Mozilla/5.0',
      location: { country: 'Russia', city: 'Moscow' }
    }
  });

  console.log('\n--- Step 4: ANOMALY - High Velocity (Bot?) ---');
  await system.processEvent({
    id: '4',
    userId,
    type: 'API_CALL',
    timestamp: Date.now() + 10100, // Only 100ms later!
    metadata: {
      ip: '45.12.34.56',
      userAgent: 'Bot/1.0',
      location: { country: 'Russia', city: 'Moscow' }
    }
  });
}

runDemo().catch(console.error);
