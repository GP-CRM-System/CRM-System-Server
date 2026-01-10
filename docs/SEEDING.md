# Database Seeding Scripts

This project includes several database seeding scripts to populate your MongoDB database with realistic test data. Choose the script that best fits your needs.

## Available Scripts

### 1. Basic Seed (`seed.ts`)
**Command:** `npm run seed`

Basic seeding script with minimal data (10 records per collection).

**Data Generated:**
- 10 Roles
- 10 Employees
- 10 Contacts
- 10 Companies
- 10 Deals
- 10 Orders
- 10 Tickets

**Total:** ~70 records

**Use Case:** Quick testing, development, small demos

---

### 2. Massive Seed (`seed-massive.ts`)
**Command:** `npm run seed:massive`

Generates a large dataset with realistic, interconnected data.

**Data Generated:**
- 25 Roles
- 200 Employees
- 1,000 Contacts
- 500 Companies
- 800 Deals
- 1,500 Orders
- 2,000 Tickets

**Total:** ~5,025 records

**Use Case:** Performance testing, realistic demos, QA testing

---

### 3. Super Seed (`seed-super.ts`)
**Command:** `npm run seed:super` or use preset commands

The most flexible seeding script with multiple presets and optimized batch processing.

#### Available Presets:

##### SMALL Preset
**Command:** `npm run seed:small`
- 10 Roles
- 20 Employees
- 50 Contacts
- 30 Companies
- 40 Deals
- 60 Orders
- 80 Tickets
- **Total:** ~290 records

##### MEDIUM Preset
**Command:** `npm run seed:medium`
- 20 Roles
- 100 Employees
- 500 Contacts
- 250 Companies
- 400 Deals
- 750 Orders
- 1,000 Tickets
- **Total:** ~3,020 records

##### LARGE Preset (Default)
**Command:** `npm run seed:large` or `npm run seed:super`
- 25 Roles
- 200 Employees
- 1,000 Contacts
- 500 Companies
- 800 Deals
- 1,500 Orders
- 2,000 Tickets
- **Total:** ~5,025 records

##### MASSIVE Preset
**Command:** `npm run seed:super` with `SEED_PRESET=MASSIVE`
- 30 Roles
- 500 Employees
- 3,000 Contacts
- 1,500 Companies
- 2,500 Deals
- 5,000 Orders
- 7,000 Tickets
- **Total:** ~19,530 records

##### EXTREME Preset
**Command:** `npm run seed:extreme`
- 50 Roles
- 1,000 Employees
- 10,000 Contacts
- 5,000 Companies
- 8,000 Deals
- 15,000 Orders
- 20,000 Tickets
- **Total:** ~59,050 records

**Use Case:** Load testing, stress testing, enterprise-scale demos

---

## Data Features

All seeding scripts generate realistic data with the following features:

### Roles
- Predefined role names (Administrator, Sales Manager, etc.)
- Granular permissions for each module
- Custom role descriptions
- Active/inactive status

### Employees
- Full names generated with Faker.js
- Unique email addresses
- Hashed passwords (default: "password123")
- Phone numbers
- Salary ranges ($35,000 - $250,000)
- Active/inactive status
- Role assignments
- Invite/reset tokens (some records)

### Contacts
- Full names with proper formatting
- Email addresses and phone numbers
- Physical addresses
- Job titles (60+ variations)
- Lead/Customer stages
- Seniority levels
- Social media profiles (LinkedIn, Twitter, Facebook, Instagram)
- Interaction history with employees
- Source tracking (Referral, Online, Email, etc.)
- Notes and descriptions

### Companies
- Company names using Faker.js
- 35+ industry categories
- Company types (Public, Private, Non-Profit, etc.)
- Website and contact emails
- Physical addresses
- Employee count (5-10,000)
- Annual revenue ($50K - $500M)
- Growth stages (Startup, Established, Matured, Declining)
- Account stages (Lead/Customer)
- Regional information
- Interaction history
- Source tracking

### Deals
- Named after company and product
- Multi-stage progression tracking
- 7 deal stages (Appointment Scheduled → Closed Won/Lost)
- Deal amounts ($500 - $500,000)
- Priority levels (Low, Medium, High, Critical)
- Expected close dates
- Linked to contacts, companies, and employee owners
- Stage history with timestamps and notes

### Orders
- Unique order numbers
- Multiple products per order (1-5 items)
- 25+ product types
- Product quantities and unit prices
- Order stages (Open, Processing, Shipped, Delivered, etc.)
- Order types (One Time, Subscription)
- Payment status tracking
- Tax calculations
- Shipping addresses
- Expected delivery dates
- Source tracking

### Tickets
- 28+ different issue types
- Multiple status types (Open, In Progress, Resolved, Closed, etc.)
- 4 priority levels
- 4 source channels (Chat, Email, Phone, Form)
- 5 categories (Bug, Question, Request, Billing, Other)
- Detailed descriptions
- Resolution status tracking
- Customer feedback (some tickets)
- Due dates for first response and resolution
- Status history with timestamps
- Linked to contacts, companies, and employee owners

---

## Data Relationships

