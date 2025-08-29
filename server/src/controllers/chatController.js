const supabaseService = require('../services/supabaseService');
const geminiService = require('../services/geminiService');

// @desc    Ask a question using RAG
// @route   POST /api/chat/ask
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    console.log(`🤔 User ${userId} asked: ${question}`);

    // Generate embedding for the question
    const questionEmbedding = await geminiService.generateEmbedding(question);

    // ALWAYS search database first - try text search for better results
    let relevantDocuments = await supabaseService.searchDocumentsByText(question, 5);
    console.log(`🔍 Database search found ${relevantDocuments.length} relevant documents`);
    
    // If text search fails, try vector search as backup
    if (relevantDocuments.length === 0) {
      console.log('🔄 Text search failed, trying vector search...');
      relevantDocuments = await supabaseService.searchDocuments(questionEmbedding, 5);
      console.log(`🔍 Vector search found ${relevantDocuments.length} relevant documents`);
    }
    
    // Debug content if no relevant documents found
    if (relevantDocuments.length === 0) {
      console.log('⚠️ No relevant documents found, debugging content...');
      await supabaseService.debugContent();
    }
    
    let answer;

    // Try to get relevant documents from database first
    if (relevantDocuments.length > 0) {
      // Use database content with Grok AI
      const context = relevantDocuments
        .map(doc => doc.content)
        .join('\n\n');
      
      console.log(`📄 Context from ${relevantDocuments.length} documents, total length: ${context.length}`);
      console.log(`📄 First document preview: ${relevantDocuments[0].content.substring(0, 100)}...`);
      
      answer = await geminiService.generateAnswer(question, context);
      


    } else {
      console.log('⚠️ No relevant documents found in database, using general response');
      // Use Gemini AI for general responses when no database content
      answer = await geminiService.generateChatCompletion(question);
    }

    console.log(`✅ Generated answer successfully`);

    res.json({
      success: true,
      data: {
        answer,
        question
      }
    });

  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process question',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Upload and process document
// @route   POST /api/chat/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const { content, filename } = req.body;
    const userId = req.user.id;

    if (!content || !filename) {
      return res.status(400).json({
        success: false,
        message: 'Document content and filename are required'
      });
    }

    console.log(`📄 User ${userId} uploading: ${filename}`);

    // Process document text into chunks with embeddings
    const processedChunks = await geminiService.processDocumentText(content, filename);

    // Insert chunks into Supabase
    const success = await supabaseService.insertDocumentChunks(processedChunks);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to store document'
      });
    }

    res.json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        filename,
        chunks: processedChunks.length,
        totalCharacters: content.length
      }
    });

  } catch (error) {
    console.error('❌ Error in uploadDocument:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get document statistics
// @route   GET /api/chat/documents
// @access  Private
const getDocumentStats = async (req, res) => {
  try {
    const documents = await supabaseService.getAllDocuments();

    const stats = {
      totalDocuments: documents.length,
      totalChunks: documents.length,
      uniqueFiles: [...new Set(documents.map(doc => doc.filename))].length,
      documents: documents.map(doc => ({
        filename: doc.filename,
        chunkIndex: doc.chunk_index,
        totalChunks: doc.total_chunks,
        createdAt: doc.created_at
      }))
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error in getDocumentStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get document statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete all documents
// @route   DELETE /api/chat/documents
// @access  Private
const deleteAllDocuments = async (req, res) => {
  try {
    const success = await supabaseService.deleteAllDocuments();

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete documents'
      });
    }

    res.json({
      success: true,
      message: 'All documents deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error in deleteAllDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete documents',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Initialize database
// @route   POST /api/chat/init
// @access  Private
const initializeDatabase = async (req, res) => {
  try {
    const success = await supabaseService.initializeDatabase();

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize database'
      });
    }

    res.json({
      success: true,
      message: 'Database initialized successfully'
    });

  } catch (error) {
    console.error('❌ Error in initializeDatabase:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize database',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  askQuestion,
  uploadDocument,
  getDocumentStats,
  deleteAllDocuments,
  initializeDatabase
};
