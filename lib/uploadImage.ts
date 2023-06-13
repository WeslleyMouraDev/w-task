import { ID, storage } from '@/appwrite';

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    '6484db535c7311c06a36',
    ID.unique(),
    file
  );

  return fileUploaded;
};

export default uploadImage;