All scripts create proper relationships between entities:

```
┌──────────┐
│   Roles  │
└────┬─────┘
     │
     ↓
┌──────────┐     ┌──────────┐
│Employees │────→│ Contacts │
└────┬─────┘     └────┬─────┘
     │               │
     ↓               ↓
┌──────────┐     ┌──────────┐
│Companies │←────│  Deals   │
└────┬─────┘     └──────────┘
     │
     ├───→ Orders
     │
     └───→ Tickets
```

- **Employees** are assigned to **Roles**
- **Contacts** are owned by **Employees**
- **Contacts** are linked to **Companies** (70% of contacts)
- **Companies** are owned by **Employees** and have primary **Contacts**
- **Deals** are linked to **Companies**, **Contacts**, and **Employees**
- **Orders** are linked to **Companies**, **Contacts**, and **Employees**
- **Tickets** are linked to **Companies**, **Contacts**, and **Employees**

---

## Usage Examples

### Basic Development
```bash
npm run seed
```

### Demo Preparation
```bash
npm run seed:medium
```

### Performance Testing
```bash
npm run seed:massive
```

### Load Testing
```bash
npm run seed:extreme
```

### Custom Preset
```bash
SEED_PRESET=MASSIVE npm run seed:super
```

---

## Configuration

### Database Connection
Set your MongoDB connection string in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/neocrm-dev
```

### Custom Presets
To modify data counts, edit the `PRESETS` object in `src/scripts/seed-super.ts`:

```typescript
const PRESETS = {
    CUSTOM: {
        ROLES: 50,
        EMPLOYEES: 100,
        CONTACTS: 500,
        // ... etc
    }
};
```

---

## Performance Considerations

### Small to Medium Datasets (< 5,000 records)
- Fast execution (typically < 30 seconds)
- No special considerations needed

### Large Datasets (5,000 - 20,000 records)
- Uses batch insertion (1,000 records per batch)
- Execution time: 1-3 minutes
- Memory usage: Moderate

### Extreme Datasets (> 20,000 records)
- Optimized batch processing
- Execution time: 3-10 minutes
- Memory usage: Higher
- Ensure adequate system resources

---

## Progress Tracking

All scripts provide real-time progress updates:

```
🚀 Starting data generation...

✓ Roles - 25 records (0.50% complete)
✓ Employees - 200 records (4.48% complete)
✓ Contacts - 1000 records (24.38% complete)
🔗 Linking Contacts to Companies...
✓ Companies - 500 records (34.33% complete)
✓ Deals - 800 records (50.25% complete)
✓ Orders - 1500 records (80.10% complete)
✓ Tickets - 2000 records (100.00% complete)

╔════════════════════════════════════════════════════════╗
║                  SEEDING COMPLETED! ✓                  ║
╚════════════════════════════════════════════════════════╝

⏱️  Time taken: 45.23 seconds
📈 Records per second: 111
💾 Database: neocrm-dev
```

---

## Data Quality

All generated data includes:

- ✅ Realistic names, emails, and addresses (using Faker.js)
- ✅ Valid phone numbers
- ✅ Proper date ranges (historical data up to 3 years old)
- ✅ Logical stage progressions
- ✅ Proper foreign key relationships
- ✅ Varied data distributions (not everything is identical)
- ✅ Optional fields randomly populated
- ✅ Timestamp tracking (createdAt, updatedAt)

---

## Troubleshooting

### Connection Errors
```
❌ Error connecting to MongoDB
```
**Solution:** Check your `MONGODB_URI` in `.env` file and ensure MongoDB is running.

### Memory Issues (Large datasets)
```
JavaScript heap out of memory
```
**Solution:** Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run seed:extreme
```

### Slow Performance
**Solution:** 
- Ensure MongoDB has proper indexes
- Use SSD storage for database
- Check system resources
- Use smaller presets for slower machines

---

## Best Practices

1. **Development:** Use `seed:small` or `seed:medium` for faster iterations
2. **Testing:** Use `seed:large` for realistic testing scenarios
3. **Performance Testing:** Use `seed:massive` or `seed:extreme`
4. **Demo Preparation:** Run seeding the night before to ensure data is ready
5. **Clear Data:** All scripts automatically clear existing data before seeding
6. **Backup:** Always backup production data before running seed scripts

---

## Technical Details

### Libraries Used
- **mongoose**: MongoDB ODM
- **@faker-js/faker**: Realistic fake data generation
- **bcrypt**: Password hashing
- **dotenv**: Environment configuration

### Optimization Techniques
- Batch insertion (1,000 records per batch)
- Parallel operations where possible
- Efficient random selection algorithms
- Memory-conscious data generation
- Progress tracking for user feedback

---

## Future Enhancements

Potential improvements:
- [ ] CSV export of generated data
- [ ] Custom data templates
- [ ] Incremental seeding (add without clearing)
- [ ] Data validation before insertion
- [ ] Seed data from external files
- [ ] Custom relationship densities
- [ ] Multi-language support for names/addresses

---

## Support

For issues or questions:
1. Check this documentation
2. Review the script source code
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** January 2026
**Version:** 1.0.0
