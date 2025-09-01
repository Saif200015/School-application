import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import fs from 'fs/promises';
import path from 'path';

// POST: Add a new school with image upload
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const contact = formData.get('contact') as string;
    const email_id = formData.get('email_id') as string;
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Save image to public/schoolImages
    const uploadDir = path.join(process.cwd(), 'public/schoolImages');
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/schoolImages/${fileName}`;

    // Insert into DB
    await pool.query(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, imageUrl, email_id]
    );

    return NextResponse.json({ message: 'School added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add school' }, { status: 500 });
  }
}

// GET: Fetch all schools
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM schools');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}