import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// import pg from "pg";

export const db = new Pool({

    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl:{

        rejectUnauthorized: false
    }
});

// export const db = new pg.Client({

//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//     ssl:{

//         rejectUnauthorized: false
//     }
// });




