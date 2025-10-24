import { db } from '@/db';
import { section } from '@/db/schema';

async function main() {
    const sampleSections = [
        {
            sectionCode: 'S1',
            name: 'Math101',
            teacherId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            sectionCode: 'S2',
            name: 'Physics201',
            teacherId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            sectionCode: 'S3',
            name: 'Biology301',
            teacherId: 2,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(section).values(sampleSections);
    
    console.log('✅ Sections seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});