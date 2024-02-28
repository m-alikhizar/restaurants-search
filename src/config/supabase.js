const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zycfjdfjnslklfujqmsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y2ZqZGZqbnNsa2xmdWpxbXN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODk4ODQxNSwiZXhwIjoyMDI0NTY0NDE1fQ.-6ZC2iHgiMVGgeiJd9Ez3M_gqCwd86r0n0APe13oxiM';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
    supabase
};
