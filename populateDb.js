const { connect, disconnect } = require('./src/models/conn.js');
const Establishment = require('./src/models/Establishment.js');

const establishments = [
    {
        name: '24 Chicken',
        rating: '4.9',
        priceRange: ['₱₱', '₱₱'],
        tags: ['Filipino', 'Chicken'],
        description: 'If you\'re on the hunt for a chicken experience that transcends the ordinary, look no further than 24 Chicken.',
        coverImage: '24Chicken.png',
        reviewsButtonClass: 'est-view-review-24-chicken view-review-btn',
        addReviewClass: 'add-review-24-chicken add-review-btn'
    },
    {
        name: "Ate Rica's Bacsilog",
        rating: '4.9',
        priceRange: ['₱', '₱₱₱'],
        tags: ['Filipino', 'Rice Meal'],
        description: 'Ate Rica\'s Bacsilog lives up to its "Sauce Sarap" promise! Delicious, affordable Filipino comfort food with generous portions and...',
        coverImage: 'AteRicasBacsilog.png',
        reviewsButtonClass: 'est-view-review-ate-ricas-bacsilog view-review-btn',
        addReviewClass: 'add-review-ate-ricas-bacsilog add-review-btn'
    },
    {
        name: 'Tomo Coffee',
        rating: '4.7',
        priceRange: ['₱₱', '₱₱'],
        tags: ['Drinks'],
        description: 'Tucked away in a vibrant student district, Tomo Coffee is a haven for caffeine-craving scholars. I love it so much!',
        coverImage: 'TomoCoffee.png',
        reviewsButtonClass: 'est-view-review-tomo-coffee view-review-btn',
        addReviewClass: 'add-review-tomo-coffee add-review-btn'
    },
    {
        name: 'Tinuhog ni Benny',
        rating: '5.0',
        priceRange: ['₱', '₱₱₱'],
        tags: ['Filipino', 'Rice Meal'],
        description: 'Tinuhog ni Benny is a haven for budget-friendly, delicious Filipino comfort food. The highlight is undoubtedly their namesake "tinuhog"...',
        coverImage: 'TinuhogNiBenny.png',
        reviewsButtonClass: 'est-view-review-tinuhog-ni-benny view-review-btn',
        addReviewClass: 'add-review-tinuhog-ni-benny add-review-btn'
    },
    {
        name: 'Hungry Seoul',
        rating: '4.9',
        priceRange: ['₱₱', '₱₱'],
        tags: ['Korean', 'Rice Meal'],
        description: 'If you\'re craving a taste of Korea in Manila, Hungry Seoul is definitely worth a visit. This casual restaurant...',
        coverImage: 'HungrySeoul.png',
        reviewsButtonClass: 'est-view-review-hungry-seoul view-review-btn',
        addReviewClass: 'add-review-hungry-seoul add-review-btn'
    },
];

async function populateDB() {
    try {
        await connect();
        await Establishment.deleteMany({}).exec();
        const results = await Establishment.create(establishments);

        console.log('Establishment Schema has been populated: ');
        disconnect();
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

populateDB();
