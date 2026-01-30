import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for test user
  const hashedPassword = await bcrypt.hash('Test1234!', 10);

  // Create test user (upsert to avoid duplicates)
  const user = await prisma.user.upsert({
    where: { email: 'test@notely.app' },
    update: {},
    create: {
      email: 'test@notely.app',
      password: hashedPassword,
      name: 'Test User',
      avatar: null,
    },
  });

  console.log('✓ Test user created:', user.email);

  const workspace = await prisma.workspace.create({
    data: {
      name: 'My Workspace',
      icon: '🏠',
      ownerId: user.id,
    },
  });

  console.log('✓ Workspace created:', workspace.name);

  const page = await prisma.page.create({
    data: {
      title: 'Getting Started',
      icon: '👋',
      workspaceId: workspace.id,
      authorId: user.id,
      visibility: 'WORKSPACE',
      position: 0,
    },
  });

  console.log('✓ Page created:', page.title);

  await prisma.block.createMany({
    data: [
      {
        type: 'HEADING_1',
        content: 'Welcome to Notely!',
        pageId: page.id,
        position: 0,
      },
      {
        type: 'TEXT',
        content:
          'This is your first page. Start writing by clicking anywhere on the page.',
        pageId: page.id,
        position: 1,
      },
      {
        type: 'HEADING_2',
        content: 'What you can do:',
        pageId: page.id,
        position: 2,
      },
      {
        type: 'BULLET_LIST',
        content: 'Create pages and organize them in workspaces',
        pageId: page.id,
        position: 3,
      },
      {
        type: 'BULLET_LIST',
        content:
          'Add different types of blocks (text, headings, lists, images, code)',
        pageId: page.id,
        position: 4,
      },
      {
        type: 'BULLET_LIST',
        content: 'Collaborate with your team in real-time',
        pageId: page.id,
        position: 5,
      },
      {
        type: 'TODO',
        content: 'Complete your first task',
        checked: false,
        pageId: page.id,
        position: 6,
      },
    ],
  });

  console.log('✓ Blocks created for page');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Test credentials:');
  console.log('  Email: test@notely.app');
  console.log('  Password: Test1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
