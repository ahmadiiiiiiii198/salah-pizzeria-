# 🚀 New Supabase Setup Checklist

## ✅ Pre-Setup
- [ ] Backup current database (if needed)
- [ ] Have all generated files ready
- [ ] Create new Supabase account/project

## ✅ Database Setup
- [ ] Create new Supabase project
- [ ] Note down new project credentials
- [ ] Run all migration files in order (see COMPLETE_SETUP_GUIDE.md)
- [ ] Verify all tables are created
- [ ] Run data-insertion-script.sql
- [ ] Verify data is imported correctly

## ✅ Code Update
- [ ] Update .env.new-supabase with your new credentials
- [ ] Run update-credentials.mjs script
- [ ] Test database connection
- [ ] Update any hardcoded URLs in your code

## ✅ Testing
- [ ] Run check-supabase.js to test connection
- [ ] Test admin panel login
- [ ] Test all major features
- [ ] Verify RLS policies work correctly

## ✅ Deployment
- [ ] Update production environment variables
- [ ] Deploy updated code
- [ ] Test production environment
- [ ] Update DNS/domain settings if needed

## 📁 Generated Files Summary

### Database Structure
- `all-migrations-combined.sql` - Complete migration history
- `extracted-rls-policies.sql` - All RLS policies
- `database-recreation-*.sql` - Basic table structure

### Data
- `database-export-*.json` - Complete data export
- `data-insertion-script.sql` - Data insertion script

### Setup Helpers
- `COMPLETE_SETUP_GUIDE.md` - Detailed setup guide
- `.env.new-supabase` - Environment template
- `update-credentials.mjs` - Credential update script
- `database-documentation-*.md` - Table documentation

## 🔑 Key Information

**Original Project**: yliofvqfyimlbxjmsuow
**Tables**: 10
**Total Records**: 194

**Important Tables**:
- settings (46 records) - All configuration
- categories (17 records) - Product categories
- products (127 records) - All products
- content_sections (4 records) - Page content

## 🆘 Troubleshooting

If something goes wrong:
1. Check Supabase dashboard logs
2. Verify migration order
3. Check RLS policies
4. Test with provided scripts
5. Refer to COMPLETE_SETUP_GUIDE.md

## 📞 Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
