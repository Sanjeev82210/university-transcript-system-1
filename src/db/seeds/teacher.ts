import { db } from '@/db';
import { teacher } from '@/db/schema';

async function main() {
    const sampleTeachers = [
        {
            name: 'Alice Teacher',
            email: 'alice.teacher@university.edu',
            userId: null,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Bob Teacher',
            email: 'bob.teacher@university.edu',
            userId: null,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(teacher).values(sampleTeachers);
    
    console.log('✅ Teachers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});