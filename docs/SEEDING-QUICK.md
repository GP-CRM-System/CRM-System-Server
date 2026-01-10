# Quick Seeding Reference

## 🚀 Quick Start

```bash
# Basic seed (70 records)
npm run seed

# Medium dataset (3,020 records)
npm run seed:medium

# Large dataset (5,025 records) - Recommended
npm run seed:massive

# Extreme dataset (59,050 records)
npm run seed:extreme
```

## 📊 Preset Comparison

| Preset | Command | Records | Use Case | Time |
|--------|---------|---------|----------|------|
| **Basic** | `npm run seed` | ~70 | Quick dev testing | ~5s |
| **Small** | `npm run seed:small` | ~290 | Unit testing | ~10s |
| **Medium** | `npm run seed:medium` | ~3,020 | Integration testing | ~30s |
| **Large** | `npm run seed:large` | ~5,025 | Demos, QA | ~45s |
| **Massive** | `SEED_PRESET=MASSIVE npm run seed:super` | ~19,530 | Performance testing | ~2m |
| **Extreme** | `npm run seed:extreme` | ~59,050 | Load testing | ~5m |

## 📦 What Gets Generated

```
Roles (with permissions)
  └── Employees (with passwords)
        ├── Own → Contacts
        ├── Own → Companies
        ├── Own → Deals
        ├── Own → Orders
        └── Own → Tickets

Companies
  ├── Linked to → Contacts (70%)
  ├── Linked to → Deals
  ├── Linked to → Orders
  └── Linked to → Tickets

Contacts
  ├── Belong to → Companies (70%)
  ├── Have → Interaction History
  ├── Have → Social Media Profiles
  └── Linked to → Deals, Orders, Tickets
```

## 🎯 Common Commands

```bash
# Development
npm run seed:small

# Demo prep
npm run seed:medium

# Performance test
npm run seed:massive

# Stress test
npm run seed:extreme

# Custom preset
SEED_PRESET=CUSTOM npm run seed:super
```

## 🔑 Default Credentials

All employees have:
- **Password:** `password123`
- **Email format:** `firstname.lastname@nexify.com`

## ⚙️ Environment Setup

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/neocrm-dev
```

## 📝 Data Highlights

- ✅ **Realistic data** using Faker.js
- ✅ **Proper relationships** between all entities
- ✅ **Historical data** (up to 3 years old)
- ✅ **Varied distributions** (not uniform)
- ✅ **Stage progressions** (deals, orders, tickets)
- ✅ **Interaction histories** (companies, contacts)
- ✅ **Social media profiles** (contacts)
- ✅ **Multiple products** per order
- ✅ **Payment tracking** (orders)
- ✅ **Resolution tracking** (tickets)

## 💡 Pro Tips

1. **Start small** - use `seed:small` for quick iterations
2. **Clear automatically** - scripts clear existing data
3. **Check progress** - real-time progress bars shown
4. **Increase memory** for extreme: `NODE_OPTIONS="--max-old-space-size=4096" npm run seed:extreme`
5. **Backup first** - always backup before seeding production-like data

## 🔍 Verification

After seeding, check your database:

```javascript
// MongoDB shell
use neocrm-dev
db.employees.countDocuments()
db.contacts.countDocuments()
db.companies.countDocuments()
db.deals.countDocuments()
db.orders.countDocuments()
db.tickets.countDocuments()
```

## 📚 Full Documentation

See [SEEDING.md](./SEEDING.md) for complete documentation.
