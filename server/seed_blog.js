const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const post = await prisma.blogPost.create({
        data: {
            title: "Welcome to ANTITESA News",
            slug: "welcome-to-antitesa-news",
            content: "<p>We are thrilled to launch our new <strong>Blog & News</strong> section!</p><p>Here you will find updates about our coffee, events, and community stories.</p><ul><li>Exclusive Offers</li><li>Barista Tips</li><li>Event Recaps</li></ul>",
            excerpt: "We are thrilled to launch our new Blog & News section! Updates about coffee, events, and more.",
            category: "ANNOUNCEMENT",
            isPublished: true,
            publishedAt: new Date(),
            coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000",
            tags: ["news", "launch", "coffee"],
            metaTitle: "Welcome to ANTITESA News",
            metaDescription: "Welcome to our new blog section."
        }
    });
    console.log('Created post:', post.title);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
