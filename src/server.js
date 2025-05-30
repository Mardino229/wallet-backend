import express from 'express';
import dotenv from 'dotenv';
import {sql} from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";
import job from "./config/cron.js";


dotenv.config();
const app = express();

if (process.env.NODE_ENV !== "production") {
    job.start();
}

app.use(rateLimiter);
app.use(express.json());
// connectDB(process.env.DATABASE_URL);
app.get("/", (req, res) => {
    res.send("It's working");
})
console.log(process.env.PORT);

app.get("/api/health", (req, res) => {
    res.status(200).json({status: "OK"});
})

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            amount DECIMAL(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

        console.log("Database Initialized");
    } catch (error) {
        console.log("Error initializing db", error)
        process.exit(1);
    }
}

app.use("/api/transactions", transactionsRoute);
initDB().then(() => {
    app.listen(process.env.PORT, ()=> {
        console.log('Express server is running on port', process.env.PORT);
    })
});