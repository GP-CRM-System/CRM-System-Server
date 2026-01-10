# 🎯 Seeding Script Selector

Not sure which seeding script to use? Use this guide to choose the right one!

## Quick Decision Tree

```
What do you need?
│
├─ Just testing a feature?
│  └─ Use: npm run seed:small (290 records, ~10s)
│
├─ Developing/Debugging?
│  └─ Use: npm run seed:medium (3,020 records, ~30s)
│
├─ Preparing a demo?
│  └─ Use: npm run seed:massive (5,025 records, ~45s)
│
├─ Testing performance?
│  └─ Use: SEED_PRESET=MASSIVE npm run seed:super (19,530 records, ~2m)
│
└─ Load/Stress testing?
   └─ Use: npm run seed:extreme (59,050 records, ~5m)
```

## Detailed Comparison

### 1. Basic Seed (`npm run seed`)
```
Records: ~70
Time: ~5 seconds
Memory: Low
```

**Use When:**
- ✅ Quick feature testing
- ✅ Unit testing
- ✅ Just need a few records
- ✅ Learning the system

**Don't Use When:**
- ❌ Testing relationships
- ❌ Testing performance
- ❌ Preparing demos
- ❌ Testing at scale

---

### 2. Small Preset (`npm run seed:small`)
```
Records: ~290
Time: ~10 seconds
Memory: Low
```

**Breakdown:**
- 10 Roles
- 20 Employees
- 50 Contacts
- 30 Companies
- 40 Deals
- 60 Orders
- 80 Tickets

**Use When:**
- ✅ Daily development work
- ✅ Testing specific features
- ✅ Integration testing
- ✅ Debugging relationships
- ✅ Fast iterations needed

**Don't Use When:**
- ❌ Need realistic data volume
- ❌ Testing pagination
- ❌ Performance testing
- ❌ Stakeholder demos

---

### 3. Medium Preset (`npm run seed:medium`)
```
Records: ~3,020
Time: ~30 seconds
Memory: Low-Medium
```

**Breakdown:**
- 20 Roles
- 100 Employees
- 500 Contacts
- 250 Companies
- 400 Deals
- 750 Orders
- 1,000 Tickets

**Use When:**
- ✅ Integration testing
- ✅ QA testing
- ✅ Testing search/filter
- ✅ Testing pagination
- ✅ Realistic development
- ✅ Internal demos

**Don't Use When:**
- ❌ Performance testing
- ❌ Load testing
- ❌ Need thousands of records
- ❌ Stress testing

---

### 4. Large/Massive Preset (`npm run seed:massive`)
```
Records: ~5,025
Time: ~45 seconds
Memory: Medium
```

**Breakdown:**
- 25 Roles
- 200 Employees
- 1,000 Contacts
- 500 Companies
- 800 Deals
- 1,500 Orders
- 2,000 Tickets

**Use When:**
- ✅ Client demos
- ✅ Stakeholder presentations
- ✅ Testing complex queries
- ✅ Testing analytics
- ✅ Realistic scenarios
- ✅ User acceptance testing
- ✅ Training sessions

**Don't Use When:**
- ❌ Quick iterations needed
- ❌ Limited system resources
- ❌ Testing simple features
- ❌ Extreme performance testing

**⭐ RECOMMENDED FOR MOST USE CASES**

---

### 5. Massive Preset (`SEED_PRESET=MASSIVE npm run seed:super`)
```
Records: ~19,530
Time: ~2 minutes
Memory: Medium-High
```

**Breakdown:**
- 30 Roles
- 500 Employees
- 3,000 Contacts
- 1,500 Companies
- 2,500 Deals
- 5,000 Orders
- 7,000 Tickets

**Use When:**
- ✅ Performance testing
- ✅ Query optimization
- ✅ Index testing
- ✅ Testing at scale
- ✅ Database optimization
- ✅ Pre-production testing

**Don't Use When:**
- ❌ Daily development
- ❌ Limited time/resources
- ❌ Quick testing needed
- ❌ Low-powered machine

