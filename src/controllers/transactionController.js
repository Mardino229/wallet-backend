import {sql} from "../config/db.js";


export async function getTransactionById (req, res)  {
    try {
        const {title, amount, category, user_id} = req.body;
        console.log(req.body);
        if (!title || !amount || !category || !user_id) {
            return res.status(400).json({message: "All fields are required"});
        }

        const transaction = await sql`insert into transactions (user_id, title, amount, category) values (${user_id}, ${title}, ${amount},${category}) returning *`
        res.status(201).json({transaction})
    } catch (e) {
        console.log("Error creating transaction", e);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export async function createTransaction (req, res) {
    try{
        const {userId} = req.params;
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`
        res.status(200).json({transactions})
    }catch(err){
        console.log("Error getting transaction", err);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export async function deleteTransaction (req, res)  {
    try{
        const {id} = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({message: "Invalid transaction"});
        }
        const result = await sql`DELETE FROM transactions WHERE id = ${id} returning *`;
        console.log(result)
        if(result.length === 0){
            return res.status(404).json({message: "Transaction not found with this id"});
        }
        return res.status(200).json({message: "Transaction deleted successfully"});
    }catch(err){
        console.log("Error deleting transaction", err);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getSummaryById (req, res) {
    try {
        const {userId} = req.params;
        const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount>0`
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount<0`
        return res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
        })
    }catch (e) {
        console.log("Error getting transaction", e);
        return res.status(500).json({message: "Internal Server Error"});
    }
}