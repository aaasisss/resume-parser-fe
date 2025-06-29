export async function fileToBase64(file: File): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  return btoa(
    new Uint8Array(fileBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}