---

### 6. Extreme Preset (`npm run seed:extreme`)
```
Records: ~59,050
Time: ~5 minutes
Memory: High
```

**Breakdown:**
- 50 Roles
- 1,000 Employees
- 10,000 Contacts
- 5,000 Companies
- 8,000 Deals
- 15,000 Orders
- 20,000 Tickets

**Use When:**
- ✅ Load testing
- ✅ Stress testing
- ✅ Enterprise-scale testing
- ✅ Database performance tuning
- ✅ Infrastructure testing
- ✅ Scalability validation

**Don't Use When:**
- ❌ Regular development
- ❌ Limited resources
- ❌ Limited time
- ❌ Not testing scale

**⚠️ Requires adequate system resources**

---

## Resource Requirements

| Preset | CPU | RAM | Time | Disk |
|--------|-----|-----|------|------|
| Basic | Low | < 512MB | 5s | < 1MB |
| Small | Low | < 512MB | 10s | < 5MB |
| Medium | Medium | 1GB | 30s | ~10MB |
| Large | Medium | 2GB | 45s | ~20MB |
| Massive | High | 4GB | 2m | ~50MB |
| Extreme | High | 8GB+ | 5m | ~150MB |

---

## Use Case Matrix

| Use Case | Recommended Script | Why? |
|----------|-------------------|------|
| Feature Development | Small/Medium | Fast, sufficient data |
| Bug Fixing | Small | Quick iterations |
| Integration Testing | Medium | Realistic relationships |
| QA Testing | Large/Massive | Production-like |
| Client Demos | Large/Massive | Impressive volume |
| Performance Testing | Massive | Stress the system |
| Load Testing | Extreme | Maximum stress |
| Training | Medium/Large | Enough to explore |
| Documentation | Medium | Good examples |
| Unit Tests | Basic/Small | Fast execution |

---

## Typical Workflow

### Development Phase
```bash
# Day-to-day work
npm run seed:small

# Weekly integration test
npm run seed:medium
```

### Testing Phase
```bash
# QA testing
npm run seed:large

# Performance validation
SEED_PRESET=MASSIVE npm run seed:super
```

### Pre-Production
```bash
# Load testing
npm run seed:extreme

# Final demo prep
npm run seed:massive
```

---

## Tips for Choosing

### Choose SMALLER if:
- 🚀 You need fast iterations
- 💻 You have limited resources
- 🐛 You're debugging a specific issue
- ⚡ You want quick feedback

### Choose LARGER if:
- 🎯 You need realistic scenarios
- 📊 You're testing analytics
- 🎭 You're doing a demo
- 🔍 You're testing search/pagination
- 📈 You're testing performance

---

## Pro Tips

1. **Start Small**: Begin with `seed:small`, increase as needed
2. **Match Your Need**: Don't use `extreme` for feature testing
3. **Consider Time**: Larger datasets take longer to generate
4. **Monitor Resources**: Watch RAM usage with larger presets
5. **Backup First**: Always backup before seeding production-like data
6. **Test Incrementally**: Test with medium before jumping to extreme
7. **Document Choice**: Note which preset works best for your scenarios

---

## Quick Reference

```bash
# I need to...
# → test a single feature
npm run seed:small

# → do daily development
npm run seed:medium

# → prepare a demo
npm run seed:massive

# → test performance
SEED_PRESET=MASSIVE npm run seed:super

# → stress test the system
npm run seed:extreme
```

---

## Still Unsure?

**Default recommendation: `npm run seed:massive`**

This preset provides:
- ✅ Enough data to be realistic
- ✅ Fast enough for regular use
- ✅ Good for demos and testing
- ✅ Won't overwhelm your system
- ✅ Shows relationships clearly

---

**Need more help?** Check out:
- 📖 [Full Documentation](./SEEDING.md)
- ⚡ [Quick Reference](./SEEDING-QUICK.md)
- 📋 [Summary](./SEEDING-SUMMARY.md)
