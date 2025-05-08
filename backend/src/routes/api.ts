
import { Router, Request, Response } from 'express';
import { generateSqlAndInsights } from '../services/llmService';
import { QueryRequest, LogEntry, QueryResponse } from '../types'; 
import knex from 'knex';

// importing knexConfig using require, as it's a .js file
const knexConfigModule = require('../../knexfile'); 
// determine environment and load appropriate config
const environment = process.env.NODE_ENV || 'development';
const effectiveKnexConfig = knexConfigModule[environment] || knexConfigModule.development;


const db = knex(effectiveKnexConfig);
const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const { naturalLanguageQuery, sqlDialect } = req.body as QueryRequest;

    if (!naturalLanguageQuery) {
        return res.status(400).json({ error: 'naturalLanguageQuery is required' });
    }

    let logEntry: Partial<LogEntry> = { 
        natural_query: naturalLanguageQuery,
        sql_dialect: sqlDialect,
    };

    try {
        const result: QueryResponse = await generateSqlAndInsights({ naturalLanguageQuery, sqlDialect });
        
        logEntry = {
            ...logEntry,
            generated_sql: result.sqlQuery,
            explanation: result.explanation,
            optimization_suggestions: result.optimizationSuggestions,
        };
        
        // await the insert if logging is critical, otherwise fire and forget
        await db('query_logs').insert(logEntry)
            .catch(dbError => console.error("DB logging error:", dbError)); 

        res.json(result);
    } catch (error: any) {
        console.error('Error in /api/query:', error);
        logEntry = {
            ...logEntry,
            generated_sql: 'ERROR',
            error_message: error.message || 'Failed to process query',
        };
        await db('query_logs').insert(logEntry) // logging errors to DB in case of failure
            .catch(dbError => console.error("DB logging error (on failure):", dbError));
        
        res.status(500).json({ error: error.message || 'Failed to process query' });
    }
});

export default router;
