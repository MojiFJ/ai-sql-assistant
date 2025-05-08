
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { QueryRequest, LLMResponse } from '../types';

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0125", 
    temperature: 0.1, 
});

const outputSchema = z.object({
  sqlQuery: z.string().describe("The generated SQL query. Ensure it is syntactically correct for the specified dialect."),
  explanation: z.string().describe("A concise explanation of how the SQL query works, including table names and conditions if applicable."),
  optimizationSuggestions: z.string().describe("Suggestions to optimize the SQL query, if any. If none or the query is simple, state that. For example, mention missing indexes if inferable or alternative ways to write the query for performance.")
});

export async function generateSqlAndInsights(request: QueryRequest): Promise<LLMResponse> {
    const { naturalLanguageQuery, sqlDialect = "PostgreSQL" } = request;

    const prompt = `
You are an expert SQL developer assistant.
The user wants to retrieve data using natural language. Your task is to:
1. Convert the user's natural language query into a SQL query for the ${sqlDialect} dialect. The query should be directly executable.
2. Provide a concise explanation of how the generated SQL query works.
3. Offer potential optimization suggestions for the generated SQL query. If the query is already optimal or very simple, explicitly state that.

User's natural language query: "${naturalLanguageQuery}"

Provide your response in a structured format containing 'sqlQuery', 'explanation', and 'optimizationSuggestions'.
Example for a simple query:
Natural Language: "Show me all users" (assuming a 'users' table)
SQL Query (PostgreSQL): "SELECT * FROM users;"
Explanation: "This query selects all columns (*) from the 'users' table."
Optimization Suggestions: "For a table with many columns and rows, consider selecting only necessary columns instead of '*' to reduce data transfer. If there are frequent lookups on specific columns, ensure appropriate indexes exist on those columns (e.g., on a 'user_id' or 'username' column if filtered by those)."

If the user's query is ambiguous or doesn't make sense for SQL generation, state that in the explanation and provide an empty SQL query and note the ambiguity in the explanation.
`;

    const llmWithTools = llm.withStructuredOutput(outputSchema);

    try {
        console.log(`Processing query for dialect: ${sqlDialect}, NLQ: "${naturalLanguageQuery}"`);
        const result = await llmWithTools.invoke([
            new HumanMessage(prompt)
        ]);

        return {
            sqlQuery: result.sqlQuery,
            explanation: result.explanation,
            optimizationSuggestions: result.optimizationSuggestions,
        };
    } catch (error) {
        console.error("Error calling LLM with structured output:", error);
        throw new Error(`Failed to process query with LLM. Details: ${(error as Error).message}`);
    }
}
