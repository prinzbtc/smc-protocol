import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { IncomingForm } from 'formidable';

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to save file to disk
async function saveFileToDisk(originalFilePath: string, originalFilename: string, contentType: string): Promise<string> {
  // Determine folder based on content type (articles or reports)
  const contentFolder = contentType === 'article' ? 'articles' : 'reports';
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', contentFolder);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Generate unique filename with original extension
  const fileExt = path.extname(originalFilename) || '.jpg';
  const uniqueFileName = `${uuidv4()}${fileExt}`;
  const destPath = path.join(uploadsDir, uniqueFileName);
  
  // Copy file to destination
  fs.copyFileSync(originalFilePath, destPath);
  
  // Return the URL for the file
  return `/uploads/${contentFolder}/${uniqueFileName}`;
}

// Helper to parse form data with formidable
const parseForm = async (req: NextRequest): Promise<{ fields: any; files: any }> => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  // Create temp directory if it doesn't exist
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  // Save file to temp directory
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const tempFilePath = path.join(tmpDir, `${uuidv4()}-${file.name}`);
  fs.writeFileSync(tempFilePath, buffer);
  
  return {
    fields: Object.fromEntries(formData.entries()),
    files: {
      file: {
        filepath: tempFilePath,
        originalFilename: file.name,
        mimetype: file.type,
        size: file.size
      }
    }
  };
};

export async function POST(request: NextRequest) {
  try {
    // Get content type from query params
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type') || 'article';
    
    if (contentType !== 'article' && contentType !== 'report') {
      return NextResponse.json(
        { error: 'Invalid content type. Must be "article" or "report".' },
        { status: 400 }
      );
    }
    
    try {
      // Parse the form data
      const { files } = await parseForm(request);
      
      if (!files || !files.file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }
      
      // Get file details
      const { filepath, originalFilename } = files.file;
      
      // Save the file and get its public URL
      const fileUrl = await saveFileToDisk(filepath, originalFilename, contentType);
      
      // Clean up temp file
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
      
      // Return the URL to the client
      return NextResponse.json({ url: fileUrl });
    } catch (error) {
      console.error('Error processing upload:', error);
      return NextResponse.json(
        { error: 'Failed to process upload: ' + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
