import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
    envConfig.NEXT_PUBLIC_SUPABASE_URL,
    envConfig.SUPABASE_SERVICE_ROLE_KEY
);

async function promote() {
    // CORRECTED EMAIL
    const email = 'shanjaisenthilkumar03@gmail.com';
    console.log(`🔍 Finding user ${email}...`);

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Check your Service Role Key!', error);
        process.exit(1);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ User not found! Listing all users found:');
        users.forEach(u => console.log(` - ${u.email}`));
        process.exit(1);
    }

    console.log(`✅ Found User ID: ${user.id}`);

    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { role: 'admin' } }
    );

    if (updateError) {
        console.error('❌ Failed to update role:', updateError);
    } else {
        console.log('🎉 Success! User is now an ADMIN.');
    }
}

promote();
