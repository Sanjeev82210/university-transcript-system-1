import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        // ADMIN USER
        {
            id: 'admin_001',
            name: 'Admin User',
            email: 'admin@university.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'ADMIN',
            teacherId: null,
        },
        // TEACHER USERS
        {
            id: 'teacher_alice',
            name: 'Alice Teacher',
            email: 'alice.teacher@university.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'TEACHER',
            teacherId: 1,
        },
        {
            id: 'teacher_bob',
            name: 'Bob Teacher',
            email: 'bob.teacher@university.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'TEACHER',
            teacherId: 2,
        },
        {
            id: 'teacher_carol',
            name: 'Carol Teacher',
            email: 'carol.teacher@university.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'TEACHER',
            teacherId: null,
        },
        // STUDENT USERS
        {
            id: 'S001',
            name: 'John Doe',
            email: 'john.doe@student.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'STUDENT',
            teacherId: null,
        },
        {
            id: 'S002',
            name: 'Jane Smith',
            email: 'jane.smith@student.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'STUDENT',
            teacherId: null,
        },
        {
            id: 'S003',
            name: 'Mike Johnson',
            email: 'mike.johnson@student.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'STUDENT',
            teacherId: null,
        },
        {
            id: 'S004',
            name: 'Sarah Williams',
            email: 'sarah.williams@student.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'STUDENT',
            teacherId: null,
        },
        {
            id: 'S005',
            name: 'David Brown',
            email: 'david.brown@student.edu',
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'STUDENT',
            teacherId: null,
        },
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});