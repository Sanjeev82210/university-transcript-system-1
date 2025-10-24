import { db } from '@/db';
import { courses } from '@/db/schema';

async function main() {
    const sampleCourses = [
        {
            courseCode: 'CS101',
            courseName: 'Introduction to Programming',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: null,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            courseCode: 'CS201',
            courseName: 'Data Structures and Algorithms',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: 1,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            courseCode: 'MATH101',
            courseName: 'Calculus I',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: 1,
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        {
            courseCode: 'MATH201',
            courseName: 'Linear Algebra',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: 2,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            courseCode: 'PHYS101',
            courseName: 'Physics I: Mechanics',
            teacherId: 2,
            createdById: 'teacher_bob',
            sectionId: 2,
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        {
            courseCode: 'PHYS201',
            courseName: 'Physics II: Electricity & Magnetism',
            teacherId: 2,
            createdById: 'teacher_bob',
            sectionId: null,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            courseCode: 'BIO101',
            courseName: 'General Biology',
            teacherId: 2,
            createdById: 'teacher_bob',
            sectionId: 3,
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        {
            courseCode: 'CHEM101',
            courseName: 'General Chemistry',
            teacherId: 2,
            createdById: 'teacher_bob',
            sectionId: 3,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            courseCode: 'ENG101',
            courseName: 'English Composition',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: null,
            createdAt: new Date('2024-01-23').toISOString(),
            updatedAt: new Date('2024-01-23').toISOString(),
        },
        {
            courseCode: 'HIST101',
            courseName: 'World History',
            teacherId: 1,
            createdById: 'teacher_alice',
            sectionId: null,
            createdAt: new Date('2024-01-24').toISOString(),
            updatedAt: new Date('2024-01-24').toISOString(),
        }
    ];

    await db.insert(courses).values(sampleCourses);
    
    console.log('✅ Courses seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});