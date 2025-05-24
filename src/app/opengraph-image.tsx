import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'bimon.dev logo';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  // Read the image from the public/images directory
  const imageBuffer = readFileSync(join(process.cwd(), 'public/images/android-chrome-512x512.png'));

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#faf9f7',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={`data:image/png;base64,${imageBuffer.toString('base64')}`}
          width={320}
          height={320}
          alt="bimon.dev logo"
        />
      </div>
    ),
    {
      ...size
    }
  );
} 