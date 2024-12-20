export async function validateModelPaths(paths) {
  for (const [name, path] of Object.entries(paths)) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        console.error(`Failed to load ${name} from ${path}: ${response.statusText}`);
        return false;
      }
      
      const data = await response.json();
      if (!data || !Array.isArray(data)) {
        console.error(`Invalid model manifest for ${name}`);
        return false;
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