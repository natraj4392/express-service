import dotenv from 'dotenv';
import path from 'path';

/**
 * Initialize environment variables.
 */
const envPath=path.join(__dirname,".env");

dotenv.config({path:envPath});
