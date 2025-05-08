
export interface QueryRequest {
    naturalLanguageQuery: string;
    sqlDialect?: string;
}

export interface LLMResponse {
    sqlQuery: string;
    explanation: string;
    optimizationSuggestions: string;
}

export interface QueryResponse extends LLMResponse {
    // here we can add any additional fields from backend to frontend
    // for example we can add the metadata of the query
}

export interface LogEntry {
    natural_query: string;
    sql_dialect?: string;
    generated_sql: string;
    explanation?: string;
    optimization_suggestions?: string;
    error_message?: string;
}
