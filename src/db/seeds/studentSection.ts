import { db } from '@/db';
import { studentSection } from '@/db/schema';

async function main() {
    const sampleEnrollments = [
        {
            studentId: 'S001',
            sectionId: 1,
            enrolledAt: new Date().toISOString(),
        },
        {
            studentId: 'S002',
            sectionId: 1,
            enrolledAt: new Date().toISOString(),
        },
        {
            studentId: 'S003',
            sectionId: 3,
            enrolledAt: new Date().toISOString(),
        }
    ];

    await db.insert(studentSection).values(sampleEnrollments);
    
    console.log('✅ Student section enrollments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});