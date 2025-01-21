export const downloadFile = async (pngBlob: Promise<Blob>) => {
  try {
    const blob = await pngBlob;
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "qr_code.png";
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
