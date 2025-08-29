const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  constructor() {
    this.supabase = supabase;
  }

  // Initialize the database with pgvector extension and documents table
  async initializeDatabase() {
    try {
      // Enable pgvector extension
      await this.supabase.rpc('enable_vector_extension');
      console.log('✅ pgvector extension enabled');

      // Create documents table if it doesn't exist
      const { error: tableError } = await this.supabase.rpc('create_documents_table');
      if (tableError) {
        console.log('Documents table might already exist or error:', tableError.message);
      } else {
        console.log('✅ Documents table created');
      }

      // Create match_documents function
      const { error: functionError } = await this.supabase.rpc('create_match_documents_function');
      if (functionError) {
        console.log('match_documents function might already exist or error:', functionError.message);
      } else {
        console.log('✅ match_documents function created');
      }

      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return false;
    }
  }

  // Insert document chunks with embeddings
  async insertDocumentChunks(chunks) {
    try {
      // Convert chunks to match your table structure (only content and embedding)
      const simplifiedChunks = chunks.map(chunk => ({
        content: chunk.content,
        embedding: chunk.embedding
      }));

      const { data, error } = await this.supabase
        .from('documents')
        .insert(simplifiedChunks);

      if (error) {
        console.error('❌ Error inserting chunks:', error);
        return false;
      }

      console.log(`✅ Inserted ${chunks.length} document chunks`);
      return true;
    } catch (error) {
      console.error('❌ Error inserting document chunks:', error);
      return false;
    }
  }

  // Search for similar documents using vector similarity
  async searchDocuments(queryEmbedding, matchCount = 5) {
    try {
      const { data, error } = await this.supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_count: matchCount
      });

      if (error) {
        console.error('❌ Error searching documents:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error searching documents:', error);
      return [];
    }
  }

  // Search for documents using text search (ALWAYS search database first)
  async searchDocumentsByText(query, matchCount = 5) {
    try {
      console.log('🔍 ALWAYS searching database for:', query);
      
      // Extract key words from the query
      const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
      console.log('🔍 Search words:', words);
      
      // ALWAYS search for ANY relevant content in database
      let allResults = [];
      
      // Search for each word in the query
      for (const word of words) {
        if (word.length > 2) {
          console.log(`🔍 Searching for word: "${word}"`);
          
          const { data, error } = await this.supabase
            .from('documents')
            .select('id, content')
            .ilike('content', `%${word}%`)
            .limit(matchCount);
          
          if (!error && data && data.length > 0) {
            console.log(`✅ Found ${data.length} documents with "${word}"`);
            allResults = allResults.concat(data);
          }
        }
      }
      
      // Also search for related terms (e.g., "brokerage" when asking about "broker")
      const relatedTerms = {
        'broker': ['brokerage', 'agent', 'real estate'],
        'brokerage': ['broker', 'agent', 'real estate'],
        'agent': ['broker', 'brokerage', 'real estate'],
        'act': ['section', 'regulation', 'law'],
        'section': ['act', 'regulation', 'law']
      };
      
      for (const word of words) {
        if (relatedTerms[word.toLowerCase()]) {
          for (const relatedTerm of relatedTerms[word.toLowerCase()]) {
            console.log(`🔍 Searching for related term: "${relatedTerm}"`);
            
            const { data, error } = await this.supabase
              .from('documents')
              .select('id, content')
              .ilike('content', `%${relatedTerm}%`)
              .limit(matchCount);
            
            if (!error && data && data.length > 0) {
              console.log(`✅ Found ${data.length} documents with "${relatedTerm}"`);
              allResults = allResults.concat(data);
            }
          }
        }
      }
      
      // Remove duplicates based on content
      const uniqueResults = allResults.filter((doc, index, self) => 
        index === self.findIndex(d => d.content === doc.content)
      );
      
      if (uniqueResults.length > 0) {
        console.log(`✅ Total unique documents found: ${uniqueResults.length}`);
        
        // Add similarity scores
        const results = uniqueResults.map(doc => ({
          ...doc,
          similarity: 0.85 // Good similarity for database content
        }));
        
        return results.slice(0, matchCount);
      }
      
      // If no results found, try broader search
      console.log('🔍 Trying broader search...');
      const { data, error } = await this.supabase
        .from('documents')
        .select('id, content')
        .limit(matchCount);
      
      if (!error && data && data.length > 0) {
        console.log(`✅ Found ${data.length} documents in broader search`);
        return data.map(doc => ({
          ...doc,
          similarity: 0.5 // Lower similarity for broader results
        }));
      }
      
      console.log('❌ No documents found in database');
      return [];
      
    } catch (error) {
      console.error('❌ Error in text search:', error);
      return [];
    }
  }

  // Get all documents (for debugging)
  async getAllDocuments() {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching documents:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      return [];
    }
  }

  // Delete all documents (for reset)
  async deleteAllDocuments() {
    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) {
        console.error('❌ Error deleting documents:', error);
        return false;
      }

      console.log('✅ All documents deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting documents:', error);
      return false;
    }
  }

  // Debug method to check content
  async debugContent() {
    try {
      console.log('🔍 Debugging database content...');
      
      // Check for broker content
      const { data: brokerDocs, error: brokerError } = await this.supabase
        .from('documents')
        .select('id, content')
        .ilike('content', '%broker%')
        .limit(5);
      
      if (brokerError) {
        console.error('❌ Error checking broker content:', brokerError);
      } else {
        console.log(`📊 Found ${brokerDocs.length} documents with 'broker'`);
        if (brokerDocs.length > 0) {
          console.log('📋 Sample broker content:');
          console.log(brokerDocs[0].content.substring(0, 200) + '...');
        }
      }
      
      // Check for agent content
      const { data: agentDocs, error: agentError } = await this.supabase
        .from('documents')
        .select('id, content')
        .ilike('content', '%agent%')
        .limit(5);
      
      if (agentError) {
        console.error('❌ Error checking agent content:', agentError);
      } else {
        console.log(`📊 Found ${agentDocs.length} documents with 'agent'`);
      }
      
      // Check for section content
      const { data: sectionDocs, error: sectionError } = await this.supabase
        .from('documents')
        .select('id, content')
        .ilike('content', '%section%')
        .limit(5);
      
      if (sectionError) {
        console.error('❌ Error checking section content:', sectionError);
      } else {
        console.log(`📊 Found ${sectionDocs.length} documents with 'section'`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error debugging content:', error);
      return false;
    }
  }
}

module.exports = new SupabaseService();
