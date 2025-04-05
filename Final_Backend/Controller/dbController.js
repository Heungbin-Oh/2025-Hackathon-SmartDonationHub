const getCategoryOrganizations = (category) => {
    const organizations = categoryOrganizations[category];

    if (!organizations) {
        return { status: "CategoryNotFound", message: `No organizations found for category '${category}'.` };
    }

    return { category, organizations };
};

const categoryOrganizations = {
    "Food": [
        {
            name: "Ryan",
            email: "heungbin.oh.dev@gmail.com",
            address: "your address",
            category: "Food",
            phone: "your phone number",
            website: "https://foodcharity2.org"
        }
    ],
    "Clothing": [
        {
            name: "Clothing Charity 1",
            email: "clothing_charity1@example.com",
            address: "789 Clothing Rd, City, Country",
            category: "Clothing",
            phone: "+1234567890",
            website: "https://clothingcharity1.org"
        },
        {
            name: "Clothing Charity 2",
            email: "clothing_charity2@example.com",
            address: "321 Apparel St, City, Country",
            category: "Clothing",
            phone: "+0987654321",
            website: "https://clothingcharity2.org"
        }
    ],
    "Toys": [
        {
            name: "Toys Charity 1",
            email: "toys_charity1@example.com",
            address: "654 Toy Ln, City, Country",
            category: "Toys",
            phone: "+1234567890",
            website: "https://toyscharity1.org"
        },
        {
            name: "Toys Charity 2",
            email: "toys_charity2@example.com",
            address: "987 Play Ave, City, Country",
            category: "Toys",
            phone: "+0987654321",
            website: "https://toyscharity2.org"
        }
    ],
    "Books": [
        {
            name: "Books Charity 1",
            email: "books_charity1@example.com",
            address: "159 Book Blvd, City, Country",
            category: "Books",
            phone: "+1234567890",
            website: "https://bookscharity1.org"
        },
        {
            name: "Books Charity 2",
            email: "books_charity2@example.com",
            address: "753 Read St, City, Country",
            category: "Books",
            phone: "+0987654321",
            website: "https://bookscharity2.org"
        }
    ],
    "Electronics": [
        {
            name: "Electronics Charity 1",
            email: "electronics_charity1@example.com",
            address: "246 Tech Rd, City, Country",
            category: "Electronics",
            phone: "+1234567890",
            website: "https://electronicscharity1.org"
        },
        {
            name: "Electronics Charity 2",
            email: "electronics_charity2@example.com",
            address: "369 Gadget St, City, Country",
            category: "Electronics",
            phone: "+0987654321",
            website: "https://electronicscharity2.org"
        }
    ],
    "Household": [
        {
            name: "Household Charity 1",
            email: "household_charity1@example.com",
            address: "123 Home Ln, City, Country",
            category: "Household",
            phone: "+1234567890",
            website: "https://householdcharity1.org"
        },
        {
            name: "Household Charity 2",
            email: "household_charity2@example.com",
            address: "456 Living St, City, Country",
            category: "Household",
            phone: "+0987654321",
            website: "https://householdcharity2.org"
        }
    ],
    "Furniture": [
        {
            name: "Furniture Charity 1",
            email: "furniture_charity1@example.com",
            address: "789 Furniture Ave, City, Country",
            category: "Furniture",
            phone: "+1234567890",
            website: "https://furniturecharity1.org"
        },
        {
            name: "Furniture Charity 2",
            email: "furniture_charity2@example.com",
            address: "321 Sofa St, City, Country",
            category: "Furniture",
            phone: "+0987654321",
            website: "https://furniturecharity2.org"
        }
    ]
};

module.exports = getCategoryOrganizations;