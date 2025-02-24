export async function Base64Encode(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Set up the onload event handler
        reader.onloadend = () => {
            resolve(reader.result); // Resolve the Promise with the Base64 encoded string
        };

        // Set up the onerror event handler
        reader.onerror = (error) => {
            reject(error); // Reject the Promise with the error
        };

        // Start reading the file as a data URL
        reader.readAsDataURL(file);
    });
}