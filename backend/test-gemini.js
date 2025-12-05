// Test Gemini API call with medical query
import { analyzeWithGemini } from './analyzer.js';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testAnalyzer() {
  console.log('Testing Gemini Analyzer...');
  console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT SET');
  
  try {
    const result = await analyzeWithGemini('What causes diabetes?', GEMINI_API_KEY);
    console.log('\n✅ SUCCESS!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('\n❌ ERROR!');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testAnalyzer();
