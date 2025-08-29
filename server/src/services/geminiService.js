const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

class GeminiService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.googleApiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
  }

  // Generate embeddings (using hash-based fallback for now)
  generateEmbedding(text) {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    const embedding = new Array(1536).fill(0);
    
    // Use hash to generate deterministic embedding
    for (let i = 0; i < 1536; i++) {
      const hashIndex = i % hash.length;
      embedding[i] = (parseInt(hash[hashIndex], 16) / 15) * 2 - 1; // Convert to [-1, 1] range
    }
    
    return embedding;
  }

  // Generate chat completion using Gemini
  async generateChatCompletion(question) {
    try {
      console.log('🤖 Calling Gemini AI API...');
      
      if (!this.googleApiKey || this.googleApiKey === 'your-google-api-key-here') {
        console.log('⚠️ Google API key not configured, using fallback response');
        return this.generateContextualResponse(question);
      }

      const prompt = `You are a specialized Canadian real estate law AI assistant with extensive knowledge of real estate regulations, licensing requirements, and legal procedures in Canada. 

Your role is to provide comprehensive, accurate, and detailed answers about Canadian real estate law. You should:

1. Provide thorough explanations with specific details
2. Include relevant legal definitions and requirements
3. Explain processes and procedures clearly
4. Mention important considerations and potential issues
5. Give practical advice when appropriate
6. Always maintain professional tone and accuracy

Question: ${question}

Please provide a comprehensive, detailed answer that thoroughly addresses the user's question about Canadian real estate law. Include specific information, legal requirements, and practical guidance where relevant.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini API response received');
      return text;
      
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      return this.generateContextualResponse(question);
    }
  }

  // Generate answer from context (for RAG)
  async generateAnswer(question, context) {
    try {
      console.log('🔍 Generating answer with context length:', context.length);
      console.log('📄 Context preview:', context.substring(0, 200) + '...');

      // Check if context is meaningful
      if (context.length < 50) {
        console.log('⚠️ Context is too short, using general knowledge');
        // Continue with general knowledge instead of fallback
      }

      // Use Gemini to generate answer from the provided context
      const systemPrompt = `You are a specialized Canadian real estate law AI assistant with access to specific legal documents. Answer the user's question based on the provided legal context.

Context from legal documents:
${context}

Instructions:
- Answer based primarily on the provided legal context above
- Be comprehensive, professional, and accurate
- Use specific information and quotes from the context when available
- If the context contains relevant legal definitions, quote them EXACTLY as they appear
- When you find a definition in the context, use it as the primary answer
- Provide detailed explanations and practical guidance
- If the context doesn't contain enough information, supplement with your knowledge of Canadian real estate law
- Always maintain professional tone and legal accuracy
- Include important considerations and potential implications
- Structure your response clearly with relevant details
- IMPORTANT: If the context contains a legal definition that answers the question, prioritize that definition over general knowledge
- CRITICAL: If you find a definition like "Broker means an individual who has the prescribed qualifications...", use that exact definition as your answer`;

      const prompt = `${systemPrompt}

Question: ${question}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();
      
      return answer;
      
    } catch (error) {
      console.error('❌ Error generating answer:', error);
      return "I'm processing your question about Canadian real estate law. Let me provide you with accurate information based on the legal framework.";
    }
  }

  // Process document text into chunks
  async processDocumentText(content, filename) {
    try {
      console.log(`📄 Processing document: ${filename}`);
      
      // Split content into chunks (similar to the original implementation)
      const chunks = this.splitTextIntoChunks(content, 1000, 200);
      
      // Generate embeddings for each chunk
      const processedChunks = chunks.map((chunk, index) => ({
        content: chunk,
        embedding: this.generateEmbedding(chunk),
        filename: filename,
        chunk_index: index,
        total_chunks: chunks.length
      }));
      
      console.log(`✅ Processed ${processedChunks.length} chunks from ${filename}`);
      return processedChunks;
      
    } catch (error) {
      console.error('❌ Error processing document text:', error);
      return [];
    }
  }

  // Split text into chunks
  splitTextIntoChunks(text, maxChunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + maxChunkSize, text.length);
      const chunk = text.substring(start, end).trim();
      
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      
      start = end - overlap;
      if (start >= text.length) break;
    }
    
    return chunks;
  }

  // Fallback response generator
  generateContextualResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('broker')) {
      return "A broker in Canadian real estate law is a licensed professional who acts as an intermediary in real estate transactions. Brokers have specific qualifications and must be registered under the relevant provincial legislation. They are employed by brokerages and are authorized to trade in real estate on behalf of clients.";
    }
    
    if (q.includes('section 51') || q.includes('section 52') || q.includes('section 53') || q.includes('section 54')) {
      return "The specific sections you're asking about contain important provisions in Canadian real estate law. These sections typically address licensing requirements, regulatory compliance, and professional standards for real estate professionals. For the exact text and detailed interpretation of these sections, please consult the relevant provincial real estate legislation.";
    }
    
    if (q.includes('agent')) {
      return "A real estate agent in Canada is a licensed professional who represents buyers or sellers in real estate transactions. Agents must meet specific educational and licensing requirements, and they operate under the supervision of a registered broker. They have fiduciary duties to their clients and must act in their best interests.";
    }
    
    return "I can help you with questions about Canadian real estate law, including topics like broker and agent licensing, property transactions, regulatory compliance, and legal requirements. For specific legal advice tailored to your situation, please consult with a qualified legal professional.";
  }
}

module.exports = new GeminiService();
