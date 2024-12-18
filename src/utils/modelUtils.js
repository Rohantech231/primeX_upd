export async function validateModelPaths(paths) {
  for (const [name, path] of Object.entries(paths)) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${name} from ${path}`);
      }
    } catch (error) {
      console.error(`Error validating model path for ${name}:`, error);
      return false;
    }
  }
  return true;
}

export function getModelLoadingProgress(loaded, total) {
  return Math.round((loaded / total) * 100);
}