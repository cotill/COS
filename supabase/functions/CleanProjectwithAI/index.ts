// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0"; // ignore the error, this is right
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'; //https://supabase.com/docs/guides/ai/examples/openai

const supUrl = Deno.env.get("SUPABASE_URL") as string;
const supKey =   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string; // I want to bypass RLS rules
const apiKey = Deno.env.get('OPENAI_API_KEY')

const supabase = createClient(supUrl, supKey);

console.log("Hello from Clean Project edge function!")

export interface Project {
  project_id: string; 
  title: string;
  creator_email: string;
  approval_email: string | null; 
  sponsor_email: string | null; 
  teamID: string | null; 
  description: string;
  department: "ENGINEERING" | "COMPUTER_SCIENCE" | "BIOMEDICAL" | "SUSTAINABILITY"; 
  created_date: string; 
  approved_date: string | null; 
  modified_date: string | null;
  start_date: string | null;
  github: string | null;
  status: "APPROVED" | "REJECTED" | "DRAFT" | "NEW" | "REVIEW" | "DISPATCHED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "AWARDED";
  university: "University of Calgary" | "University of British Columbia" | null;
  application_link: string | null;
  application_deadline: string | null;
  last_modified_date: string | null;
  last_modified_user: string | null; // email of the person who last modified the project
  activation_date: string | null;
  dispatcher_email: string | null;
  dispatched_date: string | null;
  project_budget: number;
  start_term: string | null;
  rejector_email: string | null;
  rejector_date: string | null;
}

interface WebhookPayload {
    type: "INSERT",
    table: "Projects",
    record: Project,
    schema: "public",
    old_record: null
}

Deno.serve(async (req) => {
  const payload : WebhookPayload = await req.json()
  const project_id = payload.record.project_id;
  console.log("Payload was ...", payload)

  // call openAI
  const openai = new OpenAI({apiKey:apiKey,})
  const message = `Please clean and expand on the following project description:\n\n${payload.record.description}`;
  console.log("messaged sent to gpt-4o-mini was: ", message);

  // Documentation here: https://github.com/openai/openai-node
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    // Choose model from here: https://platform.openai.com/docs/models
    model: 'gpt-4o-mini',
    stream: false,
  })

  const reply = chatCompletion.choices[0].message.content;

  const { data : updatedProject, error } = await supabase
  .from('Projects')
  .update({ description: reply, status: 'DRAFT' })
  .eq('project_id', project_id)
  .select();

  if (error) {
    console.log(`Error updating project with id: ${project_id}:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" },
       status: 500
      },
    )
  }
  // console.log(`Project with id: ${project_id}, description was updated to: ${updatedProject[0].description} `);
  // console.log(`and status is now: ${updatedProject[0].status}` );
  const {usage} = chatCompletion;
  console.log(`Conversation tokens - Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens}, Total: ${usage.total_tokens}`);
  return new Response(
    JSON.stringify(updatedProject),
    { headers: { "Content-Type": "application/json" },
     status: 200
    },
  )
})

/**
 * one token generally represents one piece of a word
 * pricing model:
 * gpt-4o -> $2.50 / 1M input tokens
 * gpt-4o-mini -> $0.150 / 1M input tokens
 * Calculator: https://gptforwork.com/tools/openai-chatgpt-api-pricing-calculator
 * The API is typically priced based on the amount of usage measured in tokens. 
 * This means you pay for the amount of text generated or processed by the API.
 */

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/CleanProjectwithAI' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
